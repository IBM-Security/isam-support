/*
*		Title: saml20-access-policy-utilities.js
*		Author : Jack Yarborough (jcyarbor@us.ibm.com)
*
*		Intended Purpose : 
*			This mapping rule will contain utility functions for the different contexts.
*
*		Appliance Implementation :
*			1) Navigate to 'Secure Access Control -> Global Settings -> Mapping Rules'
*			2) Select 'Add' to create a new mapping rule
*				- Name : 'saml20-access-policy-utilities'
*				- Category : infomap
*
*/

importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);

var userJSON = (function() {
       var user = context.getUser();
       var userReturn = {};

       var groupsJSON = (function() {
              var groupsReturn = [];
              var groups = user.getGroups();

              for (var it = groups.iterator(); it.hasNext();) {
                     var group = it.next();
                     var groupName = group.getName().trim();
                     groupsReturn.push("" + groupName).trim();
              }

              return groupsReturn;
       })();

       var attributesJSON = (function() {
              var attributesReturn = {};
              var attributes = user.getAttributes();

             for (var it = attributes.iterator(); it.hasNext();) {
                     var attribute = it.next();
                     var attributeName = attribute.getName();
					 var attributeValue = [];
                     var attributeValues = attribute.getValues();
					 if(attributeValues.size() > 1 || attributeValues.get(0).includes(",")) {
						for(var attr = attributeValues.iterator(); attr.hasNext();) {
							var currentAttr = attr.next();
							attributeValue.push(currentAttr);
						}
						attributesReturn["" + attributeName] = attributeValue.trim();
					 } else {
						 attributeValue = attributeValues.get(0);
						 attributesReturn["" + attributeName] = "" + attributeValue.trim();
					 }
              }

              return attributesReturn;
       })();
      
       userReturn["username"] = "" + user.getUsername();
       userReturn["groups"] = groupsJSON;
       userReturn["attributes"] = attributesJSON;

       return userReturn;
})();

//Retrieve request context
var requestJSON = (function() {
       var request = context.getRequest();
       var requestReturn = {};
	
       var headersJSON = (function() {
              var headersReturn = {};
              var headerNames = request.getHeaderNames();

              for (var it = headerNames.iterator(); it.hasNext();) {
                     var headerName = it.next();
                     var headerValue = request.getHeader(headerName);

                     headersReturn["" + headerName] = "" + headerValue.trim();
              }

              return headersReturn;
       })();
	
       var cookiesJSON = (function() {
             var cookiesReturn = {};
             var cookies = request.getCookies();

             for (var it = cookies.iterator(); it.hasNext();) {
                     var cookie = it.next();
                     var cookieComment = cookie.getComment();
                     var cookieDomain = cookie.getDomain();
                     var cookieHttpOnly = cookie.isHttpOnly();
                     var cookieMaxAge = cookie.getMaxAge();
                     var cookieName = cookie.getName();
                     var cookiePath = cookie.getPath();
                     var cookieSecure = cookie.isSecure();
                     var cookieValue = cookie.getValue();
                     var cookieVersion = cookie.getVersion();

                     cookiesReturn["" + cookieName] = {
                            comment: "" + cookieComment,
                            domain: "" + cookieDomain,
                            httpOnly: cookieHttpOnly,
                            maxAge: cookieMaxAge,
                            path: "" + cookiePath,
                            secure: cookieSecure,
                            value: "" + cookieValue,
                            version: cookieVersion
                     };
              }

              return cookiesReturn;
       })();

       var parametersJSON = (function() {
              var parametersReturn = {};
              var parameterNames = request.getParameterNames();

              for (var it = parameterNames.iterator(); it.hasNext();) {
                     var parameterName = it.next();
                     var parameterValue = request.getParameter(parameterName);

                     parametersReturn["" + parameterName] = "" + parameterValue.trim();
              }

              return parametersReturn;
       })();

       requestReturn["headers"] = headersJSON;
       requestReturn["parameters"] = parametersJSON;
	   requestReturn["cookies"] = cookiesJSON;

       return requestReturn;
})();

//Retrieve protocol context
var protocolContextJSON = (function() {
       var protocolContext = context.getProtocolContext();
       var protocolContextReturn = {};
       protocolContextReturn["request"] = "" + protocolContext.getAuthnRequest();
       protocolContextReturn["FederationId"] = "" + protocolContext.getFederationId();
       protocolContextReturn["PartnerId"] = "" + protocolContext.getPartnerId();
       protocolContextReturn["FederationName"] = "" + protocolContext.getFederationName();
       protocolContextReturn["PartnerName"] = "" + protocolContext.getPartnerName();
       return protocolContextReturn;
})();
