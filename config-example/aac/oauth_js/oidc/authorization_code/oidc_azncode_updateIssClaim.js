/*
  Name : oidc_azncode_updateIssClaim.js
  Author : jcyarbor@us.ibm.com
  
  Intended use : 
    This mapping rule contains example code on updating the 'iss' claim in the JWT for Authorization Code flows.
    It is sourced from the 10.0.4.0 OAUTHPreTokenGeneration mapping rule.
    
    This function should be invoked at the '/token' endpoint.
    Please update your code appropriately.
      
    ====
    Usage example starts on line 844
*/

importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.oauth20);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);
importPackage(Packages.com.ibm.security.access.user);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.OAuthMappingExtUtils);
importClass(Packages.com.ibm.security.access.httpclient.HttpClient);
importClass(Packages.com.ibm.security.access.httpclient.HttpResponse);
importClass(Packages.com.ibm.security.access.httpclient.Headers);
importClass(Packages.com.ibm.security.access.httpclient.Parameters);
importClass(Packages.java.util.ArrayList);
importClass(Packages.java.util.HashMap);
importMappingRule("Oauth_20_TokenExchange");

/**
 * This mapping rule uses a user registry for verification of the username 
 * and password for the ROPC scenario.
 * 
 * This is an example of how you could verify the username and password with an
 * user registry before the access token is generated, therefore preventing
 * the scenario where access tokens are created for invalid users and stored in
 * the cache with no way to remove them till they expire.
 *
 * A prerequisite for using this example is configuring the username and 
 * password authentication mechanism.
 * 
 * This example is the default method for verifying the username and password.
 * To disable this example, change the "ropc_registry_validation" variable 
 * to "false".
 */

var ropc_registry_validation = true;

/*
 * Force sourcing the ROPC password validation config from ldap.conf. This should be set
 * to true if its known that the Username/Password mechanism in AAC is not configured.
 */
var force_ldap_conf = false;

/**
 * This mapping rule shows an example of the ROPC scenario using an external
 * service for verification of the username and password.
 * 
 * This is an example of how you could verify the username and password with an
 * external service before the access token is generated, therefore preventing
 * the scenario where access tokens are created for invalid users and stored in
 * the cache with no way to remove them till they expire.
 * 
 * To enable this demo, change the "ropc_http_demo" variable to "true" and the
 * "verificationServer" variable to your own user verification service.
 */

var ropc_http_demo = false;
var verificationServer = "https://yourHostName/userVerifier.jsp";

/**
 * Limit the number of tokens per user per client.
 *
 * The code enforces a maximum for the number of grants allowed on a per 
 * user per client basis.
 *
 * To change the limit, set the variable "max_oauth_grants_per_user_per_client"
 * to an integer value. The default limit is 20.
 *
 * Two algorithms are implemented in this mapping rule:
 *     1) Strictly enforce the limit.
 *     2) When the limit is reached, remove the least recently used token(s)
 *        for the user per client.
 *
 * The algorithm strictly enforce the limit is the default.
 *
 * The algorithm being used is controlled by the variables "limit_method", set
 * it to "strict" or "lru".
 *
 * To disable limiting the number of tokens allowed, change the
 * "limit_oauth_grants_per_user_per_client" variable to "false".
 */

var limit_oauth_grants_per_user_per_client = true;

/**
 * Set the limit for the number of tokens allowed on a
 * per user per client and the algorithm to use.
 *
 * The default limit is 20 tokens and the default algorithm
 * is strictly enforce the limit.
 */
var max_oauth_grants_per_user_per_client = 20;

var limit_method = "strict"; // "lru" | "strict"

/**
 * Customize ID Token
 *
 * OIDC Claims may be produced on ID Token.
 * The claims are based on OIDC 'scope' and/or 'claims' request parameters.
 *
 * In the STSUU context, the claims are listed in terms of essential and voluntary claims,
 * so it can be processed differently.
 *
 * When Attribute Sources are configured in the definition, they will be resolved as well
 * and available in the STSUU.
 *
 * To enable customization of id token based on scope and claims requested, change the
 * "customize_id_token" variable to "true".
 */

var customize_id_token = true;

/**
 * Only allow confidential clients to introspect or revoke tokens?
 */
var only_allow_conf_client_introspect = true;
var only_allow_conf_client_revoke = true;

/**
 * Discover the request_type and the grant type
 */
var request_type = null;
var grant_type = null;
var definition_id = null;

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

// The definition_id
if (request_type == "client_register"){
   var definitionName = stsuu.getContextAttributes().getAttributeValueByNameAndType("definition_name","urn:ibm:names:ITFIM:oauth:request");
   definition_id = OAuthMappingExtUtils.getDefinition(definitionName).getDefinitionId();
}else if (oauth_client != null){
   definition_id = oauth_client.getDefinitionID();
}



/**
 * ROPC scenario using a user registry for verification of the username 
 * and password.
 */
if (ropc_registry_validation) {

	var username = null;
	var password = null;
	var temp_attr = null;

	// The username
	temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("username", "urn:ibm:names:ITFIM:oauth:body:param");
	if (temp_attr != null && temp_attr.length > 0) {
		username = temp_attr[0];
	}

	// The password
	temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("password", "urn:ibm:names:ITFIM:oauth:body:param");
	if (temp_attr != null && temp_attr.length > 0) {
		password = temp_attr[0];
	}

	if (request_type == "access_token" && grant_type == "password") {

		// Throw an exception if no username or password was defined
		if (username == null || password == null) {
		    // use throwSTSUserMessageException to return the exception message in request's response
			OAuthMappingExtUtils.throwSTSUserMessageException("No username/password.");
		}

		var isAuthenticated = false;
		try {
			var userLookupHelper = new UserLookupHelper();
			/* 
			 * First we try initialising the lookup helper with the Username Password
			 * mechanism. If that doesn't work, then we try sourcing it from the
			 * ldap.conf, if that doesn't work, we fail. 
			 *
			 * This can be overriden via the boolean 'force_ldap_conf' at the
			 * beginning of this file
			 *
			 */
			if(!force_ldap_conf) {
				userLookupHelper.init(true);
				if(!userLookupHelper.isReady()) {
					userLookupHelper = new UserLookupHelper();
					userLookupHelper.init(false);
				} 
			} else {
				userLookupHelper.init(false);
			}

			if(userLookupHelper.isReady()) {

				var user = userLookupHelper.getUser(username);
				if(user != null) {
					isAuthenticated = user.authenticate(password);
				}
			} else {
				OAuthMappingExtUtils.throwSTSUserMessageException("Invalid username/password mechanism configuration. Authentication failed.");
			}
		} catch (ex) {
			// Throw an exception in order to stop the flow.
			OAuthMappingExtUtils.throwSTSUserMessageException(ex.message);
		}

		if (isAuthenticated) {
			IDMappingExtUtils.traceString("Authentication successful.");
		} else {
			// Throw an exception when authentication failed in order to stop the flow.
			OAuthMappingExtUtils.throwSTSUserMessageException("Invalid username/password. Authentication failed.");
		}
	}
}

