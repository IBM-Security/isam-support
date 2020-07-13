// BEGIN Javascript mapping rule for Office 365 federation
importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.utilities);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

// Get the current principal name.
var origPrincipalName = stsuu.getAttributeValueByName("mail");

// Get a list of groups.
var groups = stsuu.getGroups();

// Check to see if we have an active rule to execute.
var isEmptySTSUU = (
  (stsuu.getPrincipalAttributeContainer().getNumberOfAttributes() == 0) &&
        (stsuu.getAttributeContainer().getNumberOfAttributes() == 0) &&
        (stsuu.getContextAttributesAttributeContainer().getNumberOfAttributes() == 0));

if (!isEmptySTSUU) {
    // Get the short name i.e. before the @ symbol.
	if(origPrincipalName.indexOf('@')>0 ) {
		var shortName = origPrincipalName.substring(0, origPrincipalName.indexOf('@'));
	} else {
		var shortName = origPrincipalName;
	}

    // Clear the stsuu. We don't need any of the existing data.
    stsuu.clear();

    // Create the new principal attribute that's appropriate for a SAML 1.x Assertion.
    var principalAttr = new Attribute(
      "name",
      "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
      shortName);
    stsuu.addPrincipalAttribute(principalAttr);

    // Create SAML subject confirmation.
    var samlConfirmAttr = new Attribute(
      "SamlSubjectConfirmationMethod",
      "urn:oasis:names:tc:SAML:1.0:assertion",
      "urn:oasis:names:tc:SAML:1.0:cm:bearer");
    stsuu.addPrincipalAttribute(samlConfirmAttr);

    // Add the AuthenticationMethod for SAML 1.x
    var authnMethodAttr = new Attribute(
      "AuthenticationMethod",
      "urn:oasis:names:tc:SAML:1.0:assertion",
      "urn:oasis:names:tc:SAML:1.0:am:password");
    stsuu.addAttribute(authnMethodAttr);

    // set the objectGUID
    var objectAttr = new Attribute(
      "objectGUID",
      "http://tempuri.com",
      shortName);
    stsuu.addAttribute(objectAttr);


    // set the UPN attribute 
    var UPNAttr = new Attribute(
      "UPN",
      "http://schemas.xmlsoap.org/claims",
      origPrincipalName);
    stsuu.addAttribute(UPNAttr);

    // set the ImmutableID attribute
    var immutableIDAttr = new Attribute(
      "ImmutableID",
      "http://schemas.microsoft.com/LiveID/Federation/2008/05",
      origPrincipalName);
    stsuu.addAttribute(immutableIDAttr);

    // set the groups (claims) attribute
    if (groups != null) {
        while (groups.hasNext()) {
            var groupName = groups.next().getName();
            var groupAttr = new Attribute(
                "role",
                "http://schemas.microsoft.com/ws/2008/06/identity/claims",
                groupName
            );
            stsuu.addAttribute(groupAttr);
        }
    }
}
// END Javascript mapping rule for Office 365 federation
