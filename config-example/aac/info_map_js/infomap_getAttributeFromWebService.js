/* 
	Filename : infomap_getAttributeFromWebService.js
	Author : Jack Yarborough
	Contact : jcyarbor@us.ibm.com
	
	Purpose : 
		The purpose of this javascript file is to facilitate acquiring an attribute from a Web Service based off an attribute in the ISAM User's credential.
		In this example we will call out to a Web Service that takes a username as a parameter and a desired attribute as a parameter in the Web Service URL.
		
		The idea here is that the Web Service is a front end to a database that you want to get attributes for and that a table exists that has desireable information linked to
		a user's username.
		
		This can be extended in many ways depending on how the web service is built.
		That is out of the scope of this mapping rule. The mapping rule / infomap mechanism simply faciliates the client side of the call to get the attributes.
		
		**This JavaScript mapping rule is provided as-is and is supported by the author.
		** All variable names, attribute names, and logic are provided as an example
*/

// Import the classes/packages we'll need to make an HTTP Callout to the Web Service : 
importPackage(com.ibm.security.access.httpclient);
importPackage(com.tivoli.am.fim.trustserver.sts.utilities);
importPackage(com.tivoli.am.rba.extensions);

// 1) Acquire the username from the infomap context.
// Here's an example of getting the ISAM Credential username : 
var credentialUsername = context.get(Scope.SESSION, "urn:ibm:security:asf:response:token:attribute", "AZN_CRED_PRINCIPAL_NAME")[0];
IDMappingExtUtils.traceString("Value of 'AZN_CRED_PRINCIPAL_NAME' : " + credentialUsername);

// For this example we'll be retrieving an email from the Web Service.

// Optionally, here is code that would let you make a decision based off of a credential attribute called 'emailSrc' that can be stored in LDAP in any number of attributes.

var emailSrc = context.get(Scope.SESSION, "urn:ibm:security:asf:response:token:attribute", "emailSrc");

// Here we check to see whether the 'emailSrc' credential attribute was specified and get the value
if(emailSrc != null && emailSrc != "") {
	IDMappingExtUtils.traceString("Email Source from credential : " + emailSrc);
} else {
	// Since we want to get it from a Web Service we'll default to 'database' since the Web Service is supposed to be fronting a database.
	emailSrc = "database";
}

// Initialize a variable to hold the web service value. It needs to be an array to properly pass it out of the infomap mechanism : 
var webServiceValue = java.lang.reflect.Array.newInstance(java.lang.String, 1);

// We will conditionally check to see where we want to source the email from. We'll assume you're storing an LDAP email attribute in the standard 'emailAddress' credential attribute.
if(emailSrc == "credential") {
	var emailAddr = context.get(Scope.SESSION, "urn:ibm:security:asf:response:token:attribute", "emailAddress");
} else if(emailSrc == "database") {
	// Here we will make the call to the Web Service
	
	var client = new HttpClient();
	var headers = new Headers();
	
	// Let's get a JSON Response : 
	headers.addHeader("accept", "application/json");
	
	//Here is optional code to setup basic authentication : 
	var baUser = "basicauthuser";
	var baPwd = "basicauthpassw0rd";
	
	// Let's call the Web Service using variable substitution. Since we depend on the username being present we'll need to abort if it's null : 
	if(credentialUsername != null && credentialUsername != "") {
		// Let's make the URL we're going to call so we can identify it on this line : 
		var url = "https://rhel7-dbwebservice.hyperv.lab/rest/"+credentialUsername+"/attribute/email";
		IDMappingExtUtils.traceString("url we're requesting : " + url);
		
		var response = client.httpGet(url, headers, null, null, null, null, null);
		
		if(response.getCode() == 200){
			var body = JSON.parse(response.getBody());
		} else {
			success.setValue(false);
		}
		// Parse the body and extract the returned value
		// We'll assume the response was in the format of '{"user_email":"value"}'
		// We'll also assume the Web Service will always return a value and the value will be 'missing' if the database doesn't have an entry for that user.
		webServiceValue[0] = parsedBody[user_email];
		
		IDMappingExtUtils.traceString("Here is the value from the parsed JSON response : " + webServiceValue[0]);
		
	} else {
		success.setValue(false);
	}
}

// Finally, add the value into the Credential for input into the 
if(webServiceValue[0] != null && webServiceValue[0] != "" && webServiceValue[0] != "missing") {
	context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attribute", "derivedEmail", webServiceValue[0]);
	success.setValue(true);
} else {
	succes.setValue(false);
}
