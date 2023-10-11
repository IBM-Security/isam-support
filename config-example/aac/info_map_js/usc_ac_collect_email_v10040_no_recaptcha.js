/*********************************************************************
 *   Licensed Materials - Property of IBM
 *   (C) Copyright IBM Corp. 2016. All Rights Reserved
 *
 *   US Government Users Restricted Rights - Use, duplication, or
 *   disclosure restricted by GSA ADP Schedule Contract with
 *   IBM Corp.
 *********************************************************************/
// Filename : usc_ac_collect_email_v10040_no_recaptchajs
// 
// Description: 10.0.4.0 default USC Account Create 'Collect Email' infomap mechanism mapping rule with the 'reCAPTCHA' functionality removed

importPackage(Packages.com.ibm.security.access.scimclient);
importClass(Packages.com.ibm.security.access.recaptcha.RecaptchaClient);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

IDMappingExtUtils.traceString("entry USC_CreateAccount_CollectEmail.js");

var errors = [];
var missing = [];
var rc = true;

/*
 * Load the email address and perform some basic verification.
 */

function utf8decode(value) {
  if (value == null || value.length == 0) return "";
  return decodeURIComponent(escape(value));
}

var email = utf8decode(context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "emailAddress"));

if (email != "") {
  IDMappingExtUtils.traceString("Read email address: "+email);

  email = ""+email;

  if (email != "") {
    if (email.length > 5) {
      IDMappingExtUtils.traceString("Email is okay");
      context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "email", email);
      context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "username", email);
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

/*
 * Check if the email address is already in use.
 */

if (rc == true) {
  var scimConfig = context.get(Scope.SESSION, "urn:ibm:security:asf:policy", "scimConfig");

  var resp = ScimClient.httpGet(scimConfig, "/Users?filter=emails.value%20eq%20"+encodeURIComponent(email));
  if (resp != null && resp.getCode() == 200) {
    var respJson = JSON.parse(resp.getBody());
    IDMappingExtUtils.traceString("SCIM resp: "+respJson.totalResults);
    IDMappingExtUtils.traceString("SCIM resp: "+resp.getBody());

    if (respJson.totalResults != 0) {
      errors.push("Email address already in use!");
      rc =false;
    }
  } else {

  }

  IDMappingExtUtils.traceString("captchaResponse done");
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
if (errorString.length != 0) {
  macros.put("@ERROR_MESSAGE@", errorString);
}

/*
 * Done!
 */

success.setValue(rc);

IDMappingExtUtils.traceString("exit USC_CreateAccount_CollectEmail.js");