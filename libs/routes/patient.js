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
              return participantRegistry("ehr.com.Patient")
            })

          .then(participantRegistry => {
              const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
              patient = factory.newResource('ehr.com', 'Patient', req.body.id);
              //patient.firstName = req.body.firstName;
              var firstnameenc = encryptField(req.body.firstName);
              var lastnameenc = encryptField(req.body.lastName);
              var ageenc = encryptField(req.body.age);
              var sexenc = encryptField(req.body.sex);

              patient.firstName = firstnameenc;
              patient.lastName = lastnameenc;
              patient.age = ageenc;
              patient.sex = sexenc;
              patient.doctor = factory.newRelationship('ehr.com', 'Doctor', req.body.doctor);
              console.log("Posting..");
              //patient.record = factory.newResource('ehr.com', 'Patient', req.body.id);
              return participantRegistry.add(patient);
              console.log(patient)
              console.log("Posted...")
           })

            .then((err) => {
              return issueIdentity("ehr.com", "Patient", req.body.id, req.body.id + "_" + req.body.firstName);
            })

            .then(identity => {
              return adminConnection.importCard(req.body.id, getIdCard(createMetaData(identity)));
            })

            .then(() => {
              return businessNetworkConnection.disconnect();
            })

            .then(() => {
              return res.json({
                status: 'OK, done!',
                firstName : patient.firstName,
                lastName : patient.lastName
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
  let patient;
  const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
  const businessNetworkConnection = new BusinessNetworkConnection();
  return businessNetworkConnection.connect("01")
    .then(() => {
        return businessNetworkConnection.getParticipantRegistry(
            'ehr.com.Patient');
      })
    .then(assetRegistry => {
        assets=assetRegistry;
        return assetRegistry.get(req.params.id);
      })
      .then((result) => {
        exists = result;
        if (result) {
          return assets.get(req.params.id);
        }
      })
      .then(() => {
          if (exists) {
            patient = businessNetworkConnection.getBusinessNetwork()
                       .getSerializer()
                       .toJSON(result);
            var decryptedfirstName = decryptField(patient.firstName)
            var decryptedlastName = decryptField(patient.lastName)

            var decryptedage = decryptField(patient.age)
            var decryptedsex = decryptField(patient.sex)
            //var decrypteddoctor = decryptField(patient.doctor)
            patient.firstName=decryptedfirstName
            patient.lastName=decryptedlastName

            patient.age=decryptedage
            patient.sex=decryptedsex
            //patient.doctor=decrypteddoctor
          }
          return businessNetworkConnection.disconnect();
        })
        .then(() => {
          if (exists) {
            res.json({
              body : patient,
              message: 'patient has been retrieved successfully',
              dev_message: 'Success'
            });
          }
          else {
            res.json({
              message: 'There is no such patient'
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
        return participantRegistry("ehr.com.Patient")
      })

    .then(participantRegistry => {
      const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
      patient = factory.newResource('ehr.com', 'Patient', req.params.id);

      var firstnameenc = encryptField(req.body.firstName);
      var lastnameenc = encryptField(req.body.lastName);
      var ageenc = encryptField(req.body.age);
      var sexenc = encryptField(req.body.sex);

      patient.firstName = firstnameenc;
      patient.lastName = lastnameenc;
      patient.age = ageenc;
      patient.sex = sexenc;
      patient.doctor = factory.newRelationship('ehr.com', 'Doctor', req.body.doctor);
      return participantRegistry.update(patient);
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
