/*******************************************
/		Name: infomap_certAuthConfirmation.js
/		Author: jcyarbor@us.ibm.com
/		
/		Purpose:
/			- This infomap facilitates Certificate EAI from the Reverse Proxy using follow-redirects-for and the secondary listener.
/			- Upon first pass the infomap will show the 'certlogin.html' which will set a cookie with a random state key.

Incoming info from the Client Reverse Proxy instance:
Cert EAI Headers:
subjectdn = DN of Certificate passed in
subjectcn = Subject CN of the certificate used to authenticate


Macros that need to be filled in the error page in addition to above:
%HTTPS_BASE%
%URL%

*******************************************/
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

IDMappingExtUtils.traceString("Entering infomap_certAuthConfirmation.js");
// This is expected to be a 'step-up' flow so the end user should already by authenticated.

// Get the 'subjectcn' from the incoming cert EAI header
var credSubjectcn = "" + context.get(Scope.SESSION, "urn:ibm:security:asf:response:token:attribute", "tagvalue_subjectcn");
var transactionid = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "TransactionId");
var reqSubjectcn = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:header", "eai_subject_cn");

var followthrough = state.containsKey("confirmation");

if(credSubjectcn != "" && credSubjectcn != null && credSubjectcn != "null"){
	// If the credential attribute already exists that means we've already performed certificate authentication
	// Set success to 'true' and move on
	if(followthrough){
		state.remove("confirmation");
		success.setValue(true);
	} else {
	IDMappingExtUtils.traceString("infomap_certAuthConfirmation.js -- credential attribute was present with value of : " + credSubjectcn);
	responseHeaders.put("am-eai-redir-url","/mga/sps/authsvc?TransactionId="+transactionid);
	state.put("confirmation","true");
	success.setValue(true);
	}
} else {
	success.setValue(false);
}

IDMappingExtUtils.traceString("Exiting infomap_certAuthConfirmation.js");