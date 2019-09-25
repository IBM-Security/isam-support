function processAndStoreMultiValueAttrs(inputAttr, outputAttr) {
	if(inputAttr != null && inputAttr != ""){
		var attrToBeStored = stsuu.getAttributeContainer().getAttributeValuesByNameAndType(inputAttr,"urn:ibm:names:ITFIM:5.1:accessmanager");
		if(attrToBeStored != null && attrToBeStored.length > 0) {
			stsuu.addAttribute(new Attribute(outputAttr,"urn:ibm:jwt:claim",attrToBeStored));
		}
	}
}
