/*
	File Name : oauth-oidc-implicit-preTokenGeneration-attributeSource.js
	Author : Jack Yarborough
	Contact : jcyarbor@us.ibm.com
	
	Usage : This mapping rule is the 'PreTokenGeneration' mapping rule to be used with an 'Implicit' OIDC flow.
		- Retrieve Attribute Source values from the STSUU
		- Conditionally insert the resultant values into the JWT, or insert a placeholder if they are missing
		
	**This JavaScript mapping rule is provided as-is and is supported by the author.
	** All variable names, attribute names, and logic are provided as an example
	** All non-customized JS default as provided by the ISAM Appliance AAC Module when creating an API Protection Definition
	
	Please refer to the following documentation for a complete list of classes that are available for use in InfoMap Mapping rules : 
		- https://www.ibm.com/support/knowledgecenter/en/SSPREK_9.0.7/com.ibm.isam.doc/config/concept/con_otp_customize_mapping_rules_gs_aac.html
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

	// If expectedValues exist, use it
	if (expectedValues != null && expectedValues.length > 0) {
		value = expectedValues;
	}

	// Attempt to get the value of the claim from AttributeSource resolution.
	if (value == null) {
		value = stsuu.getAttributeContainer()
				.getAttributeValuesByNameAndType(claimName, "urn:ibm:names:ITFIM:5.1:accessmanager");
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

		temp_attr = stsuu.getContextAttributes()
				.getAttributeValuesByNameAndType("response_type", "urn:ibm:names:ITFIM:oauth:query:param");
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
		var code = stsuu.getContextAttributes().getAttributeValueByNameAndType("code","urn:ibm:names:ITFIM:oauth:body:param");
		if (code != null) {
			var token = OAuthMappingExtUtils.getToken(code);
			if (token != null) {
				state_id = token.getStateId();
			}
		}
	}

	if (populate_id_token || save_cred_attrs) {

		// Customization provided by jcyarbor@us.ibm.com
		// Acquire the Fixed Attribute Source value from the STSUniversalUser and store it to a variable
		var fixedAttrSrcAttr = stsuu.getAttributeContainer().getAttributeValueByNameAndType("attrSrc-fixedvalue","urn:ibm:names:ITFIM:5.1:accessmanager");
		IDMappingExtUtils.traceString("Fixed Attribute Source Attribute Value: [" + fixedAttrSrcAttr + "]");
		
		// Make sure the attribute is not null and if it isn't add it into the STSUU. If the attribute is null, add the attribute as 'missing'
		if(fixedAttrSrcAttr !=null && fixedAttrSrcAttr != "") {
			stsuu.addAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("fixedAttribute", "urn:ibm:jwt:claim", fixedAttrSrcAttr));
		} else {
			stsuu.addAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("fixedAttribute", "urn:ibm:jwt:claim", "missing"));
		}

		// Acquire the Credential Attribute Source value from the STSUniversalUser and store it to a variable
		var credAttrSrcAttr = stsuu.getAttributeContainer().getAttributeValueByNameAndType("attrSrc-credAttr","urn:ibm:names:ITFIM:5.1:accessmanager");
		IDMappingExtUtils.traceString("Credential Attribute Source Attribute Value: [" + credAttrSrcAttr + "]");
		
		// Make sure the attribute is not null and if it isn't add it into the STSUU. If the attribute is null, add the attribute as 'missing'
		if(credAttrSrcAttr !=null && credAttrSrcAttr != "") {
			stsuu.addAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("credentialAttribute", "urn:ibm:jwt:claim", credAttrSrcAttr));
		} else {
			stsuu.addAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("credentialAttribute", "urn:ibm:jwt:claim", "missing"));
		}

		// Acquire the Custom Credential Attribute Source value from the STSUniversalUser and store it to a variable
		var customCredAttrSrcAttr = stsuu.getAttributeContainer().getAttributeValueByNameAndType("attrSrc-customAttr","urn:ibm:names:ITFIM:5.1:accessmanager");
		IDMappingExtUtils.traceString("Custom Credential Attribute Source Attribute Value: [" + customCredAttrSrcAttr + "]");
		
		// Make sure the attribute is not null and if it isn't add it into the STSUU. If the attribute is null, add the attribute as 'missing'
		if(customCredAttrSrcAttr !=null && customCredAttrSrcAttr != "") {
			stsuu.addAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("customAttribute", "urn:ibm:jwt:claim", customCredAttrSrcAttr));
		} else {
			stsuu.addAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("customAttribute", "urn:ibm:jwt:claim", "missing"));
		}

		// Acquire the LDAP Attribute Source value from the STSUniversalUser and store it to a variable
		var ldapAttrSrcAttr = stsuu.getAttributeContainer().getAttributeValueByNameAndType("attrSrc-ldapAttr","urn:ibm:names:ITFIM:5.1:accessmanager");
		IDMappingExtUtils.traceString("LDAP Attribute Source Attribute Value: [" + ldapAttrSrcAttr + "]");
		
		// Make sure the attribute is not null and if it isn't add it into the STSUU. If the attribute is null, add the attribute as 'missing'
		if(ldapAttrSrcAttr !=null && ldapAttrSrcAttr != "") {
			stsuu.addAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("ldapAttribute", "urn:ibm:jwt:claim", ldapAttrSrcAttr));
		} else {
			stsuu.addAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("ldapAttribute", "urn:ibm:jwt:claim", "missing"));
		}
		// End customization
		
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
