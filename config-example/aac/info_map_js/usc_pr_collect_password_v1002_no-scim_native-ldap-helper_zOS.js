/*********************************************************************
 *   Licensed Materials - Property of IBM
 *   (C) Copyright IBM Corp. 2016, 2021. All Rights Reserved
 *
 *   US Government Users Restricted Rights - Use, duplication, or
 *   disclosure restricted by GSA ADP Schedule Contract with
 *   IBM Corp.
 *********************************************************************/

importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

//Added to utilize native LDAP helper classes
importPackage(Packages.com.ibm.security.access.ldap.utils);
importPackage(Packages.javax.naming.directory);

IDMappingExtUtils.traceString("entry usc_pr_collect_password_v1002_no-LDAP_native-ldap-helper.js");

// Initialize the Native LDAP Helper
// REPLACE: 
// 	The first parameter should be the name of a server connection that points to the z/OS servers
// 	The second parameter should be your z/OS suffi
let ldapCtx = new AttributeUtil();
ldapCtx.init("zOS_ldap_server_connection","zOS_suffix");

var errors = [];
var missing = [];
var rc = true;

var first = false;

if (state.get("first_collectPassword") == null) {
  first = true;
  state.put("first_collectPassword", "false");
  rc = false;
}

var username = context.get(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "username");

/*
 * Check that the passwords are present and match.
 */

function utf8decode(value) {
  if (value == null || value.length == 0) return "";
  return decodeURIComponent(escape(value));
}

var password = utf8decode(context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "password"));
var passwordConfirm = utf8decode(context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "passwordConfirm"));
var httpMethod = context.get(Scope.REQUEST, "urn:ibm:security:asf:request", "method");

if (null == password || password.length == 0) {
  missing.push("password");
  rc = false;
} else if (password != passwordConfirm) {
  errors.push("Passwords do not match.");
  rc = false;
} else if (httpMethod != "POST" && httpMethod != "PUT") {
  errors.push("Unsupported method.");
  rc = false;
}

/*
 * Search for the user by username in LDAP
 */

function getUser(id) {
  let ldapUserInfo = [];
  
  var searchFilter = "(racfid="+username+")";
  
  // Perform search for input surname.
  var ldapResult = ldapCtx.search("zOS_suffix",searchFilter);
  
  // Get the result
  var result = ldapResult.getNamingEnumeration();
  var ldapResultRACFID = '';
  
  if (result != null) {
	// Loop through the returned attributes
	let i = 0;
	while(result.hasMore()) {
		// Accounts should be unique searching on the racfid
		if(i > 1){
			break;
		}
		
		// First Result
		var resultEntry = result.next();
		IDMappingExtUtils.traceString("current resultEntry : "+ resultEntry);
		
		var dn = resultEntry.getNameInNamespace();
		IDMappingExtUtils.traceString("current dn: " + dn);
		
		ldapResultRACFID = ''+ new RegExp("racfid=([A-Za-z0-9]+)","g").exec(dn)[1];
		
		i++
	}
  }
  return ldapResultRACFID;
}

var LDAPracfid = rc ? getUser(username) : null;

if (rc == true) {
  var resp = ldapCtx.setAttributeValue(LDAPracfid, "racfpassword", password);
  
  if (resp == null) {

    // Something went wrong.
    rc = false;
    errors.push("An error occurred contacting the LDAP endpoint.");
    IDMappingExtUtils.traceString("Response is null!");

  } else {
    IDMappingExtUtils.traceString("LDAP resp.isSuccessful(): "+resp.isSuccessful());

    if (resp.isSuccessful()) {
      IDMappingExtUtils.traceString("Successfully changed password.");
      rc = true;

    } else {
      IDMappingExtUtils.traceString("Failed to change password.");

      var respException = resp;
      if (respException) {
        errors.push("LDAP API error : " + resp);
      } else {
        errors.push("An internal error occurred.");
      }

      rc = false;
    }
  }
}

/*
 * Handle errors.
 */

function buildErrorString(errors) {
  var errorString = "";

  if (missing.length != 0) {
    errorString += "Missing required field(s): "+missing;
  }

  for (var error in errors) {
    if (errorString != "") errorString += "   ";
    errorString += "Error: "
    errorString += errors[error];
  }
  return errorString;
}

var errorString = buildErrorString(errors);
if (!first && errorString.length != 0) {
  macros.put("@ERROR_MESSAGE@", errorString);
}

if (rc == true) {
  /*
   * Set these values in the credential so they can be displayed on the success page.
   */
  context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "username", username);
  context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "firstName", username);
}

/*
 * Done!
 */

success.setValue(rc);

IDMappingExtUtils.traceString("exit usc_pr_collect_password_v1002_no-LDAP_native-ldap-helper.js");
