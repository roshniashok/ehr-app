/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.AddPharmacist} pharmacist  - the trade to be processed
 * @transaction
 */

async function AddPharmacist(pharmacist) {
  	let participantRegistry = await getParticipantRegistry('ehr.com.Pharmacist')
  	var factory = getFactory()
    var id = '1111'
  	var pharmacistasset = factory.newResource('ehr.com','Pharmacist', id);
  	pharmacistasset.firstName = pharmacist.firstName
  	pharmacistasset.lastName = pharmacist.lastName
    pharmacistasset.location=pharmacist.location
    pharmacistasset.patient=pharmacist.patient
  	await participantRegistry.add(pharmacistasset)
}

/**
 * Fetching a Pharmacist record
 * @param {ehr.com.GetPharmacist} pharmacist  - the record to be fetched
 * @transaction
 */

async function GetPharmacist(pharmacist){
	let participantRegistry = await getParticipantRegistry('ehr.com.Pharmacist')
    var factory = getFactory();
    await participantRegistry.get(pharmacist.pharmacist.id);
 	console.log("Getting Pharmacist")
  	console.log(pharmacist.pharmacist)
}

/**
 * Updating a record
 * @param {ehr.com.UpdatePharmacist} pharmacist  - record to be updated
 * @transaction
 */

async function UpdatePharmacist(pharmacist){
	let participantRegistry = await getParticipantRegistry('ehr.com.Pharmacist')
    var factory = getFactory();
 	pharmacist.pharmacist.firstName='115';
    await participantRegistry.update(pharmacist.pharmacist);
}


/**
 * Removing a record
 * @param {ehr.com.RemovePharmacist} pharmacist  - the record to be removed
 * @transaction
 */

async function RemovePharmacist(pharmacist){
	let participantRegistry = await getParticipantRegistry('ehr.com.Pharmacist')
    var factory = getFactory();
    await participantRegistry.remove(pharmacist.pharmacist.id);
}
