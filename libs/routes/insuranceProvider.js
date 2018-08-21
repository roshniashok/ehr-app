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
              return participantRegistry("ehr.com.insuranceProvider")
            })

          .then(participantRegistry => {
              const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
              insuranceprovider = factory.newResource('ehr.com', 'insuranceProvider', req.body.insuranceProviderId);
              //insuranceprovider.firstName = req.body.firstName;
              console.log(req.body.name);
              var nameenc = encryptField(req.body.name);
              var locationenc = encryptField(req.body.location);

              insuranceprovider.name = nameenc;
              insuranceprovider.location = locationenc;
              console.log("Posting..");
              return participantRegistry.add(insuranceprovider);
              console.log("Posted...")
           })

            .then((err) => {
              return issueIdentity("ehr.com", "insuranceProvider", req.body.insuranceProviderId, req.body.insuranceProviderId + "_" + req.body.name);
            })

            .then(identity => {
              return adminConnection.importCard(req.body.insuranceProviderId, getIdCard(createMetaData(identity)));
            })

            .then(() => {
              return businessNetworkConnection.disconnect();
            })

            .then(() => {
              return res.json({
                status: 'OK, done!',
                body: insuranceprovider
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
  let insuranceprovider;
  const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
  const businessNetworkConnection = new BusinessNetworkConnection();
  return businessNetworkConnection.connect(req.params.id)
    .then(() => {
        return businessNetworkConnection.getParticipantRegistry(
            'ehr.com.insuranceProvider');
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
            insuranceprovider = businessNetworkConnection.getBusinessNetwork()
                       .getSerializer()
                       .toJSON(result);

                       console.log(insuranceprovider.name);
            var decryptedname = decryptField(insuranceprovider.name)
            var decryptedlocation = decryptField(insuranceprovider.location)


console.log(decryptedname)
            insuranceprovider.name=decryptedname
            insuranceprovider.location=decryptedlocation
          }
          return businessNetworkConnection.disconnect();
        })
        .then(() => {
          if (exists) {
            res.json({
              body : insuranceprovider,
              message: 'insuranceprovider has been retrieved successfully',
              dev_message: 'Success'
            });
          } else {
            res.json({
              message: 'There is no such insuranceprovider'
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
        return participantRegistry("ehr.com.insuranceProvider")
      })

    .then(participantRegistry => {
      const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
      insuranceprovider = factory.newResource('ehr.com', 'insuranceProvider', req.params.id);
      var nameenc = encryptField(req.body.name);
      var locationenc = encryptField(req.body.location);

      insuranceprovider.name = nameenc;
      insuranceprovider.location = locationenc;
      console.log("Posting..");
      return participantRegistry.add(insuranceprovider);
      return participantRegistry.update(insuranceprovider);
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
              message: 'Failed to update record'
            }
          });
    });

});


module.exports = router;
