/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.AddinsuranceNotes} insurancenotes  - the trade to be processed
 * @transaction
 */

async function AddinsuranceNotes(insurancenotes) {
  	let assetRegistry = await getAssetRegistry('ehr.com.insuranceNotes')
  	var factory = getFactory()
    var id = '1111'
  	var insurancenotesasset = factory.newResource('ehr.com','insuranceNotes', id)
    insurancenotesasset.insuranceProvider=insurancenotes.insuranceProvider
    insurancenotesasset.Premium=insurancenotes.Premium
    insurancenotesasset.owner1=insurancenotes.owner1
  	await assetRegistry.add(insurancenotesasset)
}

/**
 * Fetching a insurancenotes record
 * @param {ehr.com.GetinsuranceNotes} insurancenotes  - the record to be fetched
 * @transaction
 */

async function GetinsuranceNotes(insurancenotes){
	  let assetRegistry = await getAssetRegistry('ehr.com.insuranceNotes')
    var factory = getFactory();
    await assetRegistry.get(insurancenotes.insurancenotes.id);
 	  console.log("Getting Insurancenotes")
  	console.log(insurancenotes.insurancenotes)
}

/**
 * Updating a record
 * @param {ehr.com.UpdateinsuranceNotes} insurancenotes  - record to be updated
 * @transaction
 */

async function UpdateinsuranceNotes(insurancenotes){
	 let assetRegistry = await getAssetRegistry('ehr.com.insuranceNotes')
    var factory = getFactory();
 	  insurancenotes.insurancenotes.Premium='115';
    await assetRegistry.update(insurancenotes.insurancenotes);
}


/**
 * Removing a record
 * @param {ehr.com.RemoveinsuranceNotes} insurancenotes  - the record to be removed
 * @transaction
 */

async function RemoveinsuranceNotes(insurancenotes){
	  let assetRegistry = await getAssetRegistry('ehr.com.insuranceNotes')
    var factory = getFactory();
    await assetRegistry.remove(insurancenotes.insurancenotes.id);
}
