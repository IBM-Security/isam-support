// POST TOKEN AZNCODE
importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.modules.http.stsclient.STSClientHelper);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.OAuthMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.MMFAMappingExtUtils);
importClass(Packages.com.ibm.security.access.httpclient.HttpClient);
importClass(Packages.com.ibm.security.access.httpclient.HttpResponse);
importClass(Packages.com.ibm.security.access.httpclient.Headers);
importClass(Packages.com.ibm.security.access.httpclient.Parameters);
importClass(Packages.java.util.ArrayList);
importClass(Packages.java.util.HashMap);

/**
 *
 * This mapping rule contains scenarios which occur post token creation. This
 * includes examples for:
 *
 * -- Associating attributes
 * -- Deleting tokens
 * -- Making a HTTP(S) callout
 * -- Updating a token
 * -- Registering an Authenticator for MFA
 * -- Enforcing clients are only introspecting their own tokens
 * -- Tweaks relevent to device flows.
 *
 */

/**
 * Discover the request_type and the grant type
 */
var request_type = null;
var grant_type = null;
var state_id = null;

// The request type - if none available assume 'resource'
var global_temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("request_type", "urn:ibm:names:ITFIM:oauth:request");
if (global_temp_attr != null && global_temp_attr.length > 0) {
	request_type = global_temp_attr[0];
} else {
	request_type = "resource";
}

// The grant type
global_temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("grant_type", "urn:ibm:names:ITFIM:oauth:body:param");
if (global_temp_attr != null && global_temp_attr.length > 0) {
	grant_type = global_temp_attr[0];
}

// The state id handle
global_temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("state_id", "urn:ibm:names:ITFIM:oauth:state");
if (global_temp_attr != null && global_temp_attr.length > 0) {
  state_id = global_temp_attr[0];
}

IDMappingExtUtils.traceString("request_type: " + request_type);
IDMappingExtUtils.traceString("state_id: " + state_id);
/** 
 * This is an example of how you could do attribute association with a given
 * state ID for the Client Credentials scenario.
 * 
 * To enable this demo, change the "cc_demo" variable to "true".
 */

var cc_demo = false;

if (cc_demo) {

	var grant_type = null;
	var temp_attr = null;

	if (request_type == "access_token" && grant_type == "client_credentials" && state_id != null) {

		/* Manipulate extra attributes */

		// Associate an extra attribute key-value pair to the authorization
		// grant
		OAuthMappingExtUtils.associate(state_id, "special_id", "sp_" + state_id);

		// Get the extra attribute keys of all extra attributes associated with
		// the authorization grant
		var attrKeyArray = OAuthMappingExtUtils.getAssociationKeys(state_id);
		if (attrKeyArray != null) {
			// Disassociate an extra attribute
			OAuthMappingExtUtils.disassociate(state_id, "special_id");
			// Associate another extra attribute
			OAuthMappingExtUtils.associate(state_id, "friendly_name", "phone client");
		}

		// Put extra attributes into stsuu context attributes
		attrKeyArray = OAuthMappingExtUtils.getAssociationKeys(state_id);
		if (attrKeyArray != null) {
			for ( var i = 0; i < attrKeyArray.length; i++) {
				stsuu.addContextAttribute(new Attribute(attrKeyArray[i], "urn:ibm:names:ITFIM:oauth:response:attribute", OAuthMappingExtUtils.getAssociation(state_id, attrKeyArray[i])));
			}
		}
	}
}

/** HTTP Client example.
 * 
 * This is an example of how you could do use the HTTP client to do HTTP GET and
 * POST requests.
 * 
 * To enable this demo, change the "httpclient_demo" variable to "true" and make
 * the appropriate modifications to the host name and other parameters of the
 * httpGet and httpPost methods.
 */

var httpclient_demo = false;

