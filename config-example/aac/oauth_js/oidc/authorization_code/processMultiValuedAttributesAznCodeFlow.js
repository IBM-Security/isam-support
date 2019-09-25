function processMultiValuedAttributesAznCodeFlow(){
	var multiValueAttrs = stsuu.getAttributeContainer().getAttributeValueByName("multivaluedAttributes");
	if(multiValueAttrs != null && multiValueAttrs != "") {
		multiValueAttrList = multiValueAttrs.split(",");
		for(attrs in multiValueAttrList){
			if(attrs != ""){
				var currentAttr = multiValueAttrList[attrs];
				IDMappingExtUtils.traceString("Current attribute : "+currentAttr);
				var currentAttrLength = stsuu.getAttributeContainer().getAttributeValueByName("number_"+currentAttr);
                    
				if(currentAttrLength >0){
					var attrJavaArray = java.lang.reflect.Array.newInstance(java.lang.String, currentAttrLength);
					for(var i = 0; i < currentAttrLength; i++){
						temp_attr = stsuu.getAttributeContainer().getAttributeValueByName(currentAttr+"_"+i);
						if(temp_attr != null && temp_attr != ""){
							attrJavaArray[i] = temp_attr;
						}
					}
					stsuu.addAttribute(new Attribute(currentAttr,"urn:ibm:jwt:claim",attrJavaArray));
				}
			}
		}
	}
}
