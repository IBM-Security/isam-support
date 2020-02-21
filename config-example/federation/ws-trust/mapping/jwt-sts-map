importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.oauth20);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.OAuthMappingExtUtils);

// get the username to put in the subject
var sub = stsuu.getPrincipalName();

// Get the value of the 'AppliesTo_ServiceName' 
var serviceName = stsuu.getRequestSecurityToken().getAttributeValueByNameAndType("AppliesTo_ServiceName","http://schemas.xmlsoap.org/ws/2004/08/addressing");

var svcValue = OAuthMappingExtUtils.SHA512Sum(serviceName);

stsuu.clearAttributeList();

var subAttr = new Attribute("sub", "urn:ibm:names:ITFIM:5.1:accessmanager", sub);
var svcAttr = new Attribute("service", "urn:ibm:names:ITFIM:5.1:accessmanager", svcValue);

if(subAttr != null) {
	stsuu.addAttribute(subAttr);
}

if(svcAttr != null) {
	stsuu.addAttribute(svcAttr);
}
