/*********************************************************************
 *   Licensed Materials - Property of IBM
 *   (C) Copyright IBM Corp. 2016. All Rights Reserved
 *
 *   US Government Users Restricted Rights - Use, duplication, or
 *   disclosure restricted by GSA ADP Schedule Contract with
 *   IBM Corp.
 *********************************************************************/
/*
*		Name : usc_pr_collect_email_v1002_no-scim_native-ldap-helper_zOS.js
*		Purpose : This mapping rule can be used to replace the default USC Password Reset Collect EMAIL mapping rule and is z/OS compatible.
*
*		Notes:
*			z/OS profiles do not have normal LDAP attributes such as 'surname' or 'common name' so the template file pages should be updated to request
*			the 'racfid'
*/

importClass(Packages.com.ibm.security.access.recaptcha.RecaptchaClient);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

// Added to utilize native LDAP helper classes
importPackage(Packages.com.ibm.security.access.ldap.utils);
importPackage(Packages.javax.naming.directory);

IDMappingExtUtils.traceString("entry usc_pr_collect_email_v1002_no-scim_native-ldap-helper.js");

var errors = [];
var missing = [];
var rc = true;

var first = false;

if (state.get("first_collectEmail") == null) {
  IDMappingExtUtils.traceString("first_collectEmail was null");
  first = true;
  state.put("first_collectEmail", "false");
  rc = false;
}

/*
 * Load the parameters and perform some basic verification.
 */

function utf8decode(value) {
  if (value == null || value.length == 0) return "";
  return decodeURIComponent(escape(value));
}

var email = utf8decode(context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "emailAddress"));
var racfid = utf8decode(context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "racfid"));

if (email != null) {
  IDMappingExtUtils.traceString("Read email address: "+email);

  email = ""+email;

  if (email != "") {
    if (email.length > 5) {
      IDMappingExtUtils.traceString("Email is okay");
      context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "email", email);
    } else {
      errors.push("Email is invalid (too short)");
      rc = false;
    }
    macros.put("@EMAIL@", email);
  } else {
    missing.push("email");
    rc =false;
  }
} else {
  rc = false;
}

if (racfid != null && "" != racfid) {
  IDMappingExtUtils.traceString("Read racfid: "+racfid);
  macros.put("@racfid@", racfid);
} else {
  missing.push("racfid");
  rc = false;
}

/*
 * ReCAPTCHA
 */

if (rc == true) {

  var captchaResponse = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "g-recaptcha-response");

  IDMappingExtUtils.traceString("captchaResponse is: "+captchaResponse);

  var captchaVerified = (captchaResponse != null && captchaResponse.trim() != "") && RecaptchaClient.verify(captchaResponse, macros.get("@RECAPTCHASECRETKEY@"), null);

  IDMappingExtUtils.traceString("RecaptchaClient.verify : "+captchaVerified);

  if (captchaVerified == false) {
    errors.push("CAPTCHA Failed.");
    rc = false;
  }
}

/*
 * Attempt to locate the user and verify the secondary attribute.
 */

if (rc == true) {
  IDMappingExtUtils.traceString("Looking for a user with email address: "+email);
  
  var ldapCtx = new AttributeUtil();
  
  // REPLACE: 
  // 	The first parameter should be the name of a server connection that points to the z/OS servers
  // 	The second parameter should be your z/OS suffix
  ldapCtx.init("zOS_server_connection","zOS_suffix");
  var searchFilter = "(racfid="+racfid+")";
  
  // Perform search for input racfid.
  // REPLACE:
  // 	replace the suffix with the desired suffix to search in.
  var ldapResult = ldapCtx.search("zOS_suffix",searchFilter);
  
  var result = ldapResult.getNamingEnumeration();
  
  IDMappingExtUtils.traceString("result: " + result);
  
  if (result != null) {
	// Loop through the returned attributes
	let i = 0;
	let ldapRacfid = '';
	while(result.hasMore()) {
		
		if(i > 1){
			break;
			rc = false;
			errors.push("Multiple Users Found with the same racfid");
		}
		
		var resultEntry = result.next();
		IDMappingExtUtils.traceString("current resultEntry : "+ resultEntry);
		
		var dn = resultEntry.getNameInNamespace();
		IDMappingExtUtils.traceString("current dn: " + dn);
		
		ldapRacfid = ''+ new RegExp("racfid=([A-Za-z0-9]+)","g").exec(dn)[1];
		
		i++
	}

	var scimRACFID = (""+ldapRacfid).toLowerCase();
	var reqRACFID  = (""+racfid).toLowerCase();

	IDMappingExtUtils.traceString("racfid [LDAP z/OS]    : "+scimRACFID);
	IDMappingExtUtils.traceString("racfid [Request] : "+reqRACFID);

	if (scimRACFID.length == 0 || reqRACFID.length == 0) {
	  IDMappingExtUtils.traceString("racfid is missing!");
	  errors.push("Invalid data.");
	  rc = false;
	} else if (scimRACFID != reqRACFID) {
	  IDMappingExtUtils.traceString("racfid do not match!");
	  errors.push("Invalid data.");
	  rc = false;
	} else {
	  context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "username", scimRACFID);
	}

  } else {
	  IDMappingExtUtils.traceString("Could not find a user with the given email address.");
	  errors.push("Invalid data.");
	  rc = false;
    }
  } else {
  IDMappingExtUtils.traceString("The SCIM endpoint could not be contacted/returned an error.");
  errors.push("An internal error occurred.");
  rc = false;
}

/*
 * Handle errors
 */

function buildErrorString(errors) {
  var errorString = "";

  if (missing.length != 0) {
    errorString += "Missing required field(s): "+missing;
  }

  for (var error in errors) {
    if (errorString != "") errorString += "<br/>";
    errorString += "Error: "
    errorString += errors[error];
  }
  return errorString;
}

var errorString = buildErrorString(errors);
if (!first && errorString.length != 0) {
  macros.put("@ERROR_MESSAGE@", errorString);
}

/*
 * Done!
 */

success.setValue(rc);

IDMappingExtUtils.traceString("exit usc_pr_collect_email_v1002_no-scim_native-ldap-helper.js");
