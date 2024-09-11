importClass(Packages.com.ibm.security.access.httpclient.Headers);
importClass(Packages.com.ibm.security.access.httpclient.HttpClient);
importClass(Packages.com.ibm.security.access.httpclient.HttpResponse);
importClass(Packages.com.ibm.security.access.httpclient.Parameters);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.uuser.Attribute);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.uuser.Group);

var incomingAttributes = stsuu.getAttributeContainer();

// We are now going to clear the STSUU Attribute List
stsuu.clearAttributeList()

// Microsoft Entra uses URI format in attribute names which is not a valid format for HTTP Headers.
// ISVA Service Provider authentication uses the Web Reverse Proxy EAI interface which sends the
// authentication information back via headers.
//
// Since we cleared the STSUU Attribute List we need to re-add the attributes
// We need to change the attribute name format from URI to just a name
var incomingAttrArray = incomingAttributes.getAttributes();
var numberOfAttrs = incomingAttributes.getNumberOfAttributes();

for(var i = 0; i < numberOfAttrs; i++) {
	var currentAttr = incomingAttrArray[i];
	
	var currentAttrName = currentAttr.getName();
	
	var fixedAttrName = "";
	
	// Adding this variable as an optional prefix for attributes from Entra
	var prefix = "";
	
	// Attribute names from Entra can have two types of formats:
	//    http://schemas.xmlsoap.org/ws/2005/05/identity/claims/<attr>
	//    http://schemas.microsoft.com/identity/claims/<attr>
	//
	//  So what we'll do is detect whether there's a '/' character in the name, split the 'name' into an Array
	//  at the '/' characters, and then use the last entry of the array to get the name
	if(currentAttrName.includes("/")) {
		fixedAttrName = prefix + currentAttrName.split("/").pop()
	} else {
		fixedAttrName = prefix + currentAttrName;
	}
	
	currentAttr.setName(fixedAttrName);
	stsuu.addAttribute(currentAttr)
}