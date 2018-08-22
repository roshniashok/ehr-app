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
              return assetRegistry("ehr.com.labReport")
            })

          .then(assetRegistry => {
              const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
              labreport = factory.newResource('ehr.com', 'labReport', req.body.labReportId);
              var labtechIdenc=encryptField(req.body.labtechId);
              var doctorNameenc = encryptField(req.body.doctorName);
              var patientNameenc = encryptField(req.body.patientName);
              var notesenc = encryptField(req.body.notes);
              labreport.labtechId=labtechIdenc;
              labreport.doctorName = doctorNameenc;
              labreport.patientName = patientNameenc;
              labreport.notes = notesenc;
              labreport.owner1 = factory.newRelationship('ehr.com', 'Patient', req.body.owner1);
              labreport.owner2 = factory.newRelationship('ehr.com', 'Doctor', req.body.owner2);
              return assetRegistry.add(labreport);
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
  let labreport;
  console.log("dfdk")
  const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
  const businessNetworkConnection = new BusinessNetworkConnection();
  return businessNetworkConnection.connect(cardName)
    .then(() => {
        return businessNetworkConnection.getAssetRegistry(
            'ehr.com.labReport');
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
            labreport = businessNetworkConnection.getBusinessNetwork()
                       .getSerializer()
                       .toJSON(result);
            var decryptedlabtechId = decryptField(labreport.labtechId)
            var decrypteddoctorName = decryptField(labreport.doctorName)
            var decryptedpatientName = decryptField(labreport.patientName)
            var decryptednotes = decryptField(labreport.notes)

            labreport.labtechId=decryptedlabtechId
            labreport.doctorName=decrypteddoctorName
            labreport.patientName=decryptedpatientName
            labreport.notes=decryptednotes
          }
          return businessNetworkConnection.disconnect();
        })
        .then(() => {
          if (exists) {
            res.json({
              body : labreport,
              message: 'labreport has been retrieved successfully',
              dev_message: 'Success'
            });
          } else {
            res.json({
              message: 'There is no such labreport'
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
        return assetRegistry("ehr.com.labReport")
      })

    .then(assetRegistry => {
      const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
      labreport = factory.newResource('ehr.com', 'labReport', req.params.id);
      var labtechIdenc=encryptField(req.body.labtechId);
      var doctorNameenc = encryptField(req.body.doctorName);
      var patientNameenc = encryptField(req.body.patientName);
      var notesenc = encryptField(req.body.notes);
      labreport.labtechId=labtechIdenc;
      labreport.doctorName = doctorNameenc;
      labreport.patientName = patientNameenc;
      labreport.notes = notesenc;
      labreport.owner1 = factory.newRelationship('ehr.com', 'Patient', req.body.owner1);
      labreport.owner2 = factory.newRelationship('ehr.com', 'Doctor', req.body.owner2);
      return assetRegistry.update(labreport);
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