/**
 * ROPC scenario using an external service for verification of the 
 * username and password.
 */
if (ropc_http_demo) {

	var username = null;
	var password = null;
	var temp_attr = null;

	// The username
	temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("username", "urn:ibm:names:ITFIM:oauth:body:param");
	if (temp_attr != null && temp_attr.length > 0) {
		username = temp_attr[0];
	}

	// The password
	temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("password", "urn:ibm:names:ITFIM:oauth:body:param");
	if (temp_attr != null && temp_attr.length > 0) {
		password = temp_attr[0];
	}

	if (request_type == "access_token" && grant_type == "password") {

		// Throw an exception if no username or password was defined
		if (username == null || password == null) {
		    // use throwSTSUserMessageException to return the exception message in request's response
			OAuthMappingExtUtils.throwSTSUserMessageException("No username/password.");
		}

		var hr = new HttpResponse();
		var param = new Parameters();

		// Place username and password to be verified into parameters
		param.addParameter("username", username);
		param.addParameter("password", password);

		// SSL httpPost
		// This assumes default trust store (util.httpClient.defaultTrustStore in Advanced Configuration panel)
		hr = HttpClient.httpPost(verificationServer, param);

		/**
		 * Alternatively, you can specify your connection parameters.
		 * httpPost(String url, Map headers, Map parameters,String
		 * httpsTrustStore, String basicAuthUsername,String basicAuthPassword,
		 * String clientKeyStore,String clientKeyAlias);
		 */

		if (hr != null) {

			// Print out response code, body, headers
			IDMappingExtUtils.traceString("code: " + hr.getCode());
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

			if (hr.getCode() == 200) {
				IDMappingExtUtils.traceString("Authentication successful.");
			} else {
				// Throw an exception when authentication failed in order to stop the flow.
				// This assumes any code other than 200 means an invalid username/password.
				OAuthMappingExtUtils.throwSTSUserMessageException("Invalid username/password. Authentication failed.");
			}
		} else {
			// Throw an exception when authentication failed in order to stop the flow.
			// throwSTSException only return internal server error msg without returning the actual message. The actual message can be inspected from log file. 
			OAuthMappingExtUtils.throwSTSException("No response from server. Authentication failed.");
		}
	}
}

/**
 * Limit the number of grants per user per client.
 *
 * The following code enforces a maximum for the number of grants 
 * allowed on a per user per client basis.
 */
if (limit_oauth_grants_per_user_per_client) {
	var temp_attr = null;

	/*
	 * Determine if we need to execute the code path.
	 *
	 * If the request type is access_token, it only gets executed if the 
	 * grant type is client_credentials or password.
	 *
	 * It shall not be executed if the request type is access_token but 
	 * the grant type is refresh_token as no new authorization grant is 
	 * generated in this flow.
	 */
	if (request_type == "authorization" || (request_type == "access_token" && grant_type != "refresh_token")) {

		var client_id = null;
		var username = null;

		// The client ID
		temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("client_id", "urn:ibm:names:ITFIM:oauth:body:param");
		if (temp_attr != null && temp_attr.length > 0) {
			client_id = temp_attr[0];
		}
		// If client_id is still null, look somewhere else.
		if(client_id == null) {
			temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("client_id", "urn:ibm:names:ITFIM:oauth:query:param");
			if (temp_attr != null && temp_attr.length > 0) {
				client_id = temp_attr[0];
			}
		}	

		if(grant_type == "client_credentials") {
			username = client_id;
		} else {
		// The username
			temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("username", "urn:ibm:names:ITFIM:oauth:body:param");
			if (temp_attr != null && temp_attr.length > 0) {
				username = temp_attr[0];
			}
			// If username is still null, look somewhere else.
			if(username == null) {
				temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("username", "urn:ibm:names:ITFIM:oauth:request");
				if (temp_attr != null && temp_attr.length > 0) {
						username = temp_attr[0];
				}
			}
		} 

		/*
		 * now that we have all the required data perform the
		 * following:
		 * 
		 *  1. Get the tokens for the user / client id.
		 *
		 *  2. Organise the tokens into a map of stateId -> Tokens for
		 *  grant (as each grant might contain a refresh token.
		 *
		 *  3a. If strict limiting is enabled, this is enough information to
		 *   throw an exception if the limit is reached. 
		 *
		 *  3b. If LRU limiting is enabled perform the following:
		 * 
		 *   4. Process each grant into a list of stateId and dateCreated
		 *   (we use either tokens date created as the difference is minimal). 
		 *  
		 *   5. Sort the list based on dateCreated. 
		 * 
		 *   6. Delete the oldest grants. 
		 */

		var tokens = OAuthMappingExtUtils.getTokens(client_id, username);
		var state_ids_to_tokens_map = {};
		if (tokens != null) {
			for(var i = 0; i < tokens.length; i++) {
				if(state_ids_to_tokens_map[tokens[i].getStateId()] == null) {
					state_ids_to_tokens_map[tokens[i].getStateId()] = [tokens[i]];
				} else {
					state_ids_to_tokens_map[tokens[i].getStateId()].push(tokens[i]);
				}
			}
			
			var number_of_grants = Object.keys(state_ids_to_tokens_map).length;
			IDMappingExtUtils.traceString("Current number of grants for " + username + " and client ID " + client_id + ": " + number_of_grants);

			if (limit_method == "strict") {
				if (number_of_grants >= max_oauth_grants_per_user_per_client) {
					// Throw an exception in order to stop the flow.
					OAuthMappingExtUtils.throwSTSUserMessageException("Maximum number of grants reached for " + username + " and client ID " + client_id + ".");
				}
			} else if (limit_method = "lru") {

				// Determine the number of tokens to delete
				var number_of_grants_to_delete = number_of_grants - max_oauth_grants_per_user_per_client + 1 ;
				if (number_of_grants_to_delete > 0) {
					IDMappingExtUtils.traceString("Number of grants to delete: " + number_of_grants_to_delete);

					var grant_date_created_array = [];
					for (var state_id in state_ids_to_tokens_map) {
						/*
						 * We work off the first token,
						 * as stateId will be the same
						 * for both, and dateCreated
						 * will be very similar.
						 */
						var token_properties = {};
						token_properties["stateId"] = state_id;
						token_properties["dateCreated"] = state_ids_to_tokens_map[state_id][0].getDateCreated();
						grant_date_created_array.push(token_properties);
					}

					// Sort the tokens
					grant_date_created_array.sort(function(token1,token2) {
						return token1.dateCreated- token2.dateCreated;
					});

					// Delete the first n tokens in the sorted token array
					while (0 != number_of_grants_to_delete--) {
						IDMappingExtUtils.traceString("Removing tokens for " + username + " and client ID " + client_id + " created on " + new Date(grant_date_created_array[number_of_grants_to_delete]["dateCreated"]) );

						// delete the grant via the stateId
						OAuthMappingExtUtils.deleteGrant(grant_date_created_array[number_of_grants_to_delete]["stateId"]);
					}
				} else {
					IDMappingExtUtils.traceString("Number of grants in cache is less than the maximum allowed per user per client. No tokens will be removed.");
				}
			} else {
				IDMappingExtUtils.traceString("No algorithm for limiting the number of grants is enabled.");
			}
		}
	}
}

