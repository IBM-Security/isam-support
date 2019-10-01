/*
  Name : processAndStoreMultiValueAttrs.js
  Author : jcyarbor@us.ibm.com
  
  Intended use : 
    This mapping rule function was created as a method of retrieving and processing multi-valued attributes to be inserted 
    into the ID Token during an Implicit flow.
    
    This function should be invoked at the '/authorize' endpoint.
    Please update your code appropriately.
      
    ====
    Usage : 
    
	if (populate_id_token || save_cred_attrs) {
...		
		processAndStoreMultiValueAttrs("AZN_CRED_GROUPS","groups");
	}
    
    You can take the 'function' from this mapping rule and put it at the end of your PreTokenGeneration mapping rule.
*/
function processAndStoreMultiValueAttrs(inputAttr, outputAttr) {
	if(inputAttr != null && inputAttr != ""){
		var attrToBeStored = stsuu.getAttributeContainer().getAttributeValuesByNameAndType(inputAttr,"urn:ibm:names:ITFIM:5.1:accessmanager");
		if(attrToBeStored != null && attrToBeStored.length > 0) {
			stsuu.addAttribute(new com.tivoli.am.fim.trustserver.sts.uuser.Attribute(outputAttr,"urn:ibm:jwt:claim",attrToBeStored));
		}
	}
}
