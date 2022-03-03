/*******************************************
/		Name: infomap_certAuthEAI.js
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

IDMappingExtUtils.traceString("Entering infomap_certAuthEAI.js");
// This is expected to be a 'step-up' flow so the end user should already by authenticated.

// Get the 'subjectcn' from the incoming cert EAI header
var credSubjectcn = "" + context.get(Scope.SESSION, "urn:ibm:security:asf:response:token:attribute", "tagvalue_subjectcn");
var reqSubjectCn = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:header", "eai_subject_cn");

if(credSubjectcn != "" && credSubjectcn != null && credSubjectcn != "null"){
	// If the credential attribute already exists that means we've already performed certificate authentication
	// Set success to 'true' and move on
	IDMappingExtUtils.traceString("infomap_certAuthEAI.js -- credential attribute was present with value of : " + credSubjectcn);
	success.setValue(true);
} else {
	if(reqSubjectCn != "" && reqSubjectCn != null && reqSubjectCn != "null") {
		IDMappingExtUtils.traceString("infomap_certAuthEAI.js -- request header was present with value of : " + reqSubjectCn);
		context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "tagvalue_subjectcn", reqSubjectCn);
		context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "AUTHENTICATION_LEVEL", "4");
		
		success.setValue(true);
	} else {
		// Lack of 
		success.setValue(false);
	}
}

IDMappingExtUtils.traceString("Exiting infomap_certAuthEAI.js");