var enable_custom_tokens = false;

if (enable_custom_tokens) {
	var enable_custom_authorization_codes = true;
	var enable_custom_access_tokens = true;
	var enable_custom_refresh_tokens = true;
	var enable_custom_device_codes = true;

	/* To customize the value of a token, add one of the following
	 * attributes with the custom type to the stsuu.
	 *
	 * The attribute type for custom tokens must be: "urn:ibm:ITFIM:oauth20:custom:token"
	 *
	 * The attribute name for a custom Authorization Code is: "urn:ibm:ITFIM:oauth20:custom:token:authorization_code"
	 *
	 * For Access Token: "urn:ibm:ITFIM:oauth20:custom:token:access_token"
	 * For Refresh Token: "urn:ibm:ITFIM:oauth20:custom:token:refresh_token"
	 *
	 * These tokens must be unique due to storage constraints, so its suggested they contain a nonce.
	 */

	var populate_access_token = false;
	var populate_authorization_code  = false;
	var populate_refresh_token = false
	var populate_device_code = false

	/*
	 * First, check what kind of tokens might be created on this request
	 */
	var temp_attr = null;
	var request_type = null;
	temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("request_type", "urn:ibm:names:ITFIM:oauth:request");
	if (temp_attr != null && temp_attr.length > 0) {
		request_type = temp_attr[0];
	}

	if (request_type == "authorization") {
		temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("response_type", "urn:ibm:names:ITFIM:oauth:query:param");
		if (temp_attr != null && temp_attr.length > 0) {
			response_type = temp_attr[0];
		} else {
			temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("response_type", "urn:ibm:names:ITFIM:oauth:body:param");
			if (temp_attr != null && temp_attr.length > 0) {
				response_type = temp_attr[0];
			}
		}
		if ("code" == response_type) {
			populate_authorization_code = true;
		} else if ("token" == response_type) {
			populate_access_token = true;
		}
		
	} else if (request_type == "access_token") {
			populate_access_token = true;
			populate_refresh_token = true;
	} else if (request_type == "device_authorize") {
		populate_device_code = true;
	}

	/*
	 * Build a nonce
	 */
	var nonce = OAuthMappingExtUtils.generateRandomString(10);

	/*
	 * Set an authorization code, if one would be created and custom
	 * authorization codes are enabled 
	 */
	if (populate_authorization_code && enable_custom_authorization_codes) {
		stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("urn:ibm:ITFIM:oauth20:custom:token:authorization_code","urn:ibm:ITFIM:oauth20:custom:token","MYCUSTOM_AUTHORIZATION_CODE_" + nonce));
	}
	/*
	 * Set an access token, if one would be created and custom
	 * access tokens are enabled 
	 */
	if (populate_access_token && enable_custom_access_tokens) {

		stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("urn:ibm:ITFIM:oauth20:custom:token:access_token","urn:ibm:ITFIM:oauth20:custom:token","MYCUSTOM_ACCESS_TOKEN_" + nonce));

		var persist_access_token = true;
		if (!persist_access_token) {
			/* Setting the attribute "urn:ibm:ITFIM:oauth20:custom:token:access_token"
			 * with type "urn:ibm:ITFIM:oauth20:custom:token:persistent" to 
			 * false will indicate to the OAuth engine that the access token 
			 * should not be persisted to the database. 
			 *
			 * This attribute will only work for the access_token. This is
			 * for situations when the resource server is capable of local
			 * validation and storage is not necessary. 
			 * 
			 * Not persisting the access_token is only available when using
			 * a custom token.
			 */
			stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("urn:ibm:ITFIM:oauth20:custom:token:access_token","urn:ibm:ITFIM:oauth20:custom:token:persistent","false"));
		}
	}
	/*
	 * Set a refresh token, if one would be created and custom
	 * refresh tokens are enabled 
	 */
	if (populate_refresh_token && enable_custom_refresh_tokens) {
		stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("urn:ibm:ITFIM:oauth20:custom:token:refresh_token","urn:ibm:ITFIM:oauth20:custom:token","MYCUSTOM_REFRESH_TOKEN_" + nonce));
	}

	/*
	 * Device flows
	 */
	if (populate_device_code && enable_custom_device_codes) {
		stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("urn:ibm:ITFIM:oauth20:custom:token:device_code","urn:ibm:ITFIM:oauth20:custom:token","MYCUSTOM_DEVICE_CODE" + nonce));
	}
}

/*
 * We split out the logic for a custom user code, as the format of this custom
 * token is far more important, as the use will have to input this on their
 * device!
 */
var custom_format_user_code = true;

if (custom_format_user_code && request_type == "device_authorize") {
	var part1 = OAuthMappingExtUtils.generateRandomString(4).toLowerCase();
	var part2 = OAuthMappingExtUtils.generateRandomString(4).toLowerCase();
	var token = part1 + "-" + part2;
	stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("urn:ibm:ITFIM:oauth20:custom:token:user_code","urn:ibm:ITFIM:oauth20:custom:token",token));
}

