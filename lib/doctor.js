


import CryptoJS from 'crypto-js';


/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.AddDoctor} doctor  - the trade to be processed
 * @transaction
 */
 //var CryptoJS = require("crypto-js");
async function AddDoctor(doctor) {

    var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
     //Decrypt
    var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
    var plaintext = bytes.toString(CryptoJS.enc.Utf8)
    console.log(plaintext);
  	let participantRegistry = await getParticipantRegistry('ehr.com.Doctor')
  	var factory = getFactory()
    var id = '1111'
  	var doctorasset = factory.newResource('ehr.com','Doctor', id);
  	doctorasset.firstName = doctor.firstName
  	doctorasset.lastName = doctor.lastName
  	doctorasset.age=doctor.age
  	doctorasset.sex=doctor.sex
  	doctorasset.specialty=doctor.specialty
 	  doctorasset.patient=doctor.patient
  	await participantRegistry.add(doctorasset)
}

/**
 * Fetching a patient record
 * @param {ehr.com.GetDoctor} doctor  - the record to be fetched
 * @transaction
 */

async function GetDoctor(doctor){
  println("HELLO!")
	  let participantRegistry = await getParticipantRegistry('ehr.com.Doctor')
    var factory = getFactory();
    await participantRegistry.get(doctor.doctor.id);
 	  console.log("Getting doctor")
  	console.log(doctor.doctor)
}

/**
 * Updating a record
 * @param {ehr.com.UpdateDoctor} doctor  - record to be updated
 * @transaction
 */

async function UpdateDoctor(doctor){
	let participantRegistry = await getParticipantRegistry('ehr.com.Doctor')
    var factory = getFactory();
 	  doctor.doctor.age='115';
    await participantRegistry.update(doctor.doctor);
}


/**
 * Removing a record
 * @param {ehr.com.RemoveDoctor} doctor  - the record to be removed
 * @transaction
 */

async function RemoveDoctor(doctor){
	let participantRegistry = await getParticipantRegistry('ehr.com.Doctor')
    var factory = getFactory();
    await participantRegistry.remove(doctor.doctor.id);
}
