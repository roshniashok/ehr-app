var express = require('express');
//var passport = require('passport');

var router = express.Router();


const AdminConnection = require('composer-admin').AdminConnection;
var CryptoJS = require ("crypto-js");

 /*function importCardForIdentity(cardName, identity) {

  //use admin connection
  adminConnection = new AdminConnection();
  businessNetworkName = 'ehr-app';

  //declare metadata
  const metadata = {
      userName: identity.userID,
      version: 1,
      enrollmentSecret: identity.userSecret,
      businessNetwork: businessNetworkName
  };

  //get connectionProfile from json, create Idcard
  const connectionProfile = require('./sample.json');
  const card = new IdCard(metadata, connectionProfile);

  //import card
  await adminConnection.importCard(cardName, card);
}*/
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
              return participantRegistry("ehr.com.Person")
            })

          .then(participantRegistry => {
              const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
              owner = factory.newResource('ehr.com', 'Person', req.body.personId);
              //owner.firstName = req.body.firstName;
              var firstnameenc = encryptField(req.body.firstName);
              var lastnameenc = encryptField(req.body.lastName);
              owner.firstName = firstnameenc;
              owner.lastName = lastnameenc;

              return participantRegistry.add(owner);
           })

            .then((err) => {
              return issueIdentity("ehr.com", "Person", req.body.personId, req.body.personId + "_" + req.body.firstName);
            })

            .then(identity => {
              return adminConnection.importCard(req.body.personId, getIdCard(createMetaData(identity)));
            })

            .then(() => {
              return businessNetworkConnection.disconnect();
            })

            .then(() => {
              return res.json({
                status: 'OK, done!',
                firstName : owner.firstName,
                lastName : owner.lastName
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
  let person;
  console.log("dfdk")
  const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
  const businessNetworkConnection = new BusinessNetworkConnection();
  return businessNetworkConnection.connect(req.params.id)
    .then(() => {
        return businessNetworkConnection.getParticipantRegistry(
            'ehr.com.Person');
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
            person = businessNetworkConnection.getBusinessNetwork()
                       .getSerializer()
                       .toJSON(result);
            var decryptedfirstName = decryptField(person.firstName)
            var decryptedlastName = decryptField(person.lastName)
            person.firstName=decryptedfirstName
            person.lastName=decryptedlastName

          }

          return businessNetworkConnection.disconnect();
        })
        .then(() => {
          if (exists) {
            res.json({
              body : person,
              message: 'Person has been retrieved successfully',
              dev_message: 'Success'
            });
          } else {
            res.json({
              message: 'There is no such person'
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
        return participantRegistry("ehr.com.Person")
      })

    .then(participantRegistry => {
        const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
      owner = factory.newResource('ehr.com', 'Person', req.params.id);
      var firstnameenc = encryptField(req.body.firstName);
      var lastnameenc = encryptField(req.body.lastName);
      owner.firstName = firstnameenc;
      owner.lastName = lastnameenc;
      return participantRegistry.update(owner);
    })
    .then(() => {
      return businessNetworkConnection.disconnect();
    })
    .then(() => {
      return res.json({
        status: 'OK, done!',
        firstName : owner.firstName,
        lastName : owner.lastName

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
