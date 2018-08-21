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
              return participantRegistry("ehr.com.Doctor")
            })

          .then(participantRegistry => {
              const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
              doctor = factory.newResource('ehr.com', 'Doctor', req.body.doctorId);
              //doctor.firstName = req.body.firstName;
              var firstnameenc = encryptField(req.body.firstName);
              var lastnameenc = encryptField(req.body.lastName);
              var specialtyenc = encryptField(req.body.specialtyenc);
              var ageenc = encryptField(req.body.age);
              var sexenc = encryptField(req.body.sex);
            
              doctor.firstName = firstnameenc;
              doctor.lastName = lastnameenc;
              doctor.specialty = specialtyenc;
              doctor.age = ageenc;
              doctor.sex = sexenc;
              return participantRegistry.add(doctor);
           })

            .then((err) => {
              return issueIdentity("ehr.com", "Doctor", req.body.doctorId, req.body.doctorId + "_" + req.body.firstName);
            })

            .then(identity => {
              return adminConnection.importCard(req.body.doctorId, getIdCard(createMetaData(identity)));
            })

            .then(() => {
              return businessNetworkConnection.disconnect();
            })

            .then(() => {
              return res.json({
                status: 'OK, done!',
                firstName : doctor.firstName,
                lastName : doctor.lastName
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
  let doctor;
  console.log("dfdk")
  const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
  const businessNetworkConnection = new BusinessNetworkConnection();
  return businessNetworkConnection.connect(req.params.id)
    .then(() => {
        return businessNetworkConnection.getParticipantRegistry(
            'ehr.com.Doctor');
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
            doctor = businessNetworkConnection.getBusinessNetwork()
                       .getSerializer()
                       .toJSON(result);
            var decryptedfirstName = decryptField(doctor.firstName)
            var decryptedlastName = decryptField(doctor.lastName)
            var decryptedspecialty = decryptField(doctor.specialty)
            var decryptedage = decryptField(doctor.age)
            var decryptedsex = decryptField(doctor.sex)

            doctor.firstName=decryptedfirstName
            doctor.lastName=decryptedlastName
            doctor.specialty=decryptedspecialty
            doctor.age=decryptedage
            doctor.sex=decryptedsex
          }
          return businessNetworkConnection.disconnect();
        })
        .then(() => {
          if (exists) {
            res.json({
              body : doctor,
              message: 'Doctor has been retrieved successfully',
              dev_message: 'Success'
            });
          } else {
            res.json({
              message: 'There is no such doctor'
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
        return participantRegistry("ehr.com.Doctor")
      })

    .then(participantRegistry => {
      const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
      doctor = factory.newResource('ehr.com', 'Doctor', req.params.id);
      var firstnameenc = encryptField(req.body.firstName);
      var lastnameenc = encryptField(req.body.lastName);
      var specialtyenc = encryptField(req.body.specialtyenc);
      var ageenc = encryptField(req.body.age);
      var sexenc = encryptField(req.body.sex);

      doctor.firstName = firstnameenc;
      doctor.lastName = lastnameenc;
      doctor.specialty = specialtyenc;
      doctor.age = ageenc;
      doctor.sex = sexenc;

      return participantRegistry.update(doctor);
    })
    .then(() => {
      return businessNetworkConnection.disconnect();
    })
    .then(() => {
      return res.json({
        status: 'OK, done!',
        firstName : doctor.firstName,
        lastName : doctor.lastName,
        specialty : doctor.specialty,
        age : doctor.age,
        sex : doctor.sex


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
