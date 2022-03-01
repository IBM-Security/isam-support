/*
*		Name: infomap_addxff.js
*		Author: jcyarbor@us.ibm.com
*
*
*
*
*/
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

IDMappingExtUtils.traceString("Entering Infomap: addxff");

// Define a default value for the X-Forwarded-For credential attribute
var xff = "missing";

//Define a function to UTF-8 Decode the input
function utf8decode(value) {
  if (value == null || value.length == 0) return "";
  return decodeURIComponent(escape(value));
}


// Gather X-Forwarded-For header from the parameters and set to a temporary attribute
var reqXFF = utf8decode(context.get(Scope.REQUEST, "urn:ibm:security:asf:request:header", "X-Forwarded-For"));

IDMappingExtUtils.traceString("X-Forwarded-For value from the request context : " + reqXFF);

if(reqXFF != "" && reqXFF != null) {
	xff = "" + reqXFF;
}

// Further validation of the IPs, etc, may be performed here

// Insert X-Forwarded-For header into the credential, string value
context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "addxff", xff);

// End the infomap with a credential update.
// This means that the credential value will either have the multiple XFF addresses or the value 'missing'
// The cred attr should never have 'missing' because there should never be a request coming to the RP w/o an XFF if they are coming through the load balancer
success.setValue(true);