if (httpclient_demo) {

	/* HttpClient */
	var hr = new HttpResponse();
	var headers = new Headers();
	var params= new Parameters();
	headers.addHeader("x-header-1", "header_value");
	params.addParameter("param1", "param1_value");

	/**
	 * Minimal HTTP GET and POST
	 */

	// httpGet(String url)
	hr = HttpClient.httpGet("http://yourHostName/");

	if (hr != null) {
		IDMappingExtUtils.traceString("code: " + hr.getCode()); // output to
		// trace
		IDMappingExtUtils.traceString("body: " + hr.getBody());
		var headerKeys = hr.getHeaderKeys();
		if (headerKeys != null) {
			for ( var i = 0; i < headerKeys.length; i++) {
				var headerValues = hr.getHeaderValues(headerKeys[i]);
				for ( var j = 0; j < headerValues.length; j++) {
					IDMappingExtUtils.traceString("header: " + headerKeys[i] + "=" + headerValues[j]);
				}
			}
		}
	}

	// httpPost(String url, Map parameters)
	hr = HttpClient.httpPost("http://yourHostName/", params);
	if (hr != null) {
		IDMappingExtUtils.traceString("code: " + hr.getCode());
		IDMappingExtUtils.traceString("body: " + hr.getBody());
		headerKeys = hr.getHeaderKeys();
		if (headerKeys != null) {
			for ( var i = 0; i < headerKeys.length; i++) {
				var headerValues = hr.getHeaderValues(headerKeys[i]);
				for ( var j = 0; j < headerValues.length; j++) {
					IDMappingExtUtils.traceString("header: " + headerKeys[i] + "=" + headerValues[j]);
				}
			}
		}
	}

	/**
	 * HTTPS vs HTTP
	 * 
	 * For HTTPS, using the minimal httpGet and httpPost methods will assume the
	 * default trust store (util.httpClient.defaultTrustStore in Advanced
	 * Configuration panel). Alternatively, you can use the full httpGet and
	 * httpPost methods to specify the connection parameters, giving null to any
	 * field that is not required.
	 */

	/**
	 * httpGet(String url, Map headers, String httpsTrustStore, String
	 * basicAuthUsername,String basicAuthPassword, String clientKeyStore,String
	 * clientKeyAlias);
	 */
	hr = HttpClient.httpGet("https://yourHostName/", null, null, "admin", "password", null, null);
	if (hr != null) {
		// output to trace
		IDMappingExtUtils.traceString("code: " + hr.getCode()); 
		IDMappingExtUtils.traceString("body: " + hr.getBody());
		headerKeys = hr.getHeaderKeys();
		if (headerKeys != null) {
			for ( var i = 0; i < headerKeys.length; i++) {
				var headerValues = hr.getHeaderValues(headerKeys[i]);
				for ( var j = 0; j < headerValues.length; j++) {
					IDMappingExtUtils.traceString("header: " + headerKeys[i] + "=" + headerValues[j]);
				}
			}
		}
	}

	/**
	 * httpPost(String url, Map headers, Map parameters,String httpsTrustStore,
	 * String basicAuthUsername,String basicAuthPassword, String
	 * clientKeyStore,String clientKeyAlias);
	 */
	hr = HttpClient.httpPost("https://yourHostName/", null, params, null, null, null, "client_keystore", "myKeyAlias");
	if (hr != null) {
		IDMappingExtUtils.traceString("code: " + hr.getCode());
		IDMappingExtUtils.traceString("body: " + hr.getBody());
		headerKeys = hr.getHeaderKeys();
		if (headerKeys != null) {
			for ( var i = 0; i < headerKeys.length; i++) {
				var headerValues = hr.getHeaderValues(headerKeys[i]);
				for ( var j = 0; j < headerValues.length; j++) {
					IDMappingExtUtils.traceString("header: " + headerKeys[i] + "=" + headerValues[j]);
				}
			}
		}
	}
}

/** Delete Token from cache
 *
 * This is an example of how you could do delete a token from the cache given the token ID
 * 
 * To enable this demo, change the "deleteToken_demo" variable to "true".
 */

var deleteToken_demo = false;

if (deleteToken_demo) {
	var access_token_id = null;
	var refresh_token_id =null;
	var temp_attr = null;
	
	
	//access_token_id
	temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("access_token_id", "urn:ibm:names:ITFIM:oauth:response:metadata");
	if (temp_attr != null && temp_attr.length > 0) {
		access_token_id = temp_attr[0];
	} 
	
	//refresh_token_id
	temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("refresh_token_id", "urn:ibm:names:ITFIM:oauth:response:metadata");
	if (temp_attr != null && temp_attr.length > 0) {
		refresh_token_id = temp_attr[0];
	} 
	
	// Delete Token Scenario when request_type is access token and grant type is password.
	if (request_type == "access_token" && grant_type == "password") {
		if (access_token_id !=null){
				OAuthMappingExtUtils.deleteToken(access_token_id);
		}
	
		if (refresh_token_id !=null){
				OAuthMappingExtUtils.deleteToken(refresh_token_id);
		}
	}


}

