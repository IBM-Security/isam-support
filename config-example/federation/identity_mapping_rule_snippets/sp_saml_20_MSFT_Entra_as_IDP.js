importClass(Packages.com.ibm.security.access.httpclient.Headers);
importClass(Packages.com.ibm.security.access.httpclient.HttpClient);
importClass(Packages.com.ibm.security.access.httpclient.HttpResponse);
importClass(Packages.com.ibm.security.access.httpclient.Parameters);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.uuser.Attribute);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.uuser.Group);

let matchingPatterns = [
	/^http:\/\/schemas.xmlsoap.org\/ws\/2005\/05\/identity\/claims\/([^\/]+)$/,
	/^http:\/\/schemas.microsoft.com\/identity\/claims\/([^\/]+)$/
];

function extractEntraAttributeShortName(s) {
	let result = null;
	for (let i = 0; i < matchingPatterns.length && result == null; i++) {
		let m = s.match(matchingPatterns[i]);
		result = (m != null && m.length == 2) ? m[1] : null;
	}
	return result;
}

let incomingAttributes = stsuu.getAttributeContainer();

// We are now going to clear the STSUU Attribute List
stsuu.clearAttributeList()

// Microsoft Entra uses URI format in attribute names which is not a valid format for HTTP Headers.
// ISVA Service Provider authentication uses the Web Reverse Proxy EAI interface which sends the
// authentication information back via headers.
//
// Since we cleared the STSUU Attribute List we need to re-add the attributes
// We need to change the attribute name format from URI to just a name
let incomingAttrArray = incomingAttributes.getAttributes();
let numberOfAttrs = incomingAttributes.getNumberOfAttributes();

for(let i = 0; i < numberOfAttrs; i++) {
	let currentAttr = incomingAttrArray[i];
	
	let currentAttrName = currentAttr.getName();
	
	let fixedAttrName = "";
	
	// Adding this variable as an optional prefix for attributes from Entra
	let prefix = "";
	
	// Attribute names from Entra can have two types of formats:
	//    http://schemas.xmlsoap.org/ws/2005/05/identity/claims/<attr>
	//    http://schemas.microsoft.com/identity/claims/<attr>
	//
	fixedAttrName = prefix + extractEntraAttributeShortName(currentAttrName);
	
	currentAttr.setName(fixedAttrName);
	stsuu.addAttribute(currentAttr)
}
