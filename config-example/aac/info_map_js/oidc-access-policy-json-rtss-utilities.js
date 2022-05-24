/*
*		Title: oidc-access-policy-json-rtss-utilities.js
*		Author : Jack Yarborough (jcyarbor@us.ibm.com)
*
*		Intended Purpose : 
*			This mapping rule will contain utility functions for setting up and creating JSON formatted RTSS requests for OIDC Access Policies.
*
*		Appliance Implementation :
*			1) Navigate to 'Secure Access Control -> Global Settings -> Mapping Rules'
*			2) Select 'Add' to create a new mapping rule
*				- Name : 'oidc-access-policy-json-rtss-utilities'
*				- Category : infomap
*
*/

importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importMappingRule("oidc-access-policy-utilities");

function buildEmptyJSONBody() {
	var JSONBody = {};
	JSONBody.Request = {"Action":{"Attribute":[]},"Resource":{"Attribute":[]},"Environment":{"Attribute":[]},"AccessSubject":{"Attribute":[]}};
	return JSONBody;
}

function envAttrExists(attrId, JSONBody) {
	var exists = false;
	var attrs = JSONBody.Request.Environment.Attribute;
	for(attribute in attrs) {
		if(attribute.AttributeId === attrId){
			exists = true;
		}
	}
	return exists;	
}

function subjAttrExists(attrId, JSONBody) {
	var exists = false;
	var attrs = JSONBody.Request.AccessSubject.Attribute;
	for(attribute in attrs) {
		if(attribute.AttributeId === attrId){
			exists = true;
		}
	}
	return exists;	
}

function addStringEnvAttr(attrId, attrvalue, JSONBody) {
	var stringId = "" + attrId;
	var stringValue = null;
	if(typeof attrvalue != "string" && typeof attrvalue!= "undefined"){
		var values = attrvalue.toString().split(",");
		var jsonarray = [];
		for( var j = 0; j < values.length; j++) {
			jsonarray.push(values[j].toString());
		}
		stringValue = jsonarray;
	}else {
		stringValue = "" + attrvalue;
	}
	if(!envAttrExists(attrId, JSONBody)) {
		if(stringValue != "null"){
			JSONBody.Request.Environment.Attribute.push({"AttributeId":stringId,"DataType":"string","Value":stringValue});
		}
	}
}

function addStringSubjAttr(attrId, attrvalue, JSONBody){
	var stringId = "" + attrId;
	var stringValue = null;
	if(typeof attrvalue != "string" && typeof attrvalue!= "undefined"){
		var values = attrvalue.toString().split(",");
		var jsonarray = [];
		for( var j = 0; j < values.length; j++) {
			jsonarray.push(values[j].toString());
		}
		stringValue = jsonarray;
	}else {
		stringValue = "" + attrvalue;
	}
	if(!envAttrExists(attrId, JSONBody)) {
		if(stringValue != "null"){
			JSONBody.Request.AccessSubject.Attribute.push({"AttributeId":stringId,"DataType":"string","Value":stringValue});
		}
	}
}

function addResourceId(resourceValue, JSONBody){
	var stringValue = "" + resourceValue;
	JSONBody.Request.Resource.Attribute.push({"AttributeId":"urn:oasis:names:tc:xacml:1.0:resource:resource-id","DataType":"string","Value":stringValue});
}

function addContextId(contextValue, JSONBody){
	var stringValue = "" + contextValue;
	JSONBody.Request.Environment.Attribute.push({"AttributeId":"ContextId","DataType":"string","Value":stringValue,"Issuer":"http://security.tivoli.ibm.com/policy/distribution"});	
}