/** Register a new authenticator
 *
 * This is an example of how you could register a new authenticator given the state ID
 * 
 * This functionality is enabled if the client includes scope value "mmfaAuthn" in the grant request.
 */

function isMmfaScopePresent() {
	var scopeAttr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("scope", "urn:ibm:names:ITFIM:oauth:response:attribute");

	if (scopeAttr != null) {
		for (var i = 0; i < scopeAttr.length; i++) {
			if (scopeAttr[i] == "mmfaAuthn") {
				return true;
			}
		}
	}

	return false;
 }

if (isMmfaScopePresent()) {

	IDMappingExtUtils.traceString("request_type: " + request_type);
	IDMappingExtUtils.traceString("grant_type: " + grant_type);

	// Check to see if this is a token request (other request types include 'authorize')
	if(request_type != null && request_type == "access_token") {

		var token = stsuu.getContextAttributes().getAttributeValuesByName("push_token");
		var appId = stsuu.getContextAttributes().getAttributeValuesByName("application_id");

		// If this isn't a refresh token request, we we will want to save the new authenticator.
		var authenticatorRegId = null;
		if(grant_type != null && grant_type != "refresh_token") {
			authenticatorRegId = MMFAMappingExtUtils.registerAuthenticator(state_id);
		} else {
			authenticatorRegId = MMFAMappingExtUtils.getAuthenticator(state_id);
		}

		if (authenticatorRegId != null) {
			// return the authenticator id as an additional OAuth token response
			// attribute
			var attr = new Attribute("authenticator_id", "urn:ibm:names:ITFIM:oauth:response:attribute", authenticatorRegId);
			stsuu.addContextAttribute(attr);

			// Provide the display_name attribute to customize the account name for IBM Security Mobile Access SDK registrations
			// This example will use the username from any token associated with the current grant
			var displayName = null;
			var tokens = OAuthMappingExtUtils.getTokens(state_id);
			if (tokens != null && tokens.length > 0) {
				displayName = tokens[0].getUsername();
			}
			if (displayName != null) {
				stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("display_name" ,"urn:ibm:names:ITFIM:oauth:response:attribute", displayName));
			}
		}

		// On all requests (especially refresh!), we want to update the push token.
		if(token != null) {
			if(appId != null) {
				MMFAMappingExtUtils.savePushToken(state_id, token[0], appId[0]);
			} else {
				MMFAMappingExtUtils.savePushToken(state_id, token[0]);
			}
		} else {
			IDMappingExtUtils.traceString("Push token was null and was not saved.");
		}

		var device_name = stsuu.getContextAttributes().getAttributeValuesByName("device_name");
		if (device_name != null && device_name.length > 0) {
			device_name = device_name[0];
		} 
		var device_type = stsuu.getContextAttributes().getAttributeValuesByName("device_type");
		if (device_type != null && device_type.length > 0) {
			device_type = device_type[0];
		} 
		var os_version	= stsuu.getContextAttributes().getAttributeValuesByName("os_version");
		if (os_version != null && os_version.length > 0) {
			os_version = os_version[0];
		} 
		var fingerprint_support	 = stsuu.getContextAttributes().getAttributeValuesByName("fingerprint_support");
		if (fingerprint_support != null && fingerprint_support.length > 0) {
			fingerprint_support = fingerprint_support[0];
		} 
		var front_camera_support = stsuu.getContextAttributes().getAttributeValuesByName("front_camera_support");
		if (front_camera_support != null && front_camera_support.length > 0) {
			front_camera_support = front_camera_support[0];
		} 
		var tenant_id = stsuu.getContextAttributes().getAttributeValuesByName("tenant_id");
		if (tenant_id != null && tenant_id.length > 0) {
			tenant_id = tenant_id[0];
		} 

		MMFAMappingExtUtils.saveDeviceAttributes(state_id, 
				device_name, 
				device_type, 
				os_version, 
				fingerprint_support, 
				front_camera_support, 
				tenant_id);
	}
}


