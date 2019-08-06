/*
	File Name : token-router.js
	Author : Jack Yarborough
	Contact : jcyarbor@us.ibm.com
	
	Usage : This mapping rule is used to route between different trust chains for validation of token types.
          It accomplishes the following:
		- Confirms whether the token is a JWT or an OAUTH token
    - Extracts the issuer from JWT tokens
		- Sends JWT for validation
    - Sends OAUTH tokens for validation
    - Returns STSUU with Reverse Proxy consumable attributes
		
	**This JavaScript mapping rule is provided as-is and is supported by the author.
	** All variable names, attribute names, and logic are provided as an example
	** All non-customized JS default as provided by the ISAM Appliance AAC Module when creating an API Protection Definition
	** The LocalSTSClient class is available in 9.0.5.0+
	
	*** Explicit credit and thanks to Leo Farrel for his blog :
		https://www.ibm.com/blogs/security-identity-access/oauth-jwt-access-token/
	
	Please refer to the following documentation for a complete list of classes that are available for use in InfoMap Mapping rules : 
		- https://www.ibm.com/support/knowledgecenter/en/SSPREK_9.0.7/com.ibm.isam.doc/config/concept/con_otp_customize_mapping_rules_gs_aac.html
*/
importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.oauth20);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);
importPackage(Packages.com.ibm.security.access.user);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.OAuthMappingExtUtils);
importClass(Packages.java.util.ArrayList);
importClass(Packages.java.util.HashMap);
importClass(Packages.com.tivoli.am.fim.fedmgr2.trust.util.LocalSTSClient);

function getAccessToken(stsuuInput) {
	return stsuu.getContextAttributesAttributeContainer().getAttributeValueByNameAndType("access_token","urn:ibm:names:ITFIM:oauth:param");
}

function isJwt(accessToken) {
	// Print out input JWT
	IDMappingExtUtils.traceString("token-router.js :: entering isJwt("+accessToken+")");
	
	var stringAT = ""+accessToken+"";
	
	var header = stringAT.split('.')[0];
	var base64Url = stringAT.toString().split('.')[1];
	var signature = stringAT.toString().split('.')[2];
	
	IDMappingExtUtils.traceString("token-router.js :: isJwt() :: header : " + header);
	IDMappingExtUtils.traceString("token-router.js :: isJwt() :: base64Url : " + base64Url);
	IDMappingExtUtils.traceString("token-router.js :: isJwt() :: signature : " + signature);
	
	if(base64Url == null || base64Url == "") {
		IDMappingExtUtils.traceString("token-router.js :: exiting isJwt() :: false");
		return false;
	} else {
		IDMappingExtUtils.traceString("token-router.js :: exiting isJwt() :: true");
		return true;
	}
}

function retrieveIssFromJwt(jwt) {
	IDMappingExtUtils.traceString("token-router.js :: entering retrieveIssFromJwt(jwt)");
	
	var inputJwt = ""+jwt+"";
	
	// Get the 'Meat' of the JWT	
	var base64Url = inputJwt.split('.')[1];
	
	// Base64 URL Decode the JWT
	var jwtUrlDecode = new java.lang.String(java.util.Base64.getUrlDecoder().decode(base64Url));
	
	// JSON Parse the decoded JWT
	var jwtUrlDecodeJSON = JSON.parse(jwtUrlDecode);
	
	// Access the value via JSON Array
	IDMappingExtUtils.traceString("token-router.js :: exiting retrieveIssFromJwt(jwt)");
	return jwtUrlDecodeJSON['iss'];
}

function retrieveAudFromJwt(jwt) {
	IDMappingExtUtils.traceString("token-router.js :: entering retrieveAudFromJwt(jwt)");
	
	var inputJwt = ""+jwt+"";
	
	// Get the 'Meat' of the JWT	
	var base64Url = inputJwt.split('.')[1];
	
	// Base64 URL Decode the JWT
	var jwtUrlDecode = new java.lang.String(java.util.Base64.getUrlDecoder().decode(base64Url));
	
	// JSON Parse the decoded JWT
	var jwtUrlDecodeJSON = JSON.parse(jwtUrlDecode);
	
	IDMappingExtUtils.traceString("token-router.js :: exiting retrieveAudFromJwt(jwt)");
	
	// Access the value via JSON Array
	return jwtUrlDecodeJSON['aud'];
}

