/* 
	Filename : infomap_getAttributeFromDMAPCacheCredAttr.js
	Author : Jack Yarborough
	Contact : jcyarbor@us.ibm.com
	
	Purpose : 
		The purpose of this javascript file is to facilitate acquiring an attribute from the DMAP cache based off an attribute in the ISAM User's credential.
		In this example we will call out to the Distributed Map (DMAP) cache to retrieve the desired attribute acquired by the Database PIP.
		
		The idea here is to leverage the existing ISAM Database PIPs to acquire information for Authentication Policy usage.
		
		This can be extended in as many ways as the Database PIPs can be called.
		The mapping rule / infomap mechanism simply faciliates the pre-otp call to get the attribute.
		
		** This JavaScript mapping rule is provided as-is and is supported by the author.
		** All variable names, attribute names, and logic are provided as an example
		
		This mapping rule references the following : 
		 - https://stackoverflow.com/questions/6226189/how-to-convert-a-string-to-bytearray
*/

// Import the classes/packages we'll need to make a call to the DMAP : 
importPackage(com.tivoli.am.fim.trustserver.sts.utilities);
importClass(com.tivoli.am.fim.base64.BASE64Utility);

function strToByteArray(string) {
	var bytes = [];
	for(var i = 0; i < string.length(); i++) {
		IDMappingExtUtils.traceString("Entering Char loop");
		var charCode = string.charCodeAt(i);
		if(charCode > 0xFF) {
			IDMappingExtUtils.traceString("Encountered a non-USASCII character : "+ string(i));
		} else {
			IDMappingExtUtils.traceString("Current Byte : " + charCode);
			bytes.push(charCode);
		}
	}
	return bytes;
}

// 1) Acquire the attribute used as the DMAP key : 
// Here's an example of getting the ISAM Credential 'tagvalue_session_index' : 
var credentialUserSessionIndex = context.get(Scope.SESSION, "urn:ibm:security:asf:response:token:attribute", "tagvalue_session_index")[0];
IDMappingExtUtils.traceString("Value of 'tagvalue_session_index' : " + credentialUserSessionIndex);

// For this example we'll be retrieving an email from the DMAP.

// Optionally, here is code that would let you make a decision based off of a credential attribute called 'emailSrc' that can be stored in LDAP in any number of attributes.

var emailSrc = context.get(Scope.SESSION, "urn:ibm:security:asf:response:token:attribute", "emailSrc");

// Here we check to see whether the 'emailSrc' credential attribute was specified and get the value
if(emailSrc != null && emailSrc != "") {
	IDMappingExtUtils.traceString("Email Source from credential : " + emailSrc);
} else {
	// Since we want to get it from the DMAP we'll default to 'dmap'.
	emailSrc = "dmap";
}

// Initialize the DMAP Cache implementation : 
var dmapCache = IDMappingExtUtils.getIDMappingExtCache();

// We will conditionally check to see where we want to source the email from. We'll assume you're storing an LDAP email attribute in the standard 'emailAddress' credential attribute.
if(emailSrc == "credential") {
	var emailAddr = context.get(Scope.SESSION, "urn:ibm:security:asf:response:token:attribute", "emailAddress");
} else if(emailSrc == "dmap") {
	// Here we will make the call to the DMAP
	// Let's call the DMAP using variable substitution. Since we depend on the tagvalue_session_index key being present we'll need to abort if it's null : 
	if(credentialUserSessionIndex != null && credentialUserSessionIndex != "") {
		
		// Since the tagvalue_session_index is not null let's base64 encode it to normalize the characters
		var credentialUserSessionIndexHash = PluginUtils.encodeBase64(strToByteArray(credentialUserSessionIndex));
		IDMappingExtUtils.traceString("Here is the base64 encoded value : " + credentialUserSessionIndexHash);
		
		// Just make sure that the hash isn't null
		if(credentialUserSessionIndexHash != null && credentialUserSessionIndexHash != "") {
			var dmapValue = dmapCache.get(credentialUserSessionIndexHash);

			// Make sure the DMAP value is not null and not an empty string
			if(dmapValue != null && dmapValue != ""){
				IDMappingExtUtils.traceString("Here is the value from the DMAP : " + dmapValue);
			} else {
				IDMappingExtUtils.traceString("The retrieved value from the DMAP was null or empty.");
				macros.put("@ERROR_MESSAGE@","The retrieved value from the DMAP was null or empty.");
				success.setValue(false);
			}
		} else {
			IDMappingExtUtils.traceString("The base64 encoded value of the DMAP key was null or empty.");
			macros.put("@ERROR_MESSAGE@","The base64 encoded value of the DMAP key was null or empty.");
			success.setValue(false);
		}
	} else {
		IDMappingExtUtils.traceString("The DMAP key was null or empty.");
		macros.put("@ERROR_MESSAGE@","The DMAP key was null or empty.");
		success.setValue(false);
	}
}

// Finally, add the value into the Credential for input into the 
if(dmapValue != null && dmapValue != "") {
	context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attribute", "derivedEmail", dmapValue);
	success.setValue(true);
} else {
	succes.setValue(false);
}
