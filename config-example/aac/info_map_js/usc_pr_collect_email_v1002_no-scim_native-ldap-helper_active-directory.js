/*********************************************************************
 *   Licensed Materials - Property of IBM
 *   (C) Copyright IBM Corp. 2016. All Rights Reserved
 *
 *   US Government Users Restricted Rights - Use, duplication, or
 *   disclosure restricted by GSA ADP Schedule Contract with
 *   IBM Corp.
 *********************************************************************/

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
var surname = utf8decode(context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "surname"));

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

if (surname != null && "" != surname) {
  IDMappingExtUtils.traceString("Read surname: "+surname);
  macros.put("@SURNAME@", surname);
} else {
  missing.push("surname");
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
  ldapCtx.init("adhyperv","CN=Users,DC=hyperv,DC=Lab");
  var searchFilter = "(sn="+surname+")";
  
  // Perform search for input surname.
  var ldapResult = ldapCtx.search("CN=Users,DC=Hyperv,DC=Lab",searchFilter);
  
  var result = ldapResult.getNamingEnumeration();
  
  IDMappingExtUtils.traceString("result: " + result);
  
  if (result != null) {
	// Loop through the returned attributes
	let i = 0;
	let ldapResultSurname = '';
	while(result.hasMore()) {
		
		if(i > 1){
			break;
			rc = false;
			errors.push("Multiple Users Found with the same surname");
		}
		
		var resultEntry = result.next();
		IDMappingExtUtils.traceString("current resultEntry : "+ resultEntry);
		
		var resultAttrs = resultEntry.getAttributes();
		IDMappingExtUtils.traceString("current resultEntry Attributes : "+ resultAttrs);
		
		IDMappingExtUtils.traceString("testing specific attribute [sAMAccountName] : " + resultEntry.getAttributes().get("sAMAccountName"));
		
		var dn = resultEntry.getNameInNamespace();
		IDMappingExtUtils.traceString("current dn: " + dn);
		
		ldapResultSurname = ''+ resultAttrs.get("sAMAccountName").get();
		
		i++
	}

	var scimSurname = (""+ldapResultSurname).toLowerCase();
	var reqSurname  = (""+surname).toLowerCase();

	IDMappingExtUtils.traceString("Surname [SCIM]    : "+scimSurname);
	IDMappingExtUtils.traceString("Surname [Request] : "+reqSurname);

	if (scimSurname.length == 0 || reqSurname.length == 0) {
	  IDMappingExtUtils.traceString("Surname is missing!");
	  errors.push("Invalid data.");
	  rc = false;
	} else if (scimSurname != reqSurname) {
	  IDMappingExtUtils.traceString("Surnames do not match!");
	  errors.push("Invalid data.");
	  rc = false;
	} else {
	  context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "username", resultAttrs.get("sAMAccountName").get());
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