/** Token Update demo
 *
 * The following is a demo which shows how a token can be updated to change its
 * expiry. 
 *
 * In this demo the client details are retrieved, and the "other_info" field
 * used to get out a per client token expiry. 
 */
var tokenUpdateDemo = false;
if(tokenUpdateDemo) {
	/*
	 * The following snippet of code updates the expiry of an access token
	 * on issue from the token endpoint.
	 *
	 * An example of using this method, would be if different clients
	 * within the same definition wish to have different token lifetimes.
	 *
	 * The "Other Info" field of a client can be used to store this data.
	 * This example assumes a value of
	 * "...,access_token_lifetime=1000,..."
	 *
	 */

	var temp_attr = null;
	var grant_type = null;
	var code = null;

	/*
	 * Check its a request to /token.
	 */
	if (request_type == "access_token") {
		/*
		 * Extract the access token.
		 */
		var access_token_id = null;
		temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("access_token_id", "urn:ibm:names:ITFIM:oauth:response:metadata");
		if (temp_attr != null && temp_attr.length > 0) {
			access_token_id = temp_attr[0];
		} 

		if (access_token_id != null) {

			var new_lifetime = 0;
			/*
			 * Lookup client data to get the new lifetime.
			 */
			var client_id = null;
			temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("client_id", "urn:ibm:names:ITFIM:oauth:body:param");
			if (temp_attr != null && temp_attr.length > 0) {
				client_id = temp_attr[0];
			} 
			if(client_id != null) {
				var client = OAuthMappingExtUtils.getClient(client_id);
				if (client != null) {
					var other_info = client.getOtherInfo();
					if (other_info != null) {
						var other_info_array = other_info.split(",");
						for (var i = 0; i < other_info_array.length; i++) {
							var keyValue = other_info_array[i].split("=");
							if(keyValue.length > 1){
								var key = keyValue[0]; 
								var value = keyValue[1]; 
								if(key.trim() == "access_token_lifetime") {
									var parsed_value = parseInt(value.trim());
									if (!isNaN(parsed_value)) {
										new_lifetime = parsed_value;
									}
								}
							}
						}
					}
				}

			}
			if(new_lifetime != 0) {
				/*
				 * Update the token lifetime. Pass null for date_last_used and enabled, to not update
				 * their value.
				 */
				var is_updated	= OAuthMappingExtUtils.updateToken(access_token_id, new_lifetime, null, null);
				if(is_updated) {
					/*
					 * Update the expires_in field of the token response.
					 */
					IDMappingExtUtils.traceString("Token [" + access_token_id + "] was updated.");
					stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("expires_in" ,"urn:ibm:names:ITFIM:oauth:response:attribute", new_lifetime));
				} else {
					IDMappingExtUtils.traceString("Token [" + access_token_id + "] was NOT updated.");
				}
			}
		}
	}
}

/** Client Introspection Enforcement
 *
 * This block checks that the token which was introspected was infact owned by
 * the client making the introspect request
 */
var must_client_own_token_introspect = true;

if(must_client_own_token_introspect && request_type == "introspect") {
	/*
	 * get the client ID from the request 
	 */
	var temp_attr = null;
	var request_client_id = null;

	// The client ID
	temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("client_id", "urn:ibm:names:ITFIM:oauth:body:param");
	if (temp_attr != null && temp_attr.length > 0) {
		request_client_id = temp_attr[0];
	}
	// If request_client_id is still null, look somewhere else.
	if(request_client_id == null) {
		temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("client_id", "urn:ibm:names:ITFIM:oauth:query:param");
		if (temp_attr != null && temp_attr.length > 0) {
			request_client_id = temp_attr[0];
		}
	}	
	// the third and final spot
	if(request_client_id == null) {
		temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("client_id", "urn:ibm:names:ITFIM:oauth:param");
		if (temp_attr != null && temp_attr.length > 0) {
			request_client_id = temp_attr[0];
		}
	}	

	if(request_client_id == null) {
		IDMappingExtUtils.traceString("Client not found in request");
		OAuthMappingExtUtils.throwSTSUserMessageException("Client not found in request");
	}

	// now get the response client_id:
	
	var response_client_id = null;
	temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("client_id", "urn:ibm:names:ITFIM:oauth:response:attribute");
	if (temp_attr != null && temp_attr.length > 0) {
		response_client_id = temp_attr[0];
	}

	temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("active", "urn:ibm:names:ITFIM:oauth:response:attribute");
	var active = "false";
	if (temp_attr != null && temp_attr.length > 0) {
		active = temp_attr[0];
	}
	if(active != "false" && response_client_id == null) {
		IDMappingExtUtils.traceString("Client not found in response");
		OAuthMappingExtUtils.throwSTSUserMessageException("Client not found in response");
	}

	// Check the two clients match
	if(response_client_id != request_client_id) {
		// We dont want to let people know that it was someone elses token, so
		// we just return false
		stsuu.clear();
		stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("active", "urn:ibm:names:ITFIM:oauth:response:attribute", false));
	}
}

