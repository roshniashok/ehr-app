/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.AddPatient} patient  - the trade to be processed
 * @transaction
 */

async function AddPatient(patient) {
  	let participantRegistry = await getParticipantRegistry('ehr.com.Patient')
  	var factory = getFactory()
    var id = '1111'
  	var patientasset = factory.newResource('ehr.com','Patient', id);
  	patientasset.firstName = patient.firstName
  	patientasset.lastName = patient.lastName
  	patientasset.age=patient.age
  	patientasset.sex=patient.sex
    patientasset.record=patient.record
  	await participantRegistry.add(patientasset)
}

/**
 * Fetching a patient record
 * @param {ehr.com.GetPatient} patient  - the record to be fetched
 * @transaction
 */

async function GetPatient(patient){
	let participantRegistry = await getParticipantRegistry('ehr.com.Patient')
    var factory = getFactory();
    await participantRegistry.get(Patient.Patient.id);
 	console.log("Getting Patient")
  	console.log(patient.patient)
}

/**
 * Updating a record
 * @param {ehr.com.UpdatePatient} patient  - record to be updated
 * @transaction
 */

async function UpdatePatient(patient){
	let participantRegistry = await getParticipantRegistry('ehr.com.Patient')
    var factory = getFactory();
 	patient.patient.age='115';
    await participantRegistry.update(patient.patient);
}


/**
 * Removing a record
 * @param {ehr.com.RemovePatient} patient  - the record to be removed
 * @transaction
 */

async function RemovePatient(patient){
	let participantRegistry = await getParticipantRegistry('ehr.com.Patient')
    var factory = getFactory();
    await participantRegistry.remove(patient.patient.id);
}
