/*
*		Title: idp-filter-attribute-list.js
*		Author : Jack Yarborough (jcyarbor@us.ibm.com)
*		
*		Intended purpose :
*			This is an example of an IdP mapping rule for SAML 2.0 federations that filter attributes in the outgoing STSUU based on
*			a predetermined array of attribute names.
*
*		Appliance Implementation :
*			1) Navigate to 'Secure Federation -> Global Settings -> Mapping Rules'
*			2) Select 'Add' to create a new mapping rule
*				- Name : 'idp-filter-attribute-list'
*				- Category : SAML2_0
*/

// SAML20 IP Mapping rule -- 
importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.utilities);

//The following is an example of how to create an Array of attributes that you want to keep from the ISAM credential.
//var keepAttrs = [ "tagvalue_cn", "tagvalue_sn", "emailAddress", "mobileNumber", "credential_attr" ];
var keepAttrs = [ "tagvalue_uid", "tagvalue_cn", "tagvalue_sn", "emailAddress" ];

//Initialize an empty array to store the attributes that match your list of attributes to keep from the STSUU Attribute Container.
var foundAttrs = [];

//Iterate through each of the attributes you've identified to keep
for (var i = 0; i < keepAttrs.length; i++) {
    // Acquire the attribute from the STSUU Attribute Container.
		var attr = stsuu.getAttributeContainer().getAttributeByNameAndType(keepAttrs[i], "urn:ibm:names:ITFIM:5.1:accessmanager");
		if (attr != null) {
				foundAttrs.push(attr);
		}
}

// Clear the existing STSUU attribute list to remove all the attributes
stsuu.clearAttributeList();

// Iterate through the list of attributes found in the STSUU
for (var i = 0; i < foundAttrs.length; i++) {
	//Optionally perform logic to modify the attributes if necessary
	//The below conditional statement tests whether an attribute has the 'tagvalue_' prefix and removes it if it does.
	if(foundAttrs[i].getName().indexOf('tagvalue_')>-1){
		var fixedName = foundAttrs[i].getName().replace('tagvalue_','');
		foundAttrs[i].setName(fixedName);
			stsuu.addAttribute(foundAttrs[i]);
		}else{
			stsuu.addAttribute(foundAttrs[i]);
	}
}

IDMappingExtUtils.traceString("idp mapping rule called with new stsuu: " + stsuu.toString());
