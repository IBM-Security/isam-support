/*
  Name : storeMultiValuedAttribute.js
  Author : jcyarbor@us.ibm.com
  
  Intended use : 
    This mapping rule function was created as a method of storing multi-valued attributes to be inserted into the ID Token
    during an Authorization Code flow.
    
    This is meant to be invoked at the '/authorize' endpoint.
    Please update your code appropriately.
    
    It takes 3 inputs : 
    1) inputAttribute - A String which is the name of the multivalued attribute in the 'STSUU:AttributeList' that you want
                        to store in the JWT
    
    2) outputAttributeName - A string that contains the name of the attribute as it will appear in the ID Token
    
    3) multivalueAttrListHolder - A Variable that has scope outside of the function to store a list of multivalued attributes
    
    ====
    Usage : 
    	if (request_type == "authorization") {
...
		// Added to support multi-valued attributes
		var multivaluedAttrs = "";
		
		storeMultiValuedAttribute("AZN_CRED_GROUPS","groups",multivaluedAttrs);
		
		if(multivaluedAttrs != null && multivaluedAttrs != ""){
			stsuu.addContextAttribute(new Attribute("multivaluedAttributes","urn:ibm:names:ITFIM:oidc:claim:value",multivaluedAttrs));
		}
		// End add to support multi-valued attributes
...
    ====
    
    You can take the 'function' from this mapping rule and put it at the end of your PreTokenGeneration mapping rule.
*/

function storeMultiValuedAttribute(inputAttribute,outputAttributeName,multiValueAttrListHolder){
		if(inputAttribute != null && inputAttribute != ""){
			var attrToBeStored = stsuu.getAttributeContainer().getAttributeValuesByNameAndType(inputAttribute,"urn:ibm:names:ITFIM:5.1:accessmanager");
        
			if(attrToBeStored != null && attrToBeStored.length > 0) {
			stsuu.addContextAttribute(new Attribute("number_"+outputAttributeName,"urn:ibm:names:ITFIM:oidc:claim:value",attrToBeStored.length));
			for(var i = 0; i < attrToBeStored.length; i++){
				stsuu.addContextAttribute(new Attribute(outputAttributeName+"_"+i,"urn:ibm:names:ITFIM:oidc:claim:value",attrToBeStored[i]));
			}
			multivaluedAttrs += ","+outputAttributeName;
		}
	}
}
