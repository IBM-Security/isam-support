/*
*		Title: oauth-json-xacml-callout.js
*		Author : Jack Yarborough (jcyarbor@us.ibm.com)
*		
*		Intended Purpose :
*			This is an example access policy of how to call the JSON XACML engine included with AAC to get a Risk Score evaluation from the access policy.
*
*		Appliance Implementation :
*			1) Navigate to 'Secure Access Control -> Global Settings -> Access Policies'
*			2) Select 'Add' to create a new mapping rule
*				- Name : 'oauth-json-xacml-callout'
*				- Type : JavaScript
*				- Category : 
*
*/

// Import statements from documentation : https://www.ibm.com/support/knowledgecenter/en/SSPREK_9.0.7/com.ibm.isam.doc/config/reference/ref_accpol_sample.html

importClass(Packages.com.ibm.security.access.policy.decision.Decision);
importClass(Packages.com.ibm.security.access.policy.decision.HtmlPageDenyDecisionHandler);
importClass(Packages.com.ibm.security.access.policy.decision.RedirectDenyDecisionHandler);
importClass(Packages.com.ibm.security.access.policy.decision.HtmlPageChallengeDecisionHandler);
importClass(Packages.com.ibm.security.access.policy.decision.RedirectChallengeDecisionHandler);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.utilities); 
importPackage(Packages.com.ibm.security.access.httpclient);

// Import utility files that can be found here :

importMappingRule("oauth-json-rtss-utilities");
importMappingRule("oauth-access-policy-utilities");

// In this example we'll use the default 'behavior' risk profile
var behaviorJSONBody = buildEmptyJSONBody();
buildDefaultBehaviorRiskProfile(behaviorJSONBody);

IDMappingExtUtils.traceString("Behavior JSON Body : " +JSON.stringify(behaviorJSONBody));

// Add a Resource ID that maps to the WebSEAL resource : /resource
addResourceId("/index.html", behaviorJSONBody)

// Add a Context ID that maps to the WebSEAL resources : /WebSEAL/server-name/resource
addContextId("/WebSEAL/isam9070lmi.hyperv.lab-default/index.html", behaviorJSONBody)

// Get the username from the request Access Policy Request
// You have to append the output to a JavaScript String to not anger the JSON parser.

// User Context Documentation : https://www.ibm.com/support/knowledgecenter/en/SSPREK_9.0.7/com.ibm.isam.doc/config/concept/access_policies_user_context.html

var userName = ""+ userJSON.username;

addStringSubjAttr("urn:ibm:security:subject:username", userName, behaviorJSONBody)

IDMappingExtUtils.traceString("Final JSON Body : " +JSON.stringify(behaviorJSONBody));

// Now we build the HTTPS Call to the JSON RTSS Authz Service
var url = "https://localhost/rtss/rest/authz/json";
var headers = new Headers();
headers.addHeader("content-type","application/json");

var body = JSON.stringify(behaviorJSONBody);

var rsp = HttpClient.httpPost(url,headers,body, null, "easuser","passw0rd", null, null, 30);

var rspBody = rsp.getBody();

IDMappingExtUtils.traceString(rspBody);

var rspJSON = JSON.parse(rspBody);

var rspJSONStatusCode = rspJSON.Response[0].Status.StatusCode;
var rspJSONObligations;
if(typeof rspJSON.Response[0].Obligations === 'undefined') {
	rspJSONObligations = null;
} else {
	rspJSONObligations = rspJSON.Response[0].Obligations;
}
var rspJSONDecision = rspJSON.Response[0].Decision;

IDMappingExtUtils.traceString(rspJSONStatusCode.Value ?  "XACML StatusCode : " + rspJSONStatusCode.Value : "XACML StatusCode : ");
IDMappingExtUtils.traceString(rspJSONObligations ? "XACML Obligation : " + rspJSONObligations[0].Id : "XACML Obligation : ");
IDMappingExtUtils.traceString(rspJSONDecision ? "XACML Decision : " + rspJSONDecision : "XACML Decision : ");

// Check to see if we have an obligation
if(rspJSONObligations != null) {
	// We have an obligation.
	// If the value is 'urn:ibm:security:obligation:register_device' that means device registration failed so we need to gather all the attributes and invoke the InfoJSLoader auth mech.
	if(rspJSONObligations[0].Id == "urn:ibm:security:obligation:register_device") {
		var handler = new RedirectChallengeDecisionHandler();
		IDMappingExtUtils.traceString("Redirecting to InfoJSLoader");
		handler.setRedirectUri("/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:InfoJSLoader&Target=https://isam9070.hyperv.lab/mga@ACTION@");
		context.setDecision(Decision.challenge(handler));
	}
	// So, if the obligation is null, that means that the device registration was successful. We need to make sure we can permit the user.
} else if(rspJSONDecision == "Permit") {
	context.setDecision(Decision.allow());
	// If it wasn't permit and there wasn't a obligation we need to deny the user.
} else {
			var handler = new HtmlPageDenyDecisionHandler();
		handler.setMacro("@MESSAGE@", "This user is not allowed to preform sso");
		context.setDecision(Decision.deny(handler));
}