var enableAssertionGrants = false;
if (enableAssertionGrants) {

	// The grant type
	var assertion = null
	var temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("assertion", "urn:ibm:names:ITFIM:oauth:body:param");
	if (temp_attr != null && temp_attr.length > 0) {
		assertion = temp_attr[0];
	}

	if (grant_type != null && (grant_type == "urn:ietf:params:oauth:grant-type:jwt-bearer"  || grant_type == "urn:ietf:params:oauth:grant-type:saml2-bearer")) {

		// Implement Assertion validation here. For example, invoke the
		// STS using the STSClientHelper. See the Javadoc for more information.
		var assertionValid = false;

		if (!assertionValid) {
			OAuthMappingExtUtils.throwSTSUserMessageException("Invalid Assertion. Authentication failed.");
		}

		// Someone may have provided a username in this request as a post parameter, remove it!
		stsuu.getContextAttributes().removeAttributes("username", null);

		// Use the subject of the assertion as the username
		var subject = null;

		if (assertionValid) {
			// set the username	
			stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("username", "urn:ibm:names:ITFIM:oauth:rule:decision", subject));
		}
	}
}

var enableTokenLookupExample = false;

if (enableTokenLookupExample) {
	/*
	 * There are some instances when accessing the associated attributes of
	 * a token is necessary in the pre-token rule. This requires the
	 * stateId, which is not usually available yet, as token validation has
	 * not yet occurred. The following example will lookup the token, check
	 * that its hasn't yet expired and retrieve the stateId. 
	 *
	 * See the javadoc for all fields of a token which are exposed in the
	 * Token class(com.tivoli.am.fim.trustserver.sts.oauth20.Token).
	 *
	 * This example will attempt to retrieve the associated attributes of
	 * an authorization code, when its being exchanged for an access_token
	 */
	// The request type - if none available assume 'resource'
	var request_type = null;
	var grant_type = null;
	var code = null;

	/*
	 * check its a request to /token
	 */
	if (request_type == "access_token") {
		/*
		 * check its an authorization code grant
		 */
		if (grant_type == "authorization_code") {
			/*
			 * extract the authorization code
			 */
			var temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("code", "urn:ibm:names:ITFIM:oauth:body:param");
			if (temp_attr != null && temp_attr.length > 0) {
				code = temp_attr[0];
			}
			if (code != null) {
				/*
				 * lookup the token
				 */
				var token = OAuthMappingExtUtils.getToken(code);

				if(token != null && !token.isExpired()) {
					var state_id = token.getStateId();
					var attrKeyArray = OAuthMappingExtUtils.getAssociationKeys(state_id);
					if (attrKeyArray != null) {
						/*
						 * perform some actions with
						 * the associated attributes
						 */
						for (var i = 0; i < attrKeyArray.length; i++) {
							IDMappingExtUtils.traceString("Found associated attribute with key [" + attrKeyArray[i] + "].");
						}
					} else {
							IDMappingExtUtils.traceString("Found no associations with stateId [" + state_id + "].");
					}
				} else { 
					/*
					 * if the token is null or expired, do nothing,
					 * the flow will fail later
					 */
					IDMappingExtUtils.traceString("Token [" + attrKeyArray[i] + "] was null or expired.");
				}

			}
		}
	}

}

if((only_allow_conf_client_introspect && request_type == "introspect") || 
		(request_type == "revoke" && only_allow_conf_client_revoke)) {

	if(oauth_client != null) {
		var client_id = oauth_client.getClientId();
		if(!oauth_client.isConfidential()) {
			// 401
			OAuthMappingExtUtils.throwSTSAccessDeniedMessageException("Client Forbidden");

			// Alternatively you could clear the STSUU, and just
			// set active to = false. This wont raise an exception,
			// but take note, the post token rule will still be
			// invoked

			if(request_type == "introspect") {
				stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("active", "urn:ibm:names:ITFIM:oauth:response:attribute", false));
			}
		}
	} else {
		IDMappingExtUtils.traceString("Client [" + oauth_client + "] was not found.");
		OAuthMappingExtUtils.throwSTSAccessDeniedMessageException("Client not found");
	}
}

function produceClaim(claimName, expectedValues, isEssential, stateId, toSave) {

	var value = null;
    
    /** 
    * Filter out any claims that are not wanted in the id token. To enable filtering of claims, set restrictAttributes = true.
    * In this example, attributes from the credential are filtered out. This is an example only, and if restrictAttibutes is enabled,
    * the claims which are filtered out in the conditional check may need to be modified. 
    **/
    var restrictAttributes = false;
    if(restrictAttributes && (claimName.startsWith("AZN_") || claimName.startsWith("tokenvalue")))
    {
        IDMappingExtUtils.traceString("produceClaim " + claimName + " is a restricted attribute and cannot be accessed in this manner.");
    } else {
    
    	// If expectedValues exist, use it
    	if (expectedValues != null && expectedValues.length > 0) {
    		value = expectedValues;
    	}
    
    	if (claimName == "acr") {
    		value = stsuu.getAttributeContainer()
    				.getAttributeValuesByNameAndType("acr_fulfilled", "urn:ibm:names:ITFIM:5.1:accessmanager");
    	}
    
    	// Attempt to get the value of the claim from AttributeSource resolution.
    	if (value == null) {
    		value = stsuu.getAttributeContainer()
    				.getAttributeValuesByNameAndType(claimName, "urn:ibm:names:ITFIM:5.1:accessmanager");
    	}
    	if (value != null) {
    		var tmp_value = value;
    		if(value.length != null) {
    			tmp_value = [];
    			for (var i = 0 ; i < value.length; i++) {
    				tmp_value.push(""+value[i]);
    			}
    		} else {
    			tmp_value = ""+value;
    		}
    		toSave.push({"key" : ""+claimName, "value" : JSON.stringify(tmp_value)});
    	}
    	
    
    	// Check the extra attrs now
    	if((value == null || value.length == 0) && stateId != null) {
    		value = OAuthMappingExtUtils.getAssociation(stateId, "urn:ibm:names:ITFIM::oauth:saved:claim:" + claimName);
    		// It may have been stored as an array
    		var tmp_value = JSON.parse(value);
    		if(tmp_value != null	&& tmp_value.length != null) {
    			var tmp_array = java.lang.reflect.Array.newInstance(java.lang.String, tmp_value.length);
    			for(var i = 0; i < tmp_value.length; i++) {
    				tmp_array[i] = tmp_value[i];
    			}
    			value = tmp_array;
    		}
    	}
    }

	// Essential claim - set the value to 'n/a' or boolean 'false' if not exist
	if (value == null && isEssential) {
		value = claimName.endsWith("_verified") ? "false" : "n/a";
	}

	// Output it for ID Token if exist
	if (value != null) {
		var attr = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute(claimName, "urn:ibm:jwt:claim", value);
		stsuu.addAttribute(attr);
	}

}
 
