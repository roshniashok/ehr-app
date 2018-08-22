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

function assetRegistry(registryName) {
  return businessNetworkConnection.getAssetRegistry(registryName);
}


function issueIdentity(namespace, asset, id, cardName) {
  return businessNetworkConnection.issueIdentity(namespace + '.' + asset + '#' + id, cardName)
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
              return assetRegistry("ehr.com.insuranceNotes")
            })

          .then(assetRegistry => {
              const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
              insurancenotes = factory.newResource('ehr.com', 'insuranceNotes', req.body.insuranceNotesId);
              var insuranceProviderenc = encryptField(req.body.insuranceProvider);
              var premiumenc = encryptField(req.body.Premium);
              insurancenotes.insuranceProvider = insuranceProviderenc;
              insurancenotes.Premium = premiumenc;
              insurancenotes.owner1 = factory.newRelationship('ehr.com', 'Patient', req.body.owner1);
              insurancenotes.owner2 = factory.newRelationship('ehr.com', 'insuranceProvider', req.body.owner2);
              return assetRegistry.add(insurancenotes);
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
  let insurancenotes;
  console.log("dfdk")
  const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
  const businessNetworkConnection = new BusinessNetworkConnection();
  return businessNetworkConnection.connect(cardName)
    .then(() => {
        return businessNetworkConnection.getAssetRegistry(
            'ehr.com.insuranceNotes');
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
            insurancenotes = businessNetworkConnection.getBusinessNetwork()
                       .getSerializer()
                       .toJSON(result);
            var decryptedinsuranceProvider = decryptField(insurancenotes.insuranceProvider)
            var decryptedPremium = decryptField(insurancenotes.Premium)
            insurancenotes.insuranceProvider=decryptedinsuranceProvider
            insurancenotes.Premium=decryptedPremium
          }
          return businessNetworkConnection.disconnect();
        })
        .then(() => {
          if (exists) {
            res.json({
              body : insurancenotes,
              message: 'insurancenotes has been retrieved successfully',
              dev_message: 'Success'
            });
          } else {
            res.json({
              message: 'There is no such insurancenotes'
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
        return assetRegistry("ehr.com.insuranceNotes")
      })

    .then(assetRegistry => {
      const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
      insurancenotes = factory.newResource('ehr.com', 'insuranceNotes', req.params.id);
      var insuranceProviderenc = encryptField(req.body.insuranceProvider);
      var premiumenc = encryptField(req.body.Premium);
      insurancenotes.insuranceProvider = insuranceProviderenc;
      insurancenotes.Premium = premiumenc;
      insurancenotes.owner1 = factory.newRelationship('ehr.com', 'Patient', req.body.owner1);
      insurancenotes.owner2 = factory.newRelationship('ehr.com', 'insuranceProvider', req.body.owner2);
      return assetRegistry.update(insurancenotes);
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
