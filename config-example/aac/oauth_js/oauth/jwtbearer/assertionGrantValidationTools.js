/*
	File Name : assertionGrantValidationTools.js
	Author : Jack Yarborough
	Contact : jcyarbor@us.ibm.com
	
	Usage : This mapping rule can be imported into the 'PreTokenGeneration' mapping rule and is to be used with the 'JWT Bearer' grant type OAUTH flow.
		- Confirm supplied assertion is a JWT
		- Perform Callout to STS Chain to validate JWT
		
	**This JavaScript mapping rule is provided as-is and is supported by the author.
	** All variable names, attribute names, and logic are provided as an example
	** All non-customized JS default as provided by the ISAM Appliance AAC Module when creating an API Protection Definition
	** General AAC/Federatio Auditing is available since 9.0.6.0
	
	***** Setting up the STS Chain to validate the JWT *****
		1. Navigate to 'Secure Federation -> Manage -> Secure Token Service'
		2. Create a Template that has the 'Default JWT Module' in 'Validate'
		 - Name : validateJWT
		 
		3. Create a Module Chain with the following Specs:
			Overview
				- Name : _userinput_   // This should be specific enough that you know which issuer's JWT you are validating
				- Description : _userinput_ // This can include information about the issuer in question
				- Template : validateJWT
			
			Lookup
				 - RequestType : Validate
				 - AppliesTo:
					- Address : jwt:validate
				 - Issuer : 
					- Address : _issuerofJWT_
			
			Properties
				Fill these out to match your issuer's settings.
	
	Please refer to the following documentation for a complete list of classes that are available for use in InfoMap Mapping rules : 
		- https://www.ibm.com/support/knowledgecenter/en/SSPREK_9.0.7/com.ibm.isam.doc/config/concept/con_otp_customize_mapping_rules_gs_aac.html
*/
importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.oauth20);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);
importPackage(Packages.com.ibm.security.access.user);
importClass(Packages.com.tivoli.am.fim.fedmgr2.trust.util.LocalSTSClient);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.OAuthMappingExtUtils);
importClass(Packages.com.ibm.security.access.httpclient.HttpClient);
importClass(Packages.com.ibm.security.access.httpclient.HttpResponse);
importClass(Packages.com.ibm.security.access.httpclient.Headers);
importClass(Packages.com.ibm.security.access.httpclient.Parameters);
importClass(Packages.java.util.ArrayList);
importClass(Packages.java.util.HashMap);

function trace(string) {
	IDMappingExtUtils.traceString("assertionGrantValidation::trace::"+string);
}

function hasClaim(desiredClaim, claims) {
	var keys = Object.keys(claims);
	
	hasClaim = false;
	
	for(var i = 0; i < keys.length; i++) {
		var currentClaim = keys[i];
		if(desiredClaim === currentClaim) {
			hasClaim = true;
		}
	}
	return hasClaim;
}

function jsonObjectToJSArray(object) {
	var objectLength = object.length;
	
	var array = new java.lang.reflect.Array.newInstance(java.lang.String, objectLength);
	
	for(var i = 0; i < objectLenth; i ++) {
		array[i] = object[i];
	}
	return array;
}

function stsValidateJWT(assertion) {
	var jwt = "" + assertion;
	
	trace("stsValidateJWT::input assertion : " + jwt);
	
	var jwtClaims = getJWTClaims(jwt);
	
	var issuer = jwtClaims["iss"];
	
	trace("stsValidateJWT::issuer from JWT : " + issuer);
	
	var base_token = IDMappingExtUtils.stringToXMLElement('<wss:BinarySecurityToken xmlns:wss="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" wss:EncodingType="http://ibm.com/2004/01/itfim/base64encode"  wss:ValueType="urn:com:ibm:JWT" >'+jwt+'</wss:BinarySecurityToken>');
	
	var res = LocalSTSClient.doRequest("http://schemas.xmlsoap.org/ws/2005/02/trust/Validate", "jwt:validate", issuer , base_token, null);
	if (res.errorMessage == null) {
		var result_element_string = IDMappingExtUtils.xmlElementToString(res.token);
		trace("stsValidateJWT::got result: " + result_element_string);
		return true;
	} else {
		trace("stsValidateJWT::An error occurred invoking the STS: " + res.errorMessage);
		// The variable 'currentSPSSession' is assumed to be in the parent calling mapping rule and is the result of 'var currentSPSSession = IDMappingExtUtils.getSPSSessionID();'
		IDMappingExtUtils.setSPSSessionData(currentSPSSession, res.errorMessage);
		return false;
	}
}

function isJWT(assertion) {
	isJwt = false;
	
	trace("isJWT::Assertion : " + assertion);
	
	if(assertion.indexOf(".") > 0) {
		isJwt = true;
	}
	return isJwt;
}

function b64UrlDecode(b64UrlString) {
	return new java.lang.String(java.util.Base64.getUrlDecoder().decode(b64UrlString));
}

function getJWTHeader(assertion) {
	// Returns a JSON object of the JWT Header
	if(isJWT(assertion)) { 
		var jwt = "" + assertion;
		var header = ""+ jwt.split(".")[0];
		trace("getJWTHeader::JWT Header before decoding: " + header);
		var decodedHeader = b64UrlDecode(header);
		trace("getJWTHeader::JWT Header after decoding: " + decodedHeader);
		return JSON.parse(decodedHeader);
	}
}

function getJWTClaims(assertion) {
	// Returns a JSON object of the JWT claims
	if(isJWT(assertion)) { 
		var jwt = "" + assertion;
		var claims = ""+ jwt.split(".")[1];
		trace("getJWTClaims::JWT Claims before decoding: " + claims);
		
		var decodedClaims = b64UrlDecode(claims);
		trace("getJWTClaims::JWT Claims after decoding: " + decodedClaims);
		
		return JSON.parse(decodedClaims);
	}
}

function getJWTSig(assertion) {
	// Returns a JSON object of the JWT Signature
	if(isJWT(assertion)) { 
		// We don't want to JSON Parse the Signature as it's not valid JSON
		var jwt = "" + assertion;
		var sig = ""+ jwt.split(".")[2];
		trace("getJWTSig::JWT Signature after decoding : " + b64UrlDecode(sig));
		return b64UrlDecode(sig);
	}	
}

function validateAssertionGrant(assertion, grant_type) {
	// Validation of the assertion will be different depending on the type of grant. Both will require callouts to the local STS.
	var isAssertionValid = false;
	
	// Check to see if this is a JWT Grant
	if(grant_type == "urn:ietf:params:oauth:grant-type:jwt-bearer" ) {
		// Parse the JWT so we can get the information needed to call a trust chain
		// A JWT should have '2' '.' characters in it separating the different sections. a SAML 2.0 assertion that is base64 encoded won't contain '.' characters because those characters are not part of base64 encoding
		if(isJWT(assertion)) {
			isAssertionValid = stsValidateJWT(assertion);	
		} else {
			trace("validateAssertionGrant::Assertion is not valid JWT");
		}		
	} 
	// Check to see if this is a SAML 2.0 Grant
	else if( grant_type == "urn:ietf:params:oauth:grant-type:saml2-bearer" ) {
		
	} else {
		trace("validateAssertionGrant::The grant_type was not JWT or SAML 2.0");
		isAssertionValid = false;
	}
	return isAssertionValid;
}