if (customize_id_token) {

	var populate_id_token = false;
	var save_cred_attrs = false;
	var temp_attr = null;
	var is_oidc_scope = false;

	temp_attr = stsuu.getContextAttributes().getAttributeByName("scope");

	if (temp_attr != null) {
		for( var scope in temp_attr.getValues()) {
			if (temp_attr.getValues()[scope] == "openid") {
				is_oidc_scope = true;
				break;
			}
		}
	}

	var state_id = null;

	var to_save = [];

	if (request_type == "authorization") {

		var response_type = null;
		temp_attr = null;
		temp_attr = stsuu.getContextAttributes()
				.getAttributeValuesByNameAndType("response_type", "urn:ibm:names:ITFIM:oauth:body:param");
		if(temp_attr == null){
			temp_attr = stsuu.getContextAttributes()
				.getAttributeValuesByNameAndType("response_type", "urn:ibm:names:ITFIM:oauth:query:param");
		}
		if (temp_attr != null && temp_attr.length > 0) {
			response_type = temp_attr[0];
		} else {
			temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("response_type", "urn:ibm:names:ITFIM:oauth:body:param");
			if (temp_attr != null && temp_attr.length > 0) {
				response_type = temp_attr[0];
			}
		}

		if (response_type != null && response_type.indexOf("id_token") > -1) {
			populate_id_token = true;
		}
		if ((response_type != null && response_type.indexOf("code") > -1 && is_oidc_scope)) {
			save_cred_attrs = true;
		}

	} else if (request_type == "access_token") {
		populate_id_token = true;
		var code = null;
	   if (grant_type == "authorization_code") {
	      code = stsuu.getContextAttributes().getAttributeValueByNameAndType("code","urn:ibm:names:ITFIM:oauth:body:param");
	   } 
	   else if (grant_type == "refresh_token") {
	      code = stsuu.getContextAttributes().getAttributeValueByNameAndType("refresh_token","urn:ibm:names:ITFIM:oauth:body:param");
	   }
		if (code != null) {
			var token = OAuthMappingExtUtils.getToken(code);
			if (token != null) {
				state_id = token.getStateId();
			}
		}
	}

	if (populate_id_token || save_cred_attrs) {
		
		//===============================================
		// Example of how to update the 'iss' claim
		
		// 1. Get the existing value
		var issValue = ""+ stsuu.getAttributeValueByName("iss");
		
		// 2. Remove the existing attribute from the attribute list:
		stsuu.removeAttribute("iss","urn:ibm:jwt:claim");
		
		// 3. Update the issuer value somehow
		var newIssValue = ""+ issValue + "/" + Math.floor(Math.random(1000));
		
		// 4. Create new attribute for value
		var newIss = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("iss","urn:ibm:jwt:claim", newIssValue);
		
		// 5. Add value back to STSUU
		stsuu.addAttribute(newIss);
		
		//===============================================
		
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
				produceClaim(attrs[i].getName(), attrs[i].getValues(), true, state_id, to_save);
			}
		}

		// Retrieve list of all the 'voluntary' claims
		attrs = stsuu.getContextAttributes().getAttributesByType("urn:ibm:names:ITFIM:oidc:claim:voluntary");
		if (attrs != null && attrs.length > 0) {
			for (i = 0; i < attrs.length; i++) {
				produceClaim(attrs[i].getName(), attrs[i].getValues(), false, state_id, to_save);
			}
		}

	}

	if(save_cred_attrs) {
		stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("attributesToSave", "urn:ibm:names:ITFIM::oauth:save",""+JSON.stringify(to_save)));
	}
}



/*
 * The OAuth specification dictates that the Authorization server SHOULD revoke
 * access tokens which are issued to a code, if that code is re-presented to
 * the authorization server. This is available at: 
 *   https://tools.ietf.org/html/rfc6749#section-4.1.2
 *
 * In order to enable this enforcement the following snippet AND a snippet in
 * the post token mapping rule must be enabled.
 *
 * This portion below handles revoking the grant if the authorization code has
 * been presented before.
 *
 */
var assert_no_code_reuse = false;
if(assert_no_code_reuse) {
  // The OAuth engine will handle rejecting the authorization code if its not
  // present in the token cache (Eg if its expired, or already been used)
  //
  // This just revokes the tokens which may have been issued to that code.
  if (request_type == "access_token" && grant_type == "authorization_code") {
    // Get an access_token to see if this is a success response
    var code = stsuu.getContextAttributes().getAttributeValueByNameAndType("code","urn:ibm:names:ITFIM:oauth:body:param");
    // Check if that code has been presented before. 
    var cache = IDMappingExtUtils.getIDMappingExtCache();
    var id_to_revoke = cache.get(code);
    IDMappingExtUtils.traceString("\n\trevoking grant that was issued by code:" + code +
        "\n\t" + "attempting to revoke state_id: " + id_to_revoke +
        "\n\t was a grant revoked? " + OAuthMappingExtUtils.deleteGrant(id_to_revoke));
  }
}

/*
 * When generating dynamic clients, a custom client_id and secret can be set.
 *
 * If a custom client_secret is set, a secret will be issued, regardless of the
 * definition configuration.
 *
 * To set a custom id or secret, set the boolean to true.
 */

var custom_client_id_secret = false;
if (custom_client_id_secret) {
  var method = stsuu.getContextAttributes().getAttributeValueByNameAndType("method", "urn:ibm:names:ITFIM:oauth:method");
  if(request_type =='client_register' && method == "POST" ){
    /*
     * these values could be populated from an incomming request parameter, or
     * alternative source (http callout, credential attribute).
     */
    var custom_id = "CUSTOM_ID_"+ OAuthMappingExtUtils.generateRandomString(10);
    var custom_secret = "CUSTOM_SECRET_"+ OAuthMappingExtUtils.generateRandomString(10);
    IDMappingExtUtils.traceString("Setting custom id: " + custom_id);
    /*
     * This sets the custom client id. Take note of the attribute type.
     */
    stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("client_id","urn:ibm:ITFIM:oauth20:custom:token",custom_id));
    stsuu.addContextAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("client_secret","urn:ibm:ITFIM:oauth20:custom:token",custom_secret));
   
  }
}



/**
 * 
 * Set "addx5t" value to "true" to generate and add x5t value to JWT header
 * 
 * Note: jwt header can only be set in pre_token mapping rule
 *
 *
**/


var addx5t = false

