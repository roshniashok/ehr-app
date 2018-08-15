/**
 * Track the trade of a commodity from one trader to another
 * @param {ehr.com.AddlabReport} labreport  - the trade to be processed
 * @transaction
 */

async function AddlabReport(labReport) {
  	let assetRegistry = await getAssetRegistry('ehr.com.labReport')
  	var factory = getFactory()
    var id = '1111'
  	var labreportasset = factory.newResource('ehr.com','labReport', id);
  	labreportasset.labtechId = labreport.labtechId
  	labreportasset.doctorId = labreport.doctorId
    labreportasset.notesPic=labreport.notesPic
    labreportasset.owner1=labreport.owner1
    labreportasset.owner2=labreport.owner2
  	await assetRegistry.add(labreportasset)
}

/**
 * Fetching a labreport record
 * @param {ehr.com.GetlabReport} labreport  - the record to be fetched
 * @transaction
 */

async function GetlabReport(labreport){
	  let assetRegistry = await getAssetRegistry('ehr.com.labReport')
    var factory = getFactory();
    await assetRegistry.get(labreport.labreport.id);
 	  console.log("Getting Labreport")
  	console.log(labreport.labreport)
}

/**
 * Updating a record
 * @param {ehr.com.UpdatelabReport} labreport  - record to be updated
 * @transaction
 */

async function UpdatelabReport(labreport){
	 let assetRegistry = await getAssetRegistry('ehr.com.labReport')
    var factory = getFactory();
 	  labreport.labreport.notesPic='115';
    await assetRegistry.update(labreport.labreport);
}


/**
 * Removing a record
 * @param {ehr.com.RemovelabReport} labreport  - the record to be removed
 * @transaction
 */

async function RemovelabReport(labreport){
	  let assetRegistry = await getAssetRegistry('ehr.com.labReport')
    var factory = getFactory();
    await assetRegistry.remove(labreport.labreport.id);
}