/** UserInfo Customization
 *
 * This block provides example how to customize UserInfo output based on
 * OIDC 'scope' and/or 'claims' request parameters
 * In the STSUU context, the claims are listed in terms of essential and voluntary claims.
 * Also, when AttributeSources are configured in the definition, they will be resolved as well,
 * and available in the STSUU. This is one way of doing customization. 
 */
function produceClaim(claimName, expectedValues, isEssential) {

	var value = null;

	// If expectedValues exist, use it
	if (expectedValues != null && expectedValues.length > 0) {
		value = expectedValues[0];
	}

	// Attempt to get the value of the claim from AttributeSource resolution.
	if (value == null) {
		value = stsuu.getAttributeContainer().getAttributeValueByNameAndType(claimName, "urn:ibm:names:ITFIM:5.1:accessmanager");
	}

	// Check the extra attrs now
	if(value == null && state_id != null) {
		value = OAuthMappingExtUtils.getAssociation(state_id, "urn:ibm:names:ITFIM::oauth:saved:claim:" + claimName);
  }

	// Essential claim - set the value to 'n/a' or boolean 'false' if not exist
	if (value == null && isEssential) {
		value = claimName.endsWith("_verified") ? "false" : "n/a";
	}

	// Output it for userinfo if exist
	if (value != null) {
		var attr = new Attribute(claimName, "urn:ibm:names:ITFIM:oauth:response:attribute", value);
		stsuu.addContextAttribute(attr);
	}

}
 
if (request_type == "userinfo") {

	/*
	 * Process essential claims and voluntary claims separately
	 * as we may treat them differently if it has no value.
	 * STSUU attribute's name is the claim name
	 * STSUU attribute's value(s) are the 'expected' value of the claim
	 */

	var attrs = null;

	// Retrieve list of all the 'essential' claims
	attrs = stsuu.getContextAttributes().getAttributesByType("urn:ibm:names:ITFIM:oidc:claim:essential");
	if (attrs != null && attrs.length > 0) {
		for (i = 0; i < attrs.length; i++) {
			produceClaim(attrs[i].getName(), attrs[i].getValues(), true);
		}
	}

	// Retrieve list of all the 'voluntary' claims
	attrs = stsuu.getContextAttributes().getAttributesByType("urn:ibm:names:ITFIM:oidc:claim:voluntary");
	if (attrs != null && attrs.length > 0) {
		for (i = 0; i < attrs.length; i++) {
			produceClaim(attrs[i].getName(), attrs[i].getValues(), false);
		}
	}
	// Adding for Scenario 3 : 
	var scope = stsuu.getContextAttributesAttributeContainer().getAttributeValueByName("scope");
	IDMappingExtUtils.traceString("Posttoken debug :: scope value : " + scope);

	if(scope != null && scope.length() >0){

		if(scope.indexOf("email") >= -1) {
			var access_token = stsuu.getContextAttributesAttributeContainer().getAttributeValueByName("access_token");
			IDMappingExtUtils.traceString("Posttoken debug :: access_token value : " + access_token);
			
			if(access_token != null && access_token.length() > 0){
				var oauth_token = OAuthMappingExtUtils.getToken(access_token);
				if(oauth_token != null){
					var state_id = oauth_token.getStateId();
					IDMappingExtUtils.traceString("Posttoken debug :: state_id value : " + state_id);
				}
			}
			if(state_id !=null && state_id.length() > 0){
				// We have the state id, let's get the email from the association
				var email = OAuthMappingExtUtils.getAssociation(state_id,"credMail");
				IDMappingExtUtils.traceString("Posttoken debug :: email value : " + email);
				
				if(email != null && email.length() >0){
					stsuu.addContextAttribute(new Attribute("mail","urn:ibm:names:ITFIM:oauth:response:attribute",email));
				}
			}
		}
	}
}

