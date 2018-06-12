/*
 Developed by : jcyarbor@us.ibm.com
 Purpose : 
	This mapping rule was created to prompt a user once a session to perform MFA.
	This is intended to be used as a Federation Access Policy and has been tested on the following platforms : 
		ISAM 9.0.4.0 - IdP initiated
		
	Java class reference can be found on the appliance in the following location : 
	Manage System Settings -> Secure Settings -> File Downloads ->>
	federation -> doc -> ISAM-javadoc.zip
	
	The following need to be replaced with values from your environment : 
	
	<authentication-mechanism-urn> - The URN Identifier of the Authentication Mechanism
		This can be found at 'Secure Access Control -> Policy -> Authentication ->>
			Mechanisms -> *authmech* -> Modify Authentication Mechanism ->>
			General -> Identifier'
			
	<protocol> - This should either be 'http' or 'https'
	
	<your_idp_host> - The hostname of your IdP Federation
	
	<aac_junction> - The name of your AAC Junction
	
	<authentication_policy_urn> - The URN Identifier of your Authentication Policy
		This can be found at 'Secure Access Control -> Policy -> Authentication ->>
			Policies -> *authpolicy* -> Modify Authentication Policy ->>
			General -> Identifier'
	
	<federation_junction> - The name of the junction associated with your ISAM Federation
	
*/

importClass(Packages.com.ibm.security.access.policy.decision.Decision);
importClass(Packages.com.ibm.security.access.policy.decision.HtmlPageDenyDecisionHandler);
importClass(Packages.com.ibm.security.access.policy.decision.RedirectChallengeDecisionHandler);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

IDMappingExtUtils.traceString(" -- Entering 'mfa_for_partner' Access Policy -- ");

//
// Store the current user in a variable
//
var userContext = context.getUser();

// 
// Get the user's attributes
//
var userAttrs = userContext.getAttributes();

// Instantiate an empty holder for the Authentication Mechanism Type values
var authMechTypeValues;

IDMappingExtUtils.traceString("About to loop through attributes to look for completed authentication mechanism types");
for( var it = userAttrs.iterator(); it.hasNext();) {
   IDMappingExtUtils.traceString("Entered Attribute loop");
   var attribute = it.next();
   var attributeName = attribute.getName();

   IDMappingExtUtils.traceString("Current Attribute : " + attributeName);   

   if(attributeName.equals("authenticationMechanismTypes")){
      authMechTypeValues = attribute.getValues();
   }
}

//
// Make a variable to determine whether we need to perform MFA
//
var needsMFA = true;

//
// Loop through the authMechTypes values to determine whether you want the user to perform MFA
//
if(authMechTypeValues != null){

	IDMappingExtUtils.traceString("Here are the authenticationMechanismTypes values : " + authMechTypeValues);

	for( var it = authMechTypeValues.iterator(); it.hasNext();) {
		//
		// If the end user has not completed the authentication Mechanism this session make them step up
		//
		if(it.next().toString().equals("<authentication-mechanism-urn>")){
			needsMFA = false;
		}
   }
} else {
   IDMappingExtUtils.traceString("Has not performed MFA yet");
}

// 
// If we have not performed MFA, redirect to MFA
// Else, allow access
//  
if (needsMFA){
	var handler = new RedirectChallengeDecisionHandler();

	//
	// The redirect URI needs to be changed to match the absolute URI that corresponds with your MGA instance
	//
	// Be sure to change the junction in the Target to match your Federation junction
	//
	// Be sure to change the 'PolicyId' to match the Authentication Policy you want the end user to complete
	//
	
	handler.setRedirectUri("<protocol>://<your_idp_host>/<aac_junction> - The name of your AAC Junction/sps/authsvc?PolicyId=<authentication_policy_urn>&Target=/<federation_junction>@ACTION@");
	
	var decision = Decision.challenge(handler);
	context.setDecision(decision);
}
else{
	IDMappingExtUtils.traceString("The end user has successfully completed MFA");
	var decision = Decision.allow();
	context.setDecision(decision);
}
IDMappingExtUtils.traceString(" -- Exiting 'mfa_for_partner' Access Policy -- ");
