/*********************************************************************
 *   Licensed Materials - Property of IBM
 *   (C) Copyright IBM Corp. 2016. All Rights Reserved
 *
 *   US Government Users Restricted Rights - Use, duplication, or
 *   disclosure restricted by GSA ADP Schedule Contract with
 *   IBM Corp.
 *********************************************************************/
// Filename : usc_li_collect_email_v10040_no_recaptcha.js
// 
// Description: 10.0.4.0 default USC Lost ID 'Collect Email' infomap mechanism mapping rule with the 'reCAPTCHA' functionality removed

importPackage(Packages.com.ibm.security.access.scimclient);
importClass(Packages.com.ibm.security.access.recaptcha.RecaptchaClient);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

IDMappingExtUtils.traceString("entry USC_LostId_CollectEmail.js");

var errors = [];
var missing = [];
var rc = true;

var first = false;

if (state.get("first_collectEmail") == null) {
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
 * Attempt to locate the user and verify the secondary attribute.
 */

if (rc == true) {
  var scimConfig = context.get(Scope.SESSION, "urn:ibm:security:asf:policy", "scimConfig");
  IDMappingExtUtils.traceString("Looking for a user with email address: "+email);

  var resp = ScimClient.httpGet(scimConfig, "/Users?filter=emails.value%20eq%20"+encodeURIComponent(email));
  if (resp != null && resp.getCode() == 200) {
    var respJson = JSON.parse(resp.getBody());
    IDMappingExtUtils.traceString("SCIM resp: "+respJson.totalResults);
    IDMappingExtUtils.traceString("SCIM resp: "+resp.getBody());

    if (respJson.totalResults == 1) {
      IDMappingExtUtils.traceString("Found a user with the correct email address: "+JSON.stringify(respJson.Resources[0]));

      var scimSurname = (""+respJson.Resources[0].name.familyName).toLowerCase();
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
        context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "username", respJson.Resources[0].userName);
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

IDMappingExtUtils.traceString("exit USC_LostId_CollectEmail.js");