/** Producing JWT UserInfo
 *
 * This block provides example how to produce JWT UserInfo.
 * In the STSUU context, the signing/encryption data (based on OP Definition) are available.
 * To create JWT, we call an STS Chain which has 2 steps (not available out of the box):
 * - Default STSUU validation module
 * - Default JWT issuer module
 * Passing the signature/encryption data and all the JWT claims.
 * The JWT token result then need to be set back in STSUU under special name and type.
 *
 * If you're calling a local STS chain, take a look at the class:
 *
 * com.tivoli.am.fim.fedmgr2.trust.util.LocalSTSClient
 *
 * This is a local STS call which does not have any of the HTTP overhead (or
 * TLS cost if using https).
 *
 * Take a look at the javadoc for more details.
 */
var produce_jwt_userinfo = false;

if (request_type == "userinfo" && produce_jwt_userinfo) {

	var sts_client = new STSClientHelper("https://localhost/TrustServer/SecurityTokenService",
		"easuser", "passw0rd", "rt_profile_keys", null, null); // Change this to match your credential

	var req_stsuu = new STSUniversalUser();

	var attrs = null;

	// Retrieve context attributes of type 'urn:ibm:oidc10:jwt:create'
	attrs = stsuu.getContextAttributes().getAttributesByType("urn:ibm:oidc10:jwt:create");
	if (attrs != null && attrs.length > 0) {
		for (i = 0; i < attrs.length; i++) {
			var attr = new Attribute(attrs[i].getName(), null, attrs[i].getValues());
			req_stsuu.addContextAttribute(attr);
		}
	}

	// Retrieve context attributes of type 'urn:ibm:JWT:header:claim'
	attrs = stsuu.getContextAttributes().getAttributesByType("urn:ibm:JWT:header:claim");
	if (attrs != null && attrs.length > 0) {
		for (i = 0; i < attrs.length; i++) {
			req_stsuu.addContextAttribute(attr[i]);
		}
	}

	// Add 'iss' and 'aud' claim
	var iss = stsuu.getAttributeContainer().getAttributeValueByName("iss");
	req_stsuu.addAttribute(new Attribute("iss", "urn:ibm:jwt:claim", iss));
	var aud = stsuu.getContextAttributes().getAttributeValueByName("client_id");
	req_stsuu.addAttribute(new Attribute("aud", "urn:ibm:jwt:claim", aud));

	// Retrieve claims from context attributes of type 'urn:ibm:names:ITFIM:oauth:response:attribute'
	attrs = stsuu.getContextAttributes().getAttributesByType("urn:ibm:names:ITFIM:oauth:response:attribute");
	if (attrs != null && attrs.length > 0) {
		for (i = 0; i < attrs.length; i++) {
			var attr = new Attribute(attrs[i].getName(), "urn:ibm:jwt:claim", attrs[i].getValues());
			req_stsuu.addAttribute(attr);
		}
	}

	var base_element = req_stsuu.toXML().getDocumentElement();
	var rsp = sts_client.doSTSExchange("http://schemas.xmlsoap.org/ws/2005/02/trust/Issue",
		null, // No token type
		"urn:issuer", // Change this to match STS Chain issuer
		"urn:appliesTo", // Change this to match STS Chain appliesTo
		null, // No claims
		base_element);
	var jwtToken = IDMappingExtUtils.extractBinarySecurityToken(rsp);
	if (jwtToken != null) {
		stsuu.addContextAttribute(new Attribute("userinfo", "urn:ibm:names:ITFIM:oauth:rule:userinfo", jwtToken));
		stsuu.addContextAttribute(new Attribute("is_userinfo_jwt", "urn:ibm:names:ITFIM:oauth:rule:userinfo", "true"));
	}
}



var save_cred_attrs = true;

if (save_cred_attrs) {
	if(state_id != null) {
		var to_save_string = stsuu.getContextAttributes().getAttributeValueByNameAndType("attributesToSave", "urn:ibm:names:ITFIM::oauth:save");
		if(to_save_string != null && "" != to_save_string) {
			to_save = JSON.parse(to_save_string);

			for (var i in to_save) {
				OAuthMappingExtUtils.associate(state_id,"urn:ibm:names:ITFIM::oauth:saved:claim:" + to_save[i].key, to_save[i].value); 
			}
		}
	}
}


