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

const cardName = "01";
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
              return assetRegistry("ehr.com.Record")
            })

          .then(assetRegistry => {
              const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
              record = factory.newResource('ehr.com', 'Record', req.body.RecordId);
              //record.firstName = req.body.firstName;
              var firstnameenc = encryptField(req.body.firstName);
              var lastnameenc = encryptField(req.body.lastName);
              var ageenc = encryptField(req.body.age);
              var sexenc = encryptField(req.body.sex);
              var allergiesenc = encryptField(req.body.allergies);
              record.firstName = firstnameenc;
              record.lastName = lastnameenc;
              record.age = ageenc;
              record.sex = sexenc;
              record.allergies=allergiesenc;
              record.prescription = factory.newRelationship('ehr.com', 'prescriptionNote', req.body.prescription);
              record.report = factory.newRelationship('ehr.com', 'labReport', req.body.report);
              record.insurance = factory.newRelationship('ehr.com', 'insuranceNotes', req.body.insurance);
              record.owner1 = factory.newRelationship('ehr.com', 'Patient', req.body.owner1);
              record.owner2 = factory.newRelationship('ehr.com', 'Doctor', req.body.owner2);

              console.log("Posting..");
              //record.record = factory.newResource('ehr.com', 'Record', req.body.id);
              return assetRegistry.add(record);
              console.log(record)
              console.log("Posted...")
           })

            .then(() => {
              return businessNetworkConnection.disconnect();
            })

            .then(() => {
              return res.json({
                status: 'OK, done!',
                firstName : record.firstName,
                lastName : record.lastName
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
  let record;
  const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
  const businessNetworkConnection = new BusinessNetworkConnection();
  return businessNetworkConnection.connect(cardName)
    .then(() => {
        return businessNetworkConnection.getAssetRegistry(
            'ehr.com.Record');
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
            record = businessNetworkConnection.getBusinessNetwork()
                       .getSerializer()
                       .toJSON(result);
            var decryptedfirstName = decryptField(record.firstName)
            var decryptedlastName = decryptField(record.lastName)

            var decryptedage = decryptField(record.age)
            var decryptedsex = decryptField(record.sex)
            var decryptedallergies = decryptField(record.allergies)
            //var decrypteddoctor = decryptField(record.doctor)
            record.firstName=decryptedfirstName
            record.lastName=decryptedlastName
            record.age=decryptedage
            record.sex=decryptedsex
            record.allergies=decryptedallergies
            //record.doctor=decrypteddoctor
          }
          return businessNetworkConnection.disconnect();
        })
        .then(() => {
          if (exists) {
            res.json({
              body : record,
              message: 'record has been retrieved successfully',
              dev_message: 'Success'
            });
          } else {
            res.json({
              message: 'There is no such record'
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
        return assetRegistry("ehr.com.Record")
      })

    .then(assetRegistry => {
      const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
      record = factory.newResource('ehr.com', 'Record', req.params.id);
      var firstnameenc = encryptField(req.body.firstName);
      var lastnameenc = encryptField(req.body.lastName);
      var ageenc = encryptField(req.body.age);
      var sexenc = encryptField(req.body.sex);
      var allergiesenc = encryptField(req.body.allergies);
      record.firstName = firstnameenc;
      record.lastName = lastnameenc;
      record.age = ageenc;
      record.sex = sexenc;
      record.allergies=allergiesenc;
      record.prescription = factory.newRelationship('ehr.com', 'prescriptionNote', req.body.prescription);
      record.report = factory.newRelationship('ehr.com', 'labReport', req.body.report);
      record.insurance = factory.newRelationship('ehr.com', 'insuranceNotes', req.body.insurance);
      record.owner1 = factory.newRelationship('ehr.com', 'Record', req.body.owner1);
      record.owner2 = factory.newRelationship('ehr.com', 'Doctor', req.body.owner2);

      return assetRegistry.update(record);
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
