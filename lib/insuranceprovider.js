/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.AddinsuranceProvider} insuranceprovider  - the trade to be processed
 * @transaction
 */

async function AddinsuranceProvider(insuranceprovider) {
  	let participantRegistry = await getParticipantRegistry('ehr.com.insuranceProvider')
  	var factory = getFactory()
    var id = '1111'
  	var insuranceproviderasset = factory.newResource('ehr.com','insuranceProvider', id);
  	insuranceproviderasset.name = insuranceprovider.name
    insuranceproviderasset.location=insuranceprovider.location
    insuranceproviderasset.insurancenotes=insuranceprovider.insurancenotes
  	await participantRegistry.add(insuranceproviderasset)
}

/**
 * Fetching a insuranceProvider record
 * @param {ehr.com.GetinsuranceProvider} insuranceprovider  - the record to be fetched
 * @transaction
 */

async function GetinsuranceProvider(insuranceprovider){
	let participantRegistry = await getParticipantRegistry('ehr.com.insuranceProvider')
    var factory = getFactory();
    await participantRegistry.get(insuranceprovider.insuranceprovider.id);
 	console.log("Getting insuranceProvider")
  	console.log(insuranceprovider.insuranceprovider)
}

/**
 * Updating a record
 * @param {ehr.com.UpdateinsuranceProvider} insuranceprovider  - record to be updated
 * @transaction
 */

async function UpdateinsuranceProvider(insuranceprovider){
	let participantRegistry = await getParticipantRegistry('ehr.com.insuranceProvider')
    var factory = getFactory();
 	insuranceprovider.insuranceprovider.name='115';
    await participantRegistry.update(insuranceprovider.insuranceprovider);
}


/**
 * Removing a record
 * @param {ehr.com.RemoveinsuranceProvider} insuranceprovider  - the record to be removed
 * @transaction
 */

async function RemoveinsuranceProvider(insuranceprovider){
	let participantRegistry = await getParticipantRegistry('ehr.com.insuranceProvider')
    var factory = getFactory();
    await participantRegistry.remove(insuranceprovider.insuranceprovider.id);
}
