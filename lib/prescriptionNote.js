/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.AddprescriptionNote} prescriptionnote  - the trade to be processed
 * @transaction
 */

async function AddprescriptionNote(prescriptionnote) {
  	let assetRegistry = await getAssetRegistry('ehr.com.prescriptionNote')
  	var factory = getFactory()
    var id = '1111'
  	var prescriptionnoteasset = factory.newResource('ehr.com','prescriptionNote', id);
  	prescriptionnoteasset.doctorId = prescriptionnote.doctorId
    prescriptionnoteasset.notesPic=prescriptionnote.notesPic
    prescriptionnoteasset.owner1=prescriptionnote.owner1
    prescriptionnoteasset.owner2=prescriptionnote.owner2
  	await assetRegistry.add(prescriptionnoteasset)
}

/**
 * Fetching a prescriptionnote record
 * @param {ehr.com.GetprescriptionNote} prescriptionnote  - the record to be fetched
 * @transaction
 */

async function GetprescriptionNote(prescriptionnote){
	let assetRegistry = await getAssetRegistry('ehr.com.prescriptionNote')
    var factory = getFactory();
    await assetRegistry.get(prescriptionnote.prescription.id);
 	console.log("Getting Prescriptionnote")
  	console.log(prescriptionnote.prescription)
}

/**
 * Updating a record
 * @param {ehr.com.UpdateprescriptionNote} prescriptionnote  - record to be updated
 * @transaction
 */

async function UpdateprescriptionNote(prescriptionnote){
	let assetRegistry = await getAssetRegistry('ehr.com.prescriptionNote')
    var factory = getFactory();
 	prescriptionnote.prescription.notesPic='115';
    await assetRegistry.update(prescriptionnote.prescription);
}


/**
 * Removing a record
 * @param {ehr.com.RemoveprescriptionNote} prescriptionnote  - the record to be removed
 * @transaction
 */

async function RemoveprescriptionNote(prescriptionnote){
	  let assetRegistry = await getAssetRegistry('ehr.com.prescriptionNote')
    var factory = getFactory();
    await assetRegistry.remove(prescriptionnote.prescription.id);
}
