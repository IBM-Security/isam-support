//
// Add to bottom of PostToken to add and retrieve attributes.
// There are various ways to populate the attribute.  This just
// shows a hard-code string name totalCustom.
//

//
// Associate during the ROPC flow
//
if (request_type == "access_token") {
 OAuthMappingExtUtils.associate(state_id, "totalCustom", "totalCustom");
}

//
// Return with introspection
//
if (request_type == "introspect") {
 var totalCustom = OAuthMappingExtUtils.getAssociation(state_id, "totalCustom");

  if (totalCustom != null) {
  stsuu.addContextAttribute(new Attribute("totalCustom", "urn:ibm:names:ITFIM:oauth:response:attribute", totalCustom));
 }
}

//
// Add to ISAM cred when accessing resource
//

if (request_type == "resource") {
 var totalCustom = OAuthMappingExtUtils.getAssociation(state_id, "totalCustom");

 if (totalCustom != null) {
  stsuu.addContextAttribute(new Attribute("totalCustom", "urn:ibm:names:ITFIM:oauth:response:attribute", totalCustom));
 }
}