/*
 * The OAuth specification dictates that the Authorization server SHOULD revoke
 * access tokens which are issued to a code, if that code is re-presented to
 * the authorization server. This is available at: 
 *   https://tools.ietf.org/html/rfc6749#section-4.1.2
 *
 * In order to enable this enforcement the following snippet AND a snippet in
 * the pre token mapping rule must be enabled.
 *
 * This portion handles storing the information necessary to know if the
 * authorization code has been presented before. 
 *
 */
var assert_no_code_reuse = false;
if(assert_no_code_reuse) {
  if (request_type == "access_token" && grant_type == "authorization_code") {
    // Get an access_token to see if this is a success response
    var code = stsuu.getContextAttributes().getAttributeValueByNameAndType("code","urn:ibm:names:ITFIM:oauth:body:param");
    var access_token = stsuu.getContextAttributes().getAttributeValueByNameAndType("access_token","urn:ibm:names:ITFIM:oauth:response:attribute");
    if (access_token  != null && access_token != "") {
      if(code != null && code != "") {
        // associate the code to the state_id in  the ext cache (as it's
        // already been removed from the token cache
        var cache = IDMappingExtUtils.getIDMappingExtCache();

        // We use the code as the lookup key, and the state_id for us to use in
        // the delete. We use a lifetime of the access token just been issued
        var expires_in = parseInt(stsuu.getContextAttributes().getAttributeValueByNameAndType("expires_in","urn:ibm:names:ITFIM:oauth:response:attribute"));
        // expires in is in seconds, so is the cache life
        cache.put(code, state_id, expires_in);
      }
    }
  }
}


/**
 * Device flows have several things relevent to them in the post_token rule.
 *
 * You may wish to customise the lifetime of the device_code and user_code.
 * Use updateToken() to tweak this. There is an example earlier in the
 * mapping rule.
 *
 *
 * The following populates the mandatory verification_uri parameter. Update
 * this section to include the correct host value for the verification_uri.
 */

if(request_type == "device_authorize") {
  /*
   *
   * On the device_authorize request, the verification_uri and
   * verification_uri_complete needs to be populated here. 
   *
   * Verification URI should be the webseal host, port, junction information
   * and then the user_authorize suffix which is:
   *
   * /sps/oauth/oauth20/user_authorize
   *
   * This endpoint takes the single parameter user_code.
   *
   * A complete example:
   * https://example.webseal.com/isam/sps/oauth/oauth20/user_authorize?user_code=qNkU0uBcH2l
   */

  var suffix = "/sps/oauth/oauth20/user_authorize";

  // Change this value to your desired value
  var webseal_portion = "https://localhost/isam";

  // Use userCode in verification_uri_complete
  var user_code = stsuu.getContextAttributes().getAttributeValueByNameAndType("user_code","urn:ibm:names:ITFIM:oauth:response:attribute");

  var verification_uri = webseal_portion + suffix;
  var verification_uri_complete = verification_uri + "?user_code=" + user_code;

  stsuu.addContextAttribute(new Attribute("verification_uri", "urn:ibm:names:ITFIM:oauth:response:attribute", verification_uri));
  stsuu.addContextAttribute(new Attribute("verification_uri_complete", "urn:ibm:names:ITFIM:oauth:response:attribute", verification_uri_complete));

  /*
   * Polling interval of 5
   */
  stsuu.addContextAttribute(new Attribute("interval", "urn:ibm:names:ITFIM:oauth:response:attribute", "5"));


}
if(request_type == "authorization"){
	IDMappingExtUtils.traceString("Posttoken debug :: authorize endpoint");
	var accessTokenMail = stsuu.getContextAttributesAttributeContainer().getAttributeValueByName("credMail");
	IDMappingExtUtils.traceString("Posttoken debug :: accessTokenMail value : " + accessTokenMail);
	IDMappingExtUtils.traceString("Posttoken debug :: state_id value : " + state_id);
	
	if(accessTokenMail != null && accessTokenMail != "") {
		OAuthMappingExtUtils.associate(state_id,"credMail",accessTokenMail);
	}
}
