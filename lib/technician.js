/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.AddTechnician} technician  - the trade to be processed
 * @transaction
 */

async function AddTechnician(technician) {
  	let participantRegistry = await getParticipantRegistry('ehr.com.Technician')
  	var factory = getFactory()
    var id = '1111'
  	var technicianasset = factory.newResource('ehr.com','Technician', id);
  	technicianasset.firstName = technician.firstName
  	technicianasset.lastName = technician.lastName
    technicianasset.specialty=technician.specialty
    technicianasset.patient=technician.patient
  	await participantRegistry.add(technicianasset)
}

/**
 * Fetching a technician record
 * @param {ehr.com.GetTechnician} technician  - the record to be fetched
 * @transaction
 */

async function GetTechnician(technician){
	let participantRegistry = await getParticipantRegistry('ehr.com.Technician')
    var factory = getFactory();
    await participantRegistry.get(technician.technician.id);
 	console.log("Getting Technician")
  	console.log(technician.technician)
}

/**
 * Updating a record
 * @param {ehr.com.UpdateTechnician} technician  - record to be updated
 * @transaction
 */

async function UpdateTechnician(technician){
	let participantRegistry = await getParticipantRegistry('ehr.com.Technician')
    var factory = getFactory();
 	technician.technician.firstName='115';
    await participantRegistry.update(technician.technician);
}


/**
 * Removing a record
 * @param {ehr.com.RemoveTechnician} technician  - the record to be removed
 * @transaction
 */

async function RemoveTechnician(technician){
	let participantRegistry = await getParticipantRegistry('ehr.com.Technician')
    var factory = getFactory();
    await participantRegistry.remove(technician.technician.id);
}
