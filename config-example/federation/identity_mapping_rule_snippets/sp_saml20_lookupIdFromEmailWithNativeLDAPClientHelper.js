/*********************************************************************

 *		Title: sp_saml20_lookupIdFromEmailWithNativeLDAPClientHelper.js
 *		Author: Annelise Quap
 *		Email: aquap@us.ibm.com
 *
 *		Purpose:
 *			This mapping rule is to be used with a SAML 2.0 Service Provider federation. It performs
 *			an LDAP lookup using the email provided in the principal name of the incoming SAML Assertion
 *			This uses the Native LDAP Client Helper to search a specified LDAP directory.
 *

 *********************************************************************/

importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.utilities);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.uuser.Attribute);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

// Added to utilize native LDAP helper classes
importPackage(Packages.com.ibm.security.access.ldap.utils);
importPackage(Packages.javax.naming.directory);

IDMappingExtUtils.traceString("entry sp_saml20_lookupIdFromEmailWithNativeLDAPClientHelper.js");

let initialUserName = stsuu.getPrincipalName();

// This presumes the user has an attribute in LDAP named mail
// that contains the value from the SAML assertion

// This also connects to a previously defined server connection 'CorpLDAP' with the baseDN CN=Users,OU=Company
// https://www.ibm.com/docs/en/sva/10.0.6?topic=gs-server-connections

let ldapCtx = new AttributeUtil();


// This presumes the user has an attribute in LDAP named mail
// that contains the value from the SAML assertion

// This also connects to a previously defined server connection 'CorpLDAP' with the baseDN CN=Users,OU=Company
// https://www.ibm.com/docs/en/sva/10.0.6?topic=gs-server-connections


let basedn = "dc=iswga";
let searchfilter = "(mail="+initialUserName+")";
ldapCtx.init("CorpLDAP", basedn);
let ldapResult = ldapCtx.search(basedn, searchfilter);
let result = ldapResult.getNamingEnumeration();

IDMappingExtUtils.traceString("result: " + result);

if (result != null) {
  // Loop through the returned attributes
  let i = 0;
  var mappedaccountname  = '';
  while (result.hasMore()) {
    if (i > 1) {
      break;
      rc = false;
      errors.push("Multiple Users Found with the same email");
    }
    let resultEntry = result.next();
    IDMappingExtUtils.traceString("current resultEntry : " + resultEntry);
    let resultAttrs = resultEntry.getAttributes();
    IDMappingExtUtils.traceString("current resultEntry Attributes : " + resultAttrs);
    var dn = resultEntry.getNameInNamespace();
    IDMappingExtUtils.traceString("current dn: " + dn);
    mappedaccountname  = ''+ resultAttrs.get("cn").get();
    IDMappingExtUtils.traceString("Found user cn : " + mappedaccountname  );
    i++

  }
}
if (mappedaccountname != null && mappedaccountname != "") {
 stsuu.getPrincipalAttributeContainer().clear();
// Create new STSUU Principal Name attribute
  stsuu.addPrincipalAttribute(new Attribute("name", "urn:ibm:names:ITFIM:5.1:accessmanager", ""+mappedaccountname));
} else {
 IDMappingExtUtils.traceString(" NO user found in base with filter: " + basedn +" "+ searchfilter );
}

// Important clean up connection to LDAP when done
ldapCtx.close();


IDMappingExtUtils.traceString("exit sp_saml20_lookupIdFromRegistry_nativeLDAPClientHelper.js");