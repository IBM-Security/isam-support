/*
*		Name: stsuu_multivalue_attribute.js
*		Author: jcyarbor@us.ibm.com
*
*		Purpose:
*			This mapping rule provides an example of how to process a multivalued attribute from the STSUU Groups container via an iterator.
*			Reference to the java classes can be found on your appliance at 'Manage System Settings -> Secure Settings -> File Downloads ->> federation ->
*			doc -> ISAM-javadoc.zip'. 
*
*			This example can be used in all mapping rule types and can be extended with other scenarios.
*
*/

importClass(Packages.com.tivoli.am.fim.trustserver.sts.uuser.Attribute);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.uuser.AttributeStatement);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

// Get an Iterator of the groups from the principal :
var groupIter = stsuu.getGroups();

var groups = java.lang.reflect.Array.newInstance(java.lang.String, 5);

IDMappingExtUtils.traceString(groups.constructor.toString());

var currentGroup = "";
var i = 0;
while(groupIter.hasNext()){
	// While there are still groups, add the groups to an array
	currentGroup = groupIter.next().getName();
	IDMappingExtUtils.traceString("Current Group : " + currentGroup);
	groups[i] = (currentGroup);
	i++;
}

stsuu.addAttribute(new Attribute("groups","urn:ibm:names:ITFIM:5.1:accessmanager", groups));
