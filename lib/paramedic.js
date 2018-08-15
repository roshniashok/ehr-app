/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.AddParamedic} paramedic  - the trade to be processed
 * @transaction
 */

async function AddParamedic(paramedic) {
  	let participantRegistry = await getParticipantRegistry('ehr.com.Paramedics')
  	var factory = getFactory()
    var id = '1111'
  	var paramedicasset = factory.newResource('ehr.com','Paramedics', id);
  	paramedicasset.patientId = paramedic.patientId
    paramedicasset.location=paramedic.location
    paramedicasset.reason=paramedic.reason
  	await participantRegistry.add(paramedicasset)
}

/**
 * Fetching a paramedic record
 * @param {ehr.com.GetParamedic} paramedic  - the record to be fetched
 * @transaction
 */

async function GetParamedic(paramedic){
	let participantRegistry = await getParticipantRegistry('ehr.com.Paramedics')
    var factory = getFactory();
    await participantRegistry.get(paramedic.paramedic.id);
 	console.log("Getting Paramedic")
  	console.log(paramedic.paramedic)
}

/**
 * Updating a record
 * @param {ehr.com.UpdateParamedic} paramedic  - record to be updated
 * @transaction
 */

async function UpdateParamedic(paramedic){
	let participantRegistry = await getParticipantRegistry('ehr.com.Paramedics')
    var factory = getFactory();
 	paramedic.paramedic.reason='115';
    await participantRegistry.update(paramedic.paramedic);
}


/**
 * Removing a record
 * @param {ehr.com.RemoveParamedic} paramedic  - the record to be removed
 * @transaction
 */

async function RemoveParamedic(paramedic){
	let participantRegistry = await getParticipantRegistry('ehr.com.Paramedics')
    var factory = getFactory();
    await participantRegistry.remove(paramedic.paramedic.id);
}
