/*
*		Title: apiprotection-mapping-utilities.js
*		Author : Jack Yarborough (jcyarbor@us.ibm.com)
*
*		Intended Purpose : 
*			This mapping rule will contain utility functions for acquiring User, Group, Attribute, and Context Attribute information for API Protection Definition mapping rules.
*
*		Appliance Implementation :
*			1) Navigate to 'Secure Access Control -> Global Settings -> Mapping Rules'
*			2) Select 'Add' to create a new mapping rule
*				- Name : 'apiprotection-mapping-utilities'
*				- Category : infomap
*
*/
importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.oauth20);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);
importPackage(Packages.com.ibm.security.access.user);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

// This function only works at ISVA 10.0.0.0+
var stsuuJSON = (function() {
	var stsuuReturn = stsuu.toJSON();
	return stsuuReturn;
}) ();

//
// This function should return a JSON equivalent of the following:
// 	- STSUU Principal Attributes
//  - STSUU Group Attributes
//  - STSUU Credential Attributes
// 
// In ISVA 10.0.0.0+ we will easily be able to do this by getting the STSUU in JSON and creating a subset JSON Object that contains only the following:
//  - Principal Attributes
//  - Attributes
//  - Groups
//
// This mapping rule is 9.0.X compliant for backwards compatible deployments
//
var userJSON = (
	function() {
       var username = stsuu.getPrincipalName();
       var userReturn = {};

       var groupsJSON = (function() {
              var groupsReturn = [];
              
			  var groupsIterator = stsuu.getGroups();

              for (it = groupsIterator; it.hasNext();) {
                     var group = it.next();
                     var groupName = group.getName();
                     groupsReturn.push("" + groupName);
              }

              return groupsReturn;
       })();

       var attributesJSON = (function() {
              var attributesReturn = {};
              var attributesIterator = stsuu.getAttributes();

              for (var it = attributesIterator; it.hasNext();) {
                     var attribute = it.next();
                     var attributeName = attribute.getName();
					 var attributeValue = [];
                     var attributeValues = attribute.getValues();
					 if(attributeValues.length > 1 || attributeValues[0].includes(",")) {
						for(var attr = attributeValues.iterator(); attr.hasNext();) {
							var currentAttr = attr.next();
							attributeValue.push(currentAttr);
						}
						attributesReturn["" + attributeName] = attributeValue;
					 } else {
						 attributeValue = attributeValues[0];
						 attributesReturn["" + attributeName] = "" + attributeValue;
					 }
              }
              return attributesReturn;
       })();
      
       userReturn["username"] = "" + username;
       userReturn["groups"] = groupsJSON;
       userReturn["attributes"] = attributesJSON;

       return userReturn;
})();

//Retrieve request context (Parameters, Headers, Cookies)
var requestJSON = (
	function() {
		var requestReturn = {};
		var headers;
		var cookies;
		var parameters;
		
		var claims;
		
		var rstClaims = stsuu.getRequestSecurityToken().getAttributeByName("Claims")
		if(rstClaims != null && rstClaims != "" && rstClaims != "null") {
			claims = rstClaims.getNodeValues();
		} else {
			claims = "";
		}

		for (var i = 0; i < claims.length; i++) {
			var dialect = claims[i].getAttribute("Dialect");

			if ("urn:ibm:names:ITFIM:httprequest".equalsIgnoreCase(dialect)) {
				headers = claims[i].getElementsByTagName("Header");
				cookies = claims[i].getElementsByTagName("Cookie");
				parameters = claims[i].getElementsByTagName("Parameter");
			}
		}
		
		var headersJSON = (
			function() {
				var headersReturn = {};

				if( headers != null && headers != "" && headers != "null"){
					// Loop through headers
					for (var j = 0; j < headers.getLength(); j++) {
						var header = headers.item(j);
						var name   = header.getAttribute("Name");
						var values = header.getElementsByTagName("Value");
						
						for (var k = 0; k < values.getLength(); k++) {
							var value = values.item(k).getTextContent();

							IDMappingExtUtils.traceString("Header with name [" + name + "] and value [" + value + "]");
							headersReturn["" + name] = {value: "" + value};
						}
					}
				}

				return headersReturn;
	   })();

		
		var cookiesJSON = (
			function() {
				var cookiesReturn = {};
				
				if( headers != null && headers != "" && headers != "null"){
					// Loop through cookies
					for (var j = 0; j < cookies.getLength(); j++) {
						var cookie = cookies.item(j);
						var name = cookie.getAttribute("Name");
						var values = cookie.getElementsByTagName("Value");
						
						for (var k = 0; k < values.getLength(); k++) {
							var value = values.item(k).getTextContent();

							IDMappingExtUtils.traceString("Cookie with name [" + name + "] and value [" + value + "]");
							cookiesReturn["" + name] = {value: "" + value};
						}
					}
				}
				return cookiesReturn;
	   })();


		
		var parametersJSON = (function() {
				var parametersReturn = {};
				if( headers != null && headers != "" && headers != "null"){
					// Loop through Parameters
					for (var j = 0; j < parameters.getLength(); j++) {
						var parameter = parameters.item(j);
						var name = parameter.getAttribute("Name");
						var values = parameter.getElementsByTagName("Value");
						
						for (var k = 0; k < values.getLength(); k++) {
							var value = values.item(k).getTextContent();

							IDMappingExtUtils.traceString("Parameter with name [" + name + "] and value [" + value + "]");
							
							parametersReturn["" + name] = {value: "" + value};
						}
					}
				}

				return parametersReturn;
	   })();

	   requestReturn["headers"] = headersJSON;
	   requestReturn["parameters"] = parametersJSON;
	   requestReturn["cookies"] = cookiesJSON;
	   
	   return requestReturn;
})();
