/*********************************************************************
 *		Title: sp_saml20_lookupIdFromRegistry_nativeLDAPClientHelper.js
 *		Author: Jack Yarborough
 *		Emai: jcyarbor@us.ibm.com
 * 
 *		Purpose:
 *			This mapping rule is to be used with a SAML 2.0 Service Provider federation. It performs 
 *			an LDAP lookup using the principal name from the incoming SAML Assertion and the Native LDAP
 *			Client Helper to search a specified directory.
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

IDMappingExtUtils.traceString("entry sp_saml20_lookupIdFromRegistry_nativeLDAPClientHelper.js");

var initialUserName = stsuu.getPrincipalName();

var ldapCtx = new AttributeUtil();
ldapCtx.init("adhyperv","CN=Users,DC=hyperv,DC=Lab");
var searchFilter = "(initialUserName="+surname+")";

// Perform search for input surname.
var ldapResult = ldapCtx.search("CN=Users,DC=Hyperv,DC=Lab",searchFilter);

var result = ldapResult.getNamingEnumeration();

IDMappingExtUtils.traceString("result: " + result);

if (result != null) {
// Loop through the returned attributes
let i = 0;
let sAMAccountName = '';
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
	
	sAMAccountName = ''+ resultAttrs.get("sAMAccountName").get();
	
	i++
}

if(sAMAccountName != null && sAMAccountName != ""){
	stsuu.setPrincipalName = sAMAccountName;
}

IDMappingExtUtils.traceString("exit sp_saml20_lookupIdFromRegistry_nativeLDAPClientHelper.js");
