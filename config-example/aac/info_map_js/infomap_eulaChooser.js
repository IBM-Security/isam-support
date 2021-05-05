/*
*		Title: infomap_eulaChooser.js
*		Author : Jack Yarborough (jcyarbor@us.ibm.com)
*
*		Intended Purpose : 
*			This mapping rule reads a query parameter and chooses a EULA license based on that parameter.
*
*		Appliance Implementation :
*			1) Navigate to 'Secure Access Control -> Global Settings -> Mapping Rules'
*			2) Select 'Add' to create a new mapping rule
*				- Name : 'eulaChooser'
*				- Category : infomap
*
*/

importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

IDMappingExtUtils.traceString("Entering eulaChooser");

// Set the base path where the EULA license files exist
// The files are located at 'Secure Access Control -> Global Settings -> Template Files'
var eulaFilesBaseDirectory = "/authsvc/authenticator/eula/";

// Set the default license text
var defaultLicense = "license.txt";

// Create a variable to hold the chosen EULA value
var chosenEula = "";

// Get the value of the 'eula' query parameter from the request.
var eulaParameter = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "eula");

/*
* Fun note. The reason I set the variable 'eulaParameter' like '= "" + ..." is so that the variable will be initialized as a String even if the result of 'context.get()' call returns nothing.
*/

// Print out the value for tracing purposes
IDMappingExtUtils.traceString("eulaChooser:: Value of 'eula' query parameter : " + eulaParameter);

// Confirm that the EULA parameter had a value, if it didn't then we need to default to the default license.txt
if(eulaParameter != null && eulaParameter != "") {
	chosenEula = eulaFilesBaseDirectory + eulaParameter + ".txt";
} else {
	chosenEula = eulaFilesBaseDirectory + defaultLicense;
}

IDMappingExtUtils.traceString("eulaChooser:: Here is the chosen EULA file : " + chosenEula);

// Finally, we set the EULA file as a request parameter that will be picked up in the EULA Authentication Mechanism
context.set(Scope.SESSION, "urn:ibm:security:asf:request:token:attribute", "chosenEula", chosenEula);

success.setValue(true);

IDMappingExtUtils.traceString("Exiting eulaChooser");
