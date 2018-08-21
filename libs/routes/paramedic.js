var express = require('express');
//var passport = require('passport');

var router = express.Router();


const AdminConnection = require('composer-admin').AdminConnection;
var CryptoJS = require ("crypto-js");

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const businessNetworkConnection = new BusinessNetworkConnection();
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

//use admin connection
const adminConnection = new AdminConnection();
const businessNetworkName = 'ehr-app';
const connectionProfile = require('./sample.json');

const cardName = "admin@ehr-app";
const businessNetworkIdentifier = "ehr-app@0.0.1";

function encryptField(dataToEncrypt) {
  return CryptoJS.AES.encrypt(dataToEncrypt, 'secret key 123').toString();
}


function decryptField(dataToDecrypt) {
  return CryptoJS.AES.decrypt(dataToDecrypt, 'secret key 123').toString(CryptoJS.enc.Utf8);
}

function participantRegistry(registryName) {
  return businessNetworkConnection.getParticipantRegistry(registryName);
}


function issueIdentity(namespace, participant, id, cardName) {
  return businessNetworkConnection.issueIdentity(namespace + '.' + participant + '#' + id, cardName)
}


function getIdCard(metadata) {
  //get connectionProfile from json, create Idcard
  return new IdCard(metadata, connectionProfile);
}

function createMetaData(identity) {
  return {
      userName: identity.userID,
      version: 1,
      enrollmentSecret: identity.userSecret,
      businessNetwork: businessNetworkName
  };
}

router.post('/',  function (req, res) {
        return businessNetworkConnection.connect(cardName)

          .then(() => {
              return participantRegistry("ehr.com.Paramedics")
            })

          .then(participantRegistry => {
              const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
              paramedic = factory.newResource('ehr.com', 'Paramedics', req.body.paramedicId);
              console.log("HIII")
              console.log(paramedic)
              //paramedic.firstName = req.body.firstName;
              paramedic.reason = encryptField(req.body.reason);
              paramedic.location = encryptField(req.body.location);


              console.log("blah")
              paramedic.patientId = factory.newRelationship('ehr.com', 'Patient', req.body.patientId);
              console.log(paramedic.patientId)
              console.log("huh?")
              return participantRegistry.add(paramedic);
           })

            .then((err) => {
              return issueIdentity("ehr.com", "Paramedics", req.body.paramedicId, req.body.paramedicId + "_" + req.body.location);
            })

            .then(identity => {
              return adminConnection.importCard(req.body.paramedicId, getIdCard(createMetaData(identity)));
            })

            .then(() => {
              return businessNetworkConnection.disconnect();
            })

            .then(() => {
              return res.json({
                status: 'OK, done!',
                body: paramedic
              });
        })
        .catch(errs => {
          console.log(errs);
              return res.json({
                error: {
                  message: errs.toString()
                }
              });
        });
});

router.get('/:id', function (req, res) {
  let exists;
  let assets;
  let paramedic;
  console.log("dfdk")
  const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
  const businessNetworkConnection = new BusinessNetworkConnection();
  return businessNetworkConnection.connect(req.params.id)
    .then(() => {
        return businessNetworkConnection.getParticipantRegistry(
            'ehr.com.Paramedics');
      })
    .then(assetRegistry => {
        assets=assetRegistry;
        return assetRegistry.exists(req.params.id);
      })
      .then((result) => {
        exists = result;
        if (result) {
          return assets.get(req.params.id);
        }
      })
      .then((result) => {
          if (exists) {
            paramedic = businessNetworkConnection.getBusinessNetwork()
                       .getSerializer()
                       .toJSON(result);
              paramedic.location = decryptField(paramedic.location)
          paramedic.reason = decryptField(paramedic.reason)
          }
          return businessNetworkConnection.disconnect();
        })
        .then(() => {
          if (exists) {
            res.json({
              body : paramedic,
              message: 'paramedic has been retrieved successfully',
              dev_message: 'Success'
            });
          } else {
            res.json({
              message: 'There is no such paramedic'
            });
          }
        })
        .catch(err => {
          return res.json({
            error: {
              message: err.toString()
            }
          });
});
});

router.put('/:id', function (req, res) {
  return businessNetworkConnection.connect(cardName)

    .then(() => {
        return participantRegistry("ehr.com.Paramedics")
      })

    .then(participantRegistry => {
      const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
      paramedic = factory.newResource('ehr.com', 'Paramedics', req.params.paramedicId);
      paramedic.location = encryptField(req.body.location);
      paramedic.reason = encryptField(req.body.reason);
      paramedic.patientId = factory.newRelationship('ehr.com', 'Patient', req.body.patientId);

      return participantRegistry.update(paramedic);
    })
    .then(() => {
      return businessNetworkConnection.disconnect();
    })
    .then(() => {
      return res.json({
        status: 'OK, done!'

    });
    })
    .catch(errs => {
          return res.json({
            error: {
              message: errs.toString()
            }
          });
    });

});


module.exports = router;
