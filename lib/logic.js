
/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.ElevatePermission} elevatepermission  - the trade to be processed
 * @transaction
 */

async function ElevatePermissionParamedics(elevatepermission) {
    elevatepermission.record.owner1 = elevatepermission.record.newOwner;
    let assetRegistry = await getAssetRegistry('ehr.com.Record');
    await assetRegistry.update(elevatepermission.record);
}


/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.AddRecord} patient  - the trade to be processed
 * @transaction
 */

async function AddRecords(record) {
  	let assetRegistry = await getAssetRegistry('ehr.com.Record')
  	var factory = getFactory()
    var id = '01'
  	var recordAsset = factory.newResource('ehr.com','Record', id);
    recordAsset.age= record.age
  	recordAsset.sex= record.sex
  	recordAsset.firstName = record.firstName
  	recordAsset.lastName = record.lastName
  	recordAsset.allergies=record.allergies
   	recordAsset.prescriptionNote=record.prescriptionNote
  	recordAsset.labReport=record.labReport
  	recordAsset.insuranceNotes=record.insuranceNotes
  	/*recordAsset.owner1 = factory.newRelationship('ehr.com', 'Patient', record.owner1)
  	recordAsset.owner2 = factory.newRelationship('ehr.com', 'Doctor', record.owner2)*/
  	await assetRegistry.add(recordAsset)
}


/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.GetRecord} record  - the trade to be processed
 * @transaction
 */

async function getRecords(record){
	let assetRegistry = await getAssetRegistry('ehr.com.Record')
    var factory = getFactory();
    await assetRegistry.get(record.record.ids);
  	console.log(record.record)
}

/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.UpdateRecord} record  - the trade to be processed
 * @transaction
 */

async function updateRecords(record){
	let assetRegistry = await getAssetRegistry('ehr.com.Record')
    var factory = getFactory();
 	record.record.age='115';
    await assetRegistry.update(record.record);
}







/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.RemoveRecord} record  - the trade to be processed
 * @transaction
 */

async function removeRecords(record){
	let assetRegistry = await getAssetRegistry('ehr.com.Record')
    var factory = getFactory();
    await assetRegistry.remove(record.record.ids);
}
