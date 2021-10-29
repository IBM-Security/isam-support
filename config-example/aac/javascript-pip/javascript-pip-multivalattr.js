/*
*		Name: javascript-pip-multivalattr.js
*		Author: jcyarbor@us.ibm.com
*
*		Purpose:
*			This mapping rule provides an example of how to create and add multivalued attributes to an RTSS context that can be evaluated
*			using 'has member' in an Access Control Policy.
*
*			For this example create two AAC attributes with the following specifications
*				Name: loopAttr
*				Identifier: multivalattr:loopAttr
*				Issuer: multivalattr
*				Category: String
*				Data Type: String
*				Matcher: exact_match
*				Type: Policy
*				Storage Domain: Session
*
*				Name: splitStringAttr
*				Identifier: multivalattr:splitStringAttr
*				Issuer: multivalattr
*				Category: String
*				Data Type: String
*				Matcher: exact_match
*				Type: Policy
*				Storage Domain: Session
*
*			Reference to the java classes can be found on your appliance at 'Manage System Settings -> Secure Settings -> File Downloads ->> access_control ->
*			doc -> ISAM-javadoc.zip'. 
*
*			Java String reference can be found here:
*				https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html
*
*/

importPackage(com.tivoli.am.rba.extensions);
importClass(Packages.com.tivoli.am.rba.attributes.AttributeIdentifier);

function hasAttribute (requestedAttribute, category) {

	var issuerId = instanceName;

	if (issuerId.equals(requestedAttribute.getIssuer()))
	{
	     return true;
	}

	return false;
}

function getAttributes (context, requestedAttribute, category) {
	
	var issuerId = instanceName;
	
	// This creates an empty array of type String.
	var loopAttrArray = [];
	
	// This will be an example of a loop to fill the array.
	for(var i = 0; i < 5; i++){
		loopAttrArray[i] = "value" + i;
	}
	
	// Create an Attribute Identifier for the multivalued attribute.
	var loopAttrIdentifier = new AttributeIdentifier(
					       "multivalattr:loopAttr",
					       Attribute.DataType.STRING,
					       issuerId);
	
	// Add the attribute to the RTSS context using the Identifier and Array.
	context.addAttribute(loopAttrIdentifier,loopAttrArray);

	// This is an example of a String comma separated value.
	var multivalueString = "value1,value2,valueN";
	
	// Use the 'split' method to create a Java Array.
	var multivalueStringArray = [];
	multivalueStringArray = multivalueString.split(",");
	
	// Create an Attribute Identifier for the multivalued attribute.
	var multivalIdentifier = new AttributeIdentifier(
					       "multivalattr:splitStringAttr",
					       Attribute.DataType.STRING,
					       issuerId);
	
	// Add the attribute to the RTSS context using the Identifier and Array.
	context.addAttribute(multivalIdentifier,multivalueStringArray);
	
}
