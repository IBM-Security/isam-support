/*
*		Name: infomap_addxff.js
*		Author: jcyarbor@us.ibm.com
*
Incoming info from the Client Reverse Proxy instance:
macro = TAM_OP:o
macro = FAILREASON:r
macro = ERROR_CODE:c
macro = ERROR_TEXT:t
macro = ERROR_URL:Target
macro = URL:u
macro = HOSTNAME:h
macro = PROTOCOL:p

Macros that need to be filled in the error page in addition to above:
%HTTPS_BASE%
%URL%

*******************************************/

importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

IDMappingExtUtils.traceString("Entering Infomap: addxff");

var tamOp = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "o");
var failReason = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "r");
var errCode = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "c");
var errText = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "t");
var target = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "Target");
var url = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "u");
var hostname = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "h");
var protocol = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "p");

// Try to get current value of 'addxff' which is set either by HTTP Transformation or this infomap.
var addxff = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:token:attribute", "addxff");

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
if(addxff != null && addxff != "" && addxff != "null"){
	// This means that the credential has the 'addxff' credential attribute and this is an actual error.
	// We need to then populate the error template with macros
	macros.put("%ERROR_TEXT%",errText);
	macros.put("%TAM_OP%",tamOp);
	macros.put("%ERROR_CODE%",errCode);
	
	success.endPolicyWithoutCredential()
} else {
	// Insert X-Forwarded-For header into the credential, string value
	context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "addxff", xff);
	var Target = "" + protocol + "://" + hostname + url;
	IDMappingExtUtils.traceString("infomap_addxff.js : reconstructed Target parameter : " + Target);
	responseHeaders.put("am-eai-redir-url", Target);

	// End the infomap with a credential update.
	// This means that the credential value will either have the multiple XFF addresses or the value 'missing'
	// The cred attr should never have 'missing' because there should never be a request coming to the RP w/o an XFF if they are coming through the load balancer
	success.setValue(true);
}
