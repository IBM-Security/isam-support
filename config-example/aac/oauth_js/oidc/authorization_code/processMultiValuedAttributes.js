/*
  Name : processMultiValuedAttributes.js
  Author : jcyarbor@us.ibm.com
  
  Intended use : 
    This mapping rule function was created as a method of retrieving and processing multi-valued attributes to be inserted 
    into the ID Token during an Authorization Code flow.
    
    This function should be invoked at the '/token' endpoint.
    Please update your code appropriately.
      
    ====
    Usage : 
    
	} else if (request_type == "access_token") {
...		
		processMultiValuedAttributes();
	}
    
    You can take the 'function' from this mapping rule and put it at the end of your PreTokenGeneration mapping rule.
*/
function processMultiValuedAttributes(){
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
					stsuu.addAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute(currentAttr,"urn:ibm:jwt:claim",attrJavaArray));
				}
			}
		}
	}
}