if (addx5t){
    var signing_db = stsuu.getContextAttributes().getAttributeValueByName("signing.db")
    var signing_cert = stsuu.getContextAttributes().getAttributeValueByName("signing.cert")
    if (signing_db != null && signing_cert != null ){
        var x5t = OAuthMappingExtUtils.getCertificateThumbprint(signing_db ,signing_cert)
        var attr1 = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("x5t", "urn:ibm:JWT:header:claim", x5t);
        stsuu.addContextAttribute(attr1);
    }
   
}

/**
 * 
 * Set "addx5t#S256" value to "true" to generate and add x5t#S256 value to JWT header
 * 
 * Note: jwt header can only be set in pre_token mapping rule
 *
 * 
**/

var addx5tS256 = false

if (addx5tS256){
    var signing_db = stsuu.getContextAttributes().getAttributeValueByName("signing.db")
    var signing_cert = stsuu.getContextAttributes().getAttributeValueByName("signing.cert")
    if (signing_db != null && signing_cert != null ){
        var x5tS256 = OAuthMappingExtUtils.getCertificateThumbprint_S256(signing_db ,signing_cert)
        var attr2 = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("x5t#S256", "urn:ibm:JWT:header:claim", x5tS256 );
        stsuu.addContextAttribute(attr2);
    }
}

/**
 * 
 * Set "addx5c" value to "true" to generate and add x5c value to JWT header
 * 
 * Note: jwt header can only be set in pre_token mapping rule
 *
 *  
**/

var addx5c = false

if (addx5c){
    var signing_db = stsuu.getContextAttributes().getAttributeValueByName("signing.db")
    var signing_cert = stsuu.getContextAttributes().getAttributeValueByName("signing.cert")
    if (signing_db != null && signing_cert != null ){
        var x5c = OAuthMappingExtUtils.getCertificateChain(signing_db ,signing_cert)
        var attr3 = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("x5c", "urn:ibm:JWT:header:claim", x5c );
        stsuu.addContextAttribute(attr3);
    }
}


/**
 * OIDC Compliant
 *
 * If OIDC Compliance flag is set, the snippet of codes bellow will be 
 * triggered to make the Definition strictly OIDC Compliant.
 * 
 * Note that OIDC Compliant code will be triggered if FAPI Compliant flag is set.
 * 
 * The code performs the following functions in pre token mapping rule:
 * - Mapping Rule - authenticationTime (Pre_token)
 * - Mapping Rule - produce_userinfo_jwt (Post_token)
 * - Mapping Rule - redirect_uri (Pre_token)
 * - Mapping Rule - assert_no_code_reuse (Pre_token & Post_token)
 * - Mapping Rule - nonce (pre_token & post_token)
 * 
 */

if (definition_id != null && OAuthMappingExtUtils.isOidcCompliantByDefinitionID(definition_id)){ //Start of OIDC Conformance Snippets
	/**
	 * OIDC Conformance-Example 1.1.2
	 * For the max_age scenario, an auth_time claim needs to be added to the id_token.
	 * The following snippet of code, checks if max_age was requested and is associated with the state_id, and if it was, 
	 * then a claim called auth_time added to the id_token.
	**/
	var max_age = null;
	max_age = stsuu.getContextAttributes().getAttributeValueByName("max_age");
	if (max_age != null){
		var d = new Date();
		var n = d.getTime();
		n = Math.round(n/1000);
		var auth_time = String(n);
		var attr = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("auth_time", "urn:ibm:jwt:claim", auth_time);
	    	stsuu.addAttribute(attr);
	}

	/**
	 * OIDC Conformance-Example 1.3
	 * This piece of code is used to throw an error if redirect_uri is not an exact match to the registered redirect_uri.
	 * If there are query parameters added to the registered redirect_uri, the below code will throw an STS Exception.
	 * By default ISVA does not restrict additional query parameters added to a registered redirect_uri.
	**/

	var temp_attr = null;
	var found = false;


	var response_type = null;


	temp_attr = stsuu.getContextAttributes()
			.getAttributeValuesByNameAndType("response_type", "urn:ibm:names:ITFIM:oauth:query:param");
	if (temp_attr != null && temp_attr.length > 0) {
		response_type = temp_attr[0];
	}
	if(response_type == null) {
		temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("response_type", "urn:ibm:names:ITFIM:oauth:body:param");
		if (temp_attr != null && temp_attr.length > 0) {
			response_type = temp_attr[0];
		}
	}	
	if( response_type != null){
		if( response_type.contains("code") || response_type.contains("token") || response_type.contains("id_token")){
			var requested_redirect_uri = stsuu.getContextAttributes().getAttributeValuesByNameAndType("redirect_uri", "urn:ibm:names:ITFIM:oauth:query:param");
			if(oauth_client != null && requested_redirect_uri != null) {
				var uris = oauth_client.getRedirectUris();
				if(uris != null){
					for (uri in uris){
						if(requested_redirect_uri[0] == uris[uri]){
							found = true;
						}
					}
					if(!found){
						OAuthMappingExtUtils.throwSTSCustomUserPageException("Requested redirect_uri does not match the registered redirect_uri ",200,"invalid_request");
					}	
				} 
			}
		}
        }
	
	/**
	 * OIDC Conformance-Example 1.4
	 * During authroization_code flow a nonce is not required, this snippet of checks if it is requested for and
	 * associated with the state_id . If it is an id_token claim is added.
	**/
	var nonce = null;
	var code  = null;
	var token = null;
	var state_id = null;

	var temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("code", "urn:ibm:names:ITFIM:oauth:body:param");
	if (temp_attr != null && temp_attr.length > 0) {
		code = temp_attr[0];
	}
	if (code != null) {
		token = OAuthMappingExtUtils.getToken(code);
	}
	if (token != null) {
		state_id = token.getStateId();
	}
	if (state_id != null){
		nonce = OAuthMappingExtUtils.getAssociation(state_id, "nonce");
		if(nonce != null){
			var attr = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("nonce", "urn:ibm:jwt:claim", nonce);
			stsuu.addAttribute(attr);
		}
	}

	/**
	 * OIDC Conformance-Example 1.5.1
	 * 
	 * The OAuth specification dictates that the Authorization server SHOULD revoke
	 * access tokens which are issued to a code, if that code is re-presented to
	 * the authorization server. This is available at: 
	 *   https://tools.ietf.org/html/rfc6749#section-4.1.2
	 *
	 * In order to enable this enforcement the following snippet AND a snippet in
	 * the post token mapping rule must be enabled.
	 *
	 * This portion below handles revoking the grant if the authorization code has
	 * been presented before.
	 *
	**/
	var assert_no_code_reuse = true;
	if(assert_no_code_reuse) {
	  // The OAuth engine will handle rejecting the authorization code if its not
	  // present in the token cache (Eg if its expired, or already been used)
	  //
	  // This just revokes the tokens which may have been issued to that code.
	  if (request_type == "access_token" && grant_type == "authorization_code") {
	    // Get an access_token to see if this is a success response
	    var code = stsuu.getContextAttributes().getAttributeValueByNameAndType("code","urn:ibm:names:ITFIM:oauth:body:param");
	    // Check if that code has been presented before. 
	    var cache = IDMappingExtUtils.getIDMappingExtCache();
	    var id_to_revoke = cache.get(code);
	    IDMappingExtUtils.traceString("\n\trevoking grant that was issued by code:" + code +
		"\n\t" + "attempting to revoke state_id: " + id_to_revoke +
		"\n\t was a grant revoked? " + OAuthMappingExtUtils.deleteGrant(id_to_revoke));
	 }

	

  }

}//End of OIDC Conformance Snippets

