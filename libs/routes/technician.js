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
              return participantRegistry("ehr.com.Technician")
            })

          .then(participantRegistry => {
              const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
              technician = factory.newResource('ehr.com', 'Technician', req.body.id);
              console.log("HIII")
              console.log(technician)
              //technician.firstName = req.body.firstName;
              var firstnameenc = encryptField(req.body.firstName);
              var lastnameenc = encryptField(req.body.lastName);
              var specialtyenc = encryptField(req.body.specialty);
              console.log("encrypting...")
              technician.firstName = firstnameenc;
              technician.lastName = lastnameenc;
              technician.specialty = specialtyenc;
              console.log("blah")
              technician.patient = factory.newRelationship('ehr.com', 'Patient', req.body.patient);
              console.log(technician.patient)
              console.log("huh?")
              return participantRegistry.add(technician);
           })

            .then((err) => {
              return issueIdentity("ehr.com", "Technician", req.body.id, req.body.id + "_" + req.body.firstName);
            })

            .then(identity => {
              return adminConnection.importCard(req.body.id, getIdCard(createMetaData(identity)));
            })

            .then(() => {
              return businessNetworkConnection.disconnect();
            })

            .then((r) => {
              console.log(r)
              return res.json({
                status: 'OK, done!'
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
  let technician;
  console.log("dfdk")
  const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
  const businessNetworkConnection = new BusinessNetworkConnection();
  return businessNetworkConnection.connect(req.params.id)
    .then(() => {
        return businessNetworkConnection.getParticipantRegistry(
            'ehr.com.Technician');
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
            technician = businessNetworkConnection.getBusinessNetwork()
                       .getSerializer()
                       .toJSON(result);
            var decryptedfirstName = decryptField(technician.firstName)
            var decryptedlastName = decryptField(technician.lastName)
            var decryptedspecialty = decryptField(technician.specialty)

            technician.firstName=decryptedfirstName
            technician.lastName=decryptedlastName
            technician.specialty=decryptedspecialty

          }
          return businessNetworkConnection.disconnect();
        })
        .then(() => {
          if (exists) {
            res.json({
              body : technician,
              message: 'technician has been retrieved successfully',
              dev_message: 'Success'
            });
          } else {
            res.json({
              message: 'There is no such technician'
            });
          }
        })
        .catch(err => {
          return res.json({
            error: {
              message: err
            }
          });
});
});

router.put('/:id', function (req, res) {
  return businessNetworkConnection.connect(cardName)

    .then(() => {
        return participantRegistry("ehr.com.Technician")
      })

    .then(participantRegistry => {
      const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
      technician = factory.newResource('ehr.com', 'Technician', req.params.id);
      var firstnameenc = encryptField(req.body.firstName);
      var lastnameenc = encryptField(req.body.lastName);
      var specialtyenc = encryptField(req.body.specialty);
      technician.patient = factory.newRelationship('ehr.com', 'Patient', req.body.patient);
      technician.firstName = firstnameenc;
      technician.lastName = lastnameenc;
      technician.specialty = specialtyenc;

      return participantRegistry.update(technician);
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