function addApplicationId(applicationValue, JSONBody){
	var stringValue = "" + applicationValue;
	JSONBody.Request.Environment.Attribute.push({"AttributeId":"ApplicationId","DataType":"string","Value":stringValue,"Issuer":"http://security.tivoli.ibm.com/policy/distribution"});

function buildDefaultBehaviorRiskProfile(JSONBody) {
	/*
	*		Attributes provided by RTSS : 
	*			accessTime
	*
	*		Attributes provided by request context : 
	*			ac.uuid
	*			http:userAgent
	*
	*		Attributes provided by 'info.js' call : 
	*			browserPlugins
	*			deviceFonts
	*/
	
	// We need to include the acuuid each time
	var acuuid = requestJSON.cookies["ac.uuid"];
	if(acuuid != null) {
		acuuidvalue = acuuid.value;
	} else {
		acuuidvalue = "";
	}
	addStringEnvAttr("ac.uuid",acuuidvalue, JSONBody);
	
	// Get headers and add them
	var httpUserAgent = requestJSON.headers["User-Agent"];
	
	addStringEnvAttr("urn:ibm:security:environment:http:userAgent",httpUserAgent,JSONBody);
	
	return JSONBody;
}

function buildDefaultBrowserRiskProfile (JSONBody) {
	/*
	*		Attributes provided by RTSS : 
	*
	*		Attributes provided by request context : 
	*			http:accept
	*			http:acceptEncoding
	*			http:acceptLanguage
	*			http:userAgent
	*
	*		Attributes provided by 'info.js' call : 
	*			browserPlugins
	*			deviceFonts
	*/
	
	// We need to include the acuuid each time
	var acuuid = requestJSON.cookies["ac.uuid"];
	if(acuuid != null) {
		acuuidvalue = acuuid.value;
	} else {
		acuuidvalue = "";
	}
	addStringEnvAttr("ac.uuid",acuuidvalue, JSONBody);
	
	// Get headers and add them
	var httpAccept = requestJSON.headers["Accept"];
	var httpAcceptEncoding = requestJSON.headers["Accept-Encoding"];
	var httpAcceptLanguage = requestJSON.headers["Accept-Language"];
	var httpUserAgent = requestJSON.headers["User-Agent"];
	
	addStringEnvAttr("urn:ibm:security:environment:http:accept",httpAccept,JSONBody);
	addStringEnvAttr("urn:ibm:security:environment:http:acceptEncoding",httpAcceptEncoding,JSONBody);
	addStringEnvAttr("urn:ibm:security:environment:http:acceptLanguage",httpAcceptLanguage,JSONBody);
	addStringEnvAttr("urn:ibm:security:environment:http:userAgent",httpUserAgent,JSONBody);
	
	return JSONBody;
}

function buildDefaultDeviceRiskProfile(JSONBody) {
	/*
	*		Attributes provided by RTSS : 
	*
	*		Attributes provided by request context : 
	*
	*		Attributes provided by 'info.js' call : 
	*			browserPlugins
	*			deviceFonts
	*			deviceLanguage
	*			devicePlatform
	*			screenAvailableHeight
	*			screenAvailableWidth
	*			screenHeight
	*			screenWidth
	*/
	
	// We need to include the acuuid each time
	var acuuid = requestJSON.cookies["ac.uuid"];
	if(acuuid != null) {
		acuuidvalue = acuuid.value;
	} else {
		acuuidvalue = "";
	}
	addStringEnvAttr("ac.uuid",acuuidvalue, JSONBody);
	
	return JSONBody;
}

function buildDefaultLocationRiskProfile (JSONBody) {
	/*
	*		Attributes provided by RTSS : 
	*
	*		Attributes provided by request context : 
	*
	*		Attributes provided by 'info.js' call : 
	*			geoCity
	*			geoCountryCode
	*			geoLocation
	*			geoRegionCode
	*/
	
	// We need to include the acuuid each time
	var acuuid = requestJSON.cookies["ac.uuid"];
	if(acuuid != null) {
		acuuidvalue = acuuid.value;
	} else {
		acuuidvalue = "";
	}
	addStringEnvAttr("ac.uuid",acuuidvalue, JSONBody);
	
	return JSONBody;
}