/**
 * FAPI Compliant
 *
 * If OIDC Compliance flag is set, the following snippet of codes will be 
 * triggered to make the Definition strictly OIDC Compliant
 * 
 * Note that OIDC Compliant code will be triggered if FAPI Compliant flag is set.
 * 
 * The code performs the following functions:
 * - Response type code (pre_token)
 * - Disallow response if state in Req Param (pre_token)
 * - s_hash (pre_token & post_token)
 * - Cert Bound Token (pre_token & post_token)
 * 
 */

if (definition_id != null && OAuthMappingExtUtils.isFapiCompliantByDefinitionID(definition_id)){ //Start of FAPI Conformance Snippets
	/**
	 * FAPI Conformance
	 * 
	 * FAPI specification requires request_type code flow to be disallowed. The 
	 * following portion of code does this by throwing an error when request_type
	 * code is found in request param.
	 *
	 * This portion below handles revoking the grant if the authorization code has
	 * been presented before.
	 *
	**/
	var response_type= null;
	if (request_type="authorization"){
		temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("response_type", "urn:ibm:names:ITFIM:oauth:query:param");
		if (temp_attr != null && temp_attr.length > 0) {
			response_type = temp_attr[0];
		} else {
		temp_attr = stsuu.getContextAttributes().getAttributeValuesByNameAndType("response_type", "urn:ibm:names:ITFIM:oauth:body:param");
		if (temp_attr != null && temp_attr.length > 0) {
			response_type = temp_attr[0];
			IDMappingExtUtils.traceString("response_type :::"+response_type );
		}
		}
		if ("code" == response_type) {
			OAuthMappingExtUtils.throwSTSCustomUserPageException("Unsupported response type code.",400,"invalid_request");
		}
	}

	/**
	 * FAPI Conformance
	 * 
	 * FAPI specification requires state passed in request parameter to be ignored.
	 * This code enables this by removing state if it's found in request param
	 *
	 * This portion below handles revoking the grant if the authorization code has
	 * been presented before.
	 *
	**/
	var reqParam_state =  stsuu.getContextAttributes().getAttributeValueByNameAndType("state","urn:ibm:names:ITFIM:oauth:query:param"); 
	if (reqParam_state != null){         
		var x = stsuu.getContextAttributes().removeAttributeByNameAndType("state","urn:ibm:names:ITFIM:oauth:query:param");      
	}  

	/**
	 * FAPI Conformance
	 * 
	 * FAPI Specification requires s_hash to be added to id_token claims. 
	 * The goal of this claim is to ensure the id_token returned in the 
	 * authorization code flow matches the request to /authorize triggered 
	 * by the TPP(Relying party).
	 *
	 * This portion below handles revoking the grant if the authorization code has
	 * been presented before.
	 *
	**/
	importClass(Packages.java.util.Base64);

	var request_type = null;
	var grant_type = null;
	var response_type = null;

	// The request type - if none available assume 'resource'
	var tmp = stsuu.getContextAttributes().getAttributeValuesByNameAndType("request_type", "urn:ibm:names:ITFIM:oauth:request");
	if (tmp != null && tmp.length > 0) {
		request_type = tmp[0];
	} else {
		request_type = "resource";
	}

	// The grant type
	tmp = stsuu.getContextAttributes().getAttributeValuesByNameAndType("grant_type", "urn:ibm:names:ITFIM:oauth:body:param");
	if (tmp != null && tmp.length > 0) {
		grant_type = tmp[0];
	}

	// The response type 
	tmp = stsuu.getContextAttributes().getAttributeValuesByName("response_type");
	if (tmp != null && tmp.length > 0) {
		response_type = tmp[0];
	}

	var state = null;

	if (request_type == "authorization" && response_type != null && response_type.indexOf("id_token") > -1) {

		// When id_token to be produced at /authorize
		state = stsuu.getContextAttributes().getAttributeValueByName("state");

	} else if (request_type == "access_token" && grant_type == "authorization_code") {

		// When id_token to be produced at /token
		var code = stsuu.getContextAttributes().getAttributeValueByNameAndType("code", "urn:ibm:names:ITFIM:oauth:body:param");
		var token = OAuthMappingExtUtils.getToken(code);
		if (token != null) {
			state = OAuthMappingExtUtils.getAssociation(token.getStateId(), "state");
		}

	}

	if (state != null) {

	// Need to hash based on algorithm
	// The hash algorithm to use is dictated by the signing algorithm of JWT
	var alg = stsuu.getContextAttributes().getAttributeValueByNameAndType("signing.alg", "urn:ibm:oidc10:jwt:create");

	// For now only SHA-256 and SHA-512 are supported natively by ISVA.
	// Consider using KJUR or similar if SHA384 is needed.
	var hash = null;

	if (alg != null) {
		if (alg.endsWith("256")) {
			hash = OAuthMappingExtUtils.SHA256Sum(state);
		} else if (alg.endsWith("384")) {
			hash = null; // Not supported!
		} else if (alg.endsWith("512")) {
			hash = OAuthMappingExtUtils.SHA512Sum(state);
		}
	}

	if (hash != null && hash.length > 0) {
		var state_hash = Base64.getUrlEncoder().withoutPadding().encodeToString(hash.splice(0, hash.length/2));
		var attr = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("s_hash", "urn:ibm:jwt:claim", state_hash);
		stsuu.addAttribute(attr);
	}

	}

	
	/*
	 * FAPI - Private_key_jwt
	 * 
	 * Ensure this snippet is added within the isFapiCompliantByDefinitionID check
	 * Client Assertion is a form of client authentication. In the case of FAPI, FAPI_CertEAI authenticates a client if mtls client certificate is present. 
	 * Therefore, client_assertion is not handled. This code snippet triggeres client_assertion manually and ensures client id of client_assertion jwt and client object that was 
	 * created based of mtls authentication matches.
	 *
	 * client_assertion_required flag enforces client_assertion when fapi flag is set to true.
	 *
	**/
	var client_assertion_required = false;
	var client_assertion = stsuu.getContextAttributes().getAttributeValueByName("client_assertion");

   	if (client_assertion_required && request_type == "access_token" && client_assertion != null){

		var base_token = IDMappingExtUtils.stringToXMLElement(
		  "<wss:BinarySecurityToken "
		+ "xmlns:wss=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\" " 
		+ "wss:EncodingType=\"http://ibm.com/2004/01/itfim/base64encode\" "
		+ "wss:ValueType=\"urn:com:ibm:JWT\">"+client_assertion+"<\/wss:BinarySecurityToken>");


		var res = LocalSTSClient.doRequest("http://schemas.xmlsoap.org/ws/2005/02/trust/Validate","https://localhost/sps/oauth/oauth20", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer:", base_token, null)

        	if (res.errorMessage == null){
			var client_assertion_stsuu = new STSUniversalUser();
			client_assertion_stsuu.fromXML(res.token);
			
			var claims_str = client_assertion_stsuu.getContextAttributes().getAttributeValueByNameAndType("claim_json", "urn:com:ibm:JWT");
			var claims = JSON.parse(claims_str);

	   
			/*
			* Check that the JWT has not expired 
			*/

			if ( claims.exp != undefined ){
			  var expDate = new Date(claims.exp * 1000); 
			  var currDate = new Date();
			  if (expDate < currDate){
				   OAuthMappingExtUtils.throwSTSCustomUserPageException("client_assertion jwt has expired.",400,"invalid_request");
			  }
			}
			
			/*
			 * Validates aud and issuer value in client_assertion jwt against information in definition.
			 */
			if ( claims.iss != undefined && claims.aud != undefined){
				var def_id = OAuthMappingExtUtils.getClient(claims.iss).getDefinitionID();
				var iss = OAuthMappingExtUtils.getDefinitionByID(def_id).getOidc().getIss();
				var poc = OAuthMappingExtUtils.getDefinitionByID(def_id).getOidc().getPoc();

				if (Array.isArray(claims.aud)){
				   var found = false;

				   for (var x = 0; x < claims.aud.length; x++ ){
					   if((claims.aud[x]).includes(iss) || (claims.aud[x]).includes(poc)){
							found = true;
							break;
					   }
				   }
				   if (!found){
					  OAuthMappingExtUtils.throwSTSCustomUserPageException("aud in request object does not match issuer of client.",400,"invalid_request");
				   }
				}
				else if( !((claims.aud).includes(iss) || (claims.aud).includes(poc))){
					OAuthMappingExtUtils.throwSTSCustomUserPageException("aud in client_assertion jwt does not match issuer of client.",400,"invalid_request");
				}
			}
	   
			/*Handle if client assertion is triggered but fingerprint isn't present*/
			var fingerprint = stsuu.getAttributeValueByName("fingerprint");
			if (fingerprint == null){
		           OAuthMappingExtUtils.throwSTSCustomUserPageException("mtls credentials of client is missing.",400,"invalid_request");
			}


		}else{
			OAuthMappingExtUtils.throwSTSCustomUserPageException("client_assertion failed.",400,"invalid_request");
		}

	}else if(client_assertion_required && request_type == "access_token" ){
		OAuthMappingExtUtils.throwSTSCustomUserPageException("client_assertion is not found in token endpoint.",400,"invalid_request");   
	}

	
	
	/* 
	 * FAPI Compliance - acr 
	 * 
	 * This snippet populates the id_token and credential attribute with any presented value for the acr claim. 
	 * acr claim values are typically associated with specific authentication requirements. These requirements 
	 * must be checked in access policy, and the returned acr claim values should be adjusted based on the authentication 
	 * methods which have been performed. 
	 *
	 */
	var fapi_acr = false;
	if(fapi_acr && request_type == "authorization") {
		var claims = stsuu.getContextAttributes().getAttributeValueByNameAndType("claims","urn:ibm:names:ITFIM:oauth:query:param");
		if(claims == null) {
		 	claims = stsuu.getContextAttributes().getAttributeValueByNameAndType("claims","urn:ibm:names:ITFIM:oauth:body:param");
			if(claims == null) {
				claims = stsuu.getContextAttributes().getAttributeValueByNameAndType("claims","urn:ibm:names:ITFIM:oauth:jwt:param");
			}
		}
	
		var presented_acr = JSON.parse(claims).id_token.acr.value;
		if(presented_acr == null){
			var presented_acr = JSON.parse(claims).id_token.acr.values;
		}

		if(presented_acr != null) {
			var claims = stsuu.getContextAttributes().getAttributeValueByNameAndType("claims","urn:ibm:names:ITFIM:oauth:jwt:param");
	
			var claim_attr = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("acr", "urn:ibm:jwt:claim", presented_acr);
			stsuu.addAttribute(claim_attr);

			var attr1 = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("acr_fulfilled", "urn:ibm:names:ITFIM:5.1:accessmanager", presented_acr);
			stsuu.addAttribute(attr1);
			var attr2 = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("acr_fulfilled", "urn:ibm:names:ITFIM:oidc:claim:value", presented_acr);
			stsuu.addContextAttribute(attr2);  
		}

	}
	
	
} //End of FAPI Conformance Snippets

/*
 * Oauth20_TokenExchange_PreMapping
 *
 * This is an example of how you could to validate the subject token and actor token claims 
 * before the access token is generated, therefore preventing the scenario where request token 
 * claims are invalid and then you could choose to generate the access_token in this script or 
 * generate in the default module.
 */
if (request_type == "access_token" && grant_type == "urn:ietf:params:oauth:grant-type:token-exchange") {
	/*
	 * Config option to generate the token from this pre mapping rule. 
	 * ISVA will issue a regular access token if the varialbe set to false.
	 * If set to true, STS chain will be called to generate the token.
	 */
	var useSTSforTokenGenerate = false;

	/*
	 * Config option to stored the token which generated through this mapping rule to DB. This should be set
	 * to true if need to store the token into the oauth20_token_cache and set to flase if not.
	 * This variable is ignored if not using the STS to generate the token.
	 */
	var store_db = false;

	doTokenExchangePre(useSTSforTokenGenerate, store_db);
} // End of Oauth20_TokenExchange_PreMapping