function makeOauthValidationRequest(stsuu) {
	IDMappingExtUtils.traceString("token-router.js :: entering makeOauthValidationRequest(stsuu)");
	var requestType = "http://schemas.xmlsoap.org/ws/2005/02/trust/Validate";
	
	// Printing out the STSUU for debug purposes
	IDMappingExtUtils.traceString("token-router.js :: makeOauthValidationRequest :: Input STSUU : " + stsuu.toString());
	
	IDMappingExtUtils.traceString("token-router.js :: makeOauthValidationRequest :: ContextAttributes() : " + stsuu.getContextAttributesAttributeContainer().toString());
	var afterRST = IDMappingExtUtils.subStringAfterLast(stsuu.toString(),"<stsuuser:RequestSecurityToken/>");
	var bst = IDMappingExtUtils.subStringBeforeLast(afterRST,"<stsuuser:AdditionalAttributeStatement/>");
	IDMappingExtUtils.traceString("token-router.js :: makeOauthValidationRequest :: bst : " + bst.toString());
	
	var xmlBst = IDMappingExtUtils.stringToXMLElement('<stsuuser:STSUniversalUser xmlns:stsuuser="urn:ibm:names:ITFIM:1.0:stsuuser">'+bst+'</stsuuser:STSUniversalUser>');
	
	var result = LocalSTSClient.doRequest(requestType,"https://localhost/sps/oauth/oauth20","urn:ibm:ITFIM:oauth20:token:bearer", xmlBst, null);
	
	var tokenStsuu = new STSUniversalUser();
	
	if(result.errorMessage != null) {
		IDMappingExtUtils.traceString("token-router.js :: makeOauthValidationRequest :: "+result.errorMessage);
	} else {
		tokenStsuu.fromXML(result.token);
	}
	
	IDMappingExtUtils.traceString("token-router.js :: exiting makeOauthValidationRequest(stsuu)");
	
	// Return an output STSUU
	return tokenStsuu;
}

function makeJwtValidationRequest(accessToken, issuer, audience) {
	IDMappingExtUtils.traceString("token-router.js :: entering makeJwtValidationRequest(accessToken, issuer, audience)");
	var requestType = "http://schemas.xmlsoap.org/ws/2005/02/trust/Validate";
	var bst = IDMappingExtUtils.stringToXMLElement('<wss:BinarySecurityToken xmlns:wss="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" wss:EncodingType="http://ibm.com/2004/01/itfim/base64encode"  wss:ValueType="urn:com:ibm:JWT" >'+accessToken+'</wss:BinarySecurityToken>');
	
	var result = LocalSTSClient.doRequest(requestType,audience, issuer, bst, null);
	
	var resultantStsuu = new STSUniversalUser();
	
	if (result.errorMessage == null) {
    var result_element_string = IDMappingExtUtils.xmlElementToString(result.token);
		IDMappingExtUtils.traceString("token-router.js :: makeJwtValidationRequest() :: got result: " + result_element_string);
		
		// Make an STSUU out of the result
		resultantStsuu.fromXML(result.token);
		
	} else {
		IDMappingExtUtils.throwSTSException("token-router.js :: makeJwtValidationRequest() :: An error occurred invoking the STS: " + result.errorMessage);
	}
	
	IDMappingExtUtils.traceString("token-router.js :: exiting makeJwtValidationRequest(accessToken, issuer, audience)");
	return resultantStsuu;
}

// Read in the STSUU
var stsuu = new STSUniversalUser(stsrequest.getRequestSecurityToken().getBase());

// Retrieve the 'access_token' from the input STSUU
var at = getAccessToken(stsuu);
if(isJwt(at)) {
	
	// Get the 'iss' value
	var issuer = retrieveIssFromJwt(at);
	
	// Get the 'aud' value
	var audience = "urn:jwt:" + retrieveAudFromJwt(at);
	
	// This should be an STSUU representation of the JWT
	var outputStsuu = makeJwtValidationRequest(at,issuer,audience);
	
	if(outputStsuu != null){
		// Store the output attributes for later
		var attrContainer = outputStsuu.getAttributeContainer();
		
		// Clear the output STSUU
		outputStsuu.clear();
		
		// Add the attributes back in as the proper OAUTH types		
		// We'll do this using an interator, based off of Leo Farrell's blog. Credit to him and his mapping.
		var attrItr = attrContainer.getAttributeIterator();
		
		var expires = 0;
		
		while (attrItr.hasNext()) {
			var newAttr = attrItr.next();
			newAttr.setType("urn:ibm:names:ITFIM:oauth:response:attribute");
			if(newAttr.getName() == "exp") {
				expires =  Number(""+newAttr.getValues()[0]);
			} else if (newAttr.getName() == "sub") {
				newAttr.setName("username");		
			}
			outputStsuu.addContextAttribute(newAttr);
		}
		
		// We need to add in the session expiration : 
		var jsDate = new Date(expires * 1000);
		
		// Create the UTC date
		var UTCDate = IDMappingExtUtils.getTimeStringUTC(jsDate.getFullYear(), jsDate.getMonth(), jsDate.getDay(), jsDate.getHours(), jsDate.getMinutes(), jsDate.getSeconds());
		
		// Add the UTC date to the output STSUU
		outputStsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("expires","urn:ibm:names:ITFIM:oauth:response:decision",utcDate));
		
		// Add a 'True' authorized decision to the STSUU
		outputStsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("authorized","urn:ibm:names:ITFIM:oauth:response:decision","TRUE"));
	} else {
		// Throw an error because the JWT validation did not work
		IDMappingExtUtils.throwSTSException("token-router.js :: The JWT did not validate successfully. Please check earlier errors");
		
		// Return a 'False' value for the Authentication/Authorization decision.
		var outputStsuu = new STSUniversalUser();
		outputStsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("authorized","urn:ibm:names:ITFIM:oauth:response:decision","FALSE"));
	}
} else {
	// If it's not a JWT, make a call to validate the Oauth token.
	var outputStsuu = makeOauthValidationRequest(stsuu);
}

//Return the 
stsresponse.addRequestSecurityTokenResponse().setRequestedSecurityToken(outputStsuu.toXML().getDocumentElement())
