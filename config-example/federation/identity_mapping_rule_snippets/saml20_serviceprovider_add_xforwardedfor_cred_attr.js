/*******************************************
/		Name: saml20_serviceprovider_add_xforwardedfor_cred_attr.js
/		Author: jcyarbor@us.ibm.com
/		
/		Purpose:
/			- This SAML 2.0 mapping rule adds the 'X-Forwarded-For' header value into the ISVA credential as an attribute 'addxff'.
/			- The following Advanced Configuration properties need to be enabled at least
/				sps.httpRequestClaims.enabled : true
/				sps.httpRequestClaims.filterSpec : headers=x-forwarded-for
/
*******************************************/
// Add incoming X-Forwarded-For header as the credential attribute 'addxff'

var addxff = "";

var claims = stsuu.getRequestSecurityToken().getAttributeByName("Claims").getNodeValues();

for (var i = 0; i < claims.length; i++) {
    var dialect = claims[i].getAttribute("Dialect");

    if ("urn:ibm:names:ITFIM:httprequest".equalsIgnoreCase(dialect)) {
        var headers = claims[i].getElementsByTagName("Header");

        for (var j = 0; j < headers.getLength(); j++) {
            var header = headers.item(j);
            var name   = header.getAttribute("Name");
            var values = header.getElementsByTagName("Value");
            
            for (var k = 0; k < values.getLength(); k++) {
                var value = values.item(k).getTextContent();

                IDMappingExtUtils.traceString("Header with name [" + name + "] and value [" + value + "]");
				if(name.toLowerCase() === "x-forwarded-for"){
					addxff = value;
				}
            }
        }
    }
}

IDMappingExtUtils.traceString("Current value of addxff : " + addxff);

if(addxff !== "" && addxff !== "null" && addxff !== null){
	stsuu.addAttribute(new Attribute("addxff","urn:ibm:names:ITFIM:5.1:accessmanager",addxff));
} else {
	stsuu.addAttribute(new Attribute("addxff","urn:ibm:names:ITFIM:5.1:accessmanager","missing"));
}