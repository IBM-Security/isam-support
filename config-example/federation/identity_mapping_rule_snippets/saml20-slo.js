//
// Use this when needing to do SLO at the IDP.
//
// Error message thrown is:
//
//   Logout Partial Success
//   /sps/intrajct/saml20/sloinitial
//   2020-08-06T13:57:42Z
//   Detail
//   Local logout was successful, but one or more partner providers failed logout for user username.
//
importClass(Packages.com.ibm.security.access.httpclient.Headers);
importClass(Packages.com.ibm.security.access.httpclient.HttpClient);
importClass(Packages.com.ibm.security.access.httpclient.HttpResponse);
importClass(Packages.com.ibm.security.access.httpclient.Parameters);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.uuser.Attribute);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.uuser.AttributeStatement);

IDMappingExtUtils.traceString("SLO_MAPPING_RULE_DEBUG: ENTER");

var currentName = stsuu.getPrincipalAttributeValueByName("name");

stsuu.removePrincipalAttribute("name", "urn:ibm:names:ITFIM:5.1:accessmanager");

stsuu.addPrincipalAttribute(new Attribute("name", "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress", currentName));

IDMappingExtUtils.traceString("SLO_MAPPING_RULE_DEBUG: EXIT");
