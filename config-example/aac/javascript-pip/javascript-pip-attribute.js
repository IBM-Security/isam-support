/*
	File Name : javascript-pip-attribute.js
	Author : Jack Yarborough
	Contact : jcyarbor@us.ibm.com
	
	Usage : This PIP JavaScript is designed to perform the following : 
		- Retrieve and encode the user's session index as a key for the DMAP cache
		- Retrieve previously stored values if they exist in the cache
		- Retrieve the Database PIP Value from the Database if it does not exist in the DMAP Cache
		- Store the Database PIP Value in the DMAP Cache for later use
		
	**This JavaScript mapping rule is provided as-is and is supported by the author.
	** All variable names, attribute names, and logic are provided as an example
	
	Please refer to the following documentation for a complete list of classes that are available for use in JavaScript PIP Mapping rules : 
		- https://www.ibm.com/support/knowledgecenter/en/SSPREK_9.0.7/com.ibm.isam.doc/config/concept/con_otp_customize_mapping_rules_gs_aac.html
*/
importPackage(com.tivoli.am.rba.extensions);
importClass(Packages.com.tivoli.am.rba.attributes.AttributeIdentifier);
importPackage(com.tivoli.am.fim.trustserver.sts.utilities);

function hasAttribute (requestedAttribute, category) {
	PluginUtils.trace("entering "+instanceName+".hasAttribute()");
	
	var issuerId = instanceName;

	if (issuerId.equals(requestedAttribute.getIssuer()))
	{
	     return true;
	}
	PluginUtils.trace("exiting "+instanceName+".hasAttribute()");
	return false;
}

function getAttributes (context, requestedAttribute, category) {
	PluginUtils.trace("entering "+instanceName+".getAttributes()");
		
	// Get the DMAP Cache Time To Live from the JavaScript PIP Properties
	var cacheTTL = config.get("cacheTTL");
	
	// If there's not a property specified, we'll just store it for an hour
	if(cacheTTL == null){
		cacheTTL = 3600;
	}

	// Retrieve the ISAM User Session Index to use as the DMAP Cache key
	var userSessionIndex = context.getAttribute(Attribute.Category.SUBJECT, new AttributeIdentifier("tagvalue_session_index", "http://www.w3.org/2001/XMLSchema#string", null));
	
	// Normalize the User Session Index to remove special characters
	var userSessionIndexHash = PluginUtils.encodeBase64(userSessionIndex[0]);
	PluginUtils.trace("Value of the Normalized Key : " + userSessionIndexHash);

	// Get an instance of the DMAP Cache
	var cache = IDMappingExtUtils.getIDMappingExtCache();
	
	// Create a place holder for the DB PIP Value
	var dbPipValue = null;
	
	// Create a marker to determine whether we need to store the attribute in the cache. By default we'll assume it's not from the cache.
	var fromCache = false;
	
	// Getting the Database PIP value from the PIP every time is not performant. To minimize calls we'll check to see if it's in the cache first.
	// Check to see whether the Database PIP exists in the DMAP
	if(cache.exists(userSessionIndexHash)) {
		// It exists, so get the value from the cache
		dbPipValue = cache.get(userSessionIndexHash);
		fromCache = true;
	} else{
		// If you've made it here, the PIP value did not exist in the DMAP cache either because one has never been inserted or it's hit its TTL value
		// Retrieve the Database PIP Value from the Authorization Context which will invoke the Database PIP to make a callout to the database
		/* We do this by performing a 'getAttribute' call for a 'Subject' attribute with the Identifier of : 
			- URN
			- Datatype
			- Issuer
		
			These are based off of how you have created your attribute at 'Secure Access Control -> Policy -> Attributes'
		*/
		dbPipValue = context.getAttribute(Attribute.Category.SUBJECT, new AttributeIdentifier("urn:attrtest:dbrole","http://www.w3.org/2001/XMLSchema#string","attrtest"))[0];
	}
	
	// Trace out the attribute for good measure
	PluginUtils.trace("urn:attrtest:dbrole : " + dbPipValue);
	
	// If the Database PIP Value is not null...
	if(dbPipValue != null){
		// Add a value for the AAC JavaScript PIP Attribute into the AAC Authorization Context currenlty being evaluated
		context.addAttribute(new AttributeIdentifier("urn:jspip:jspipattribute", "http://www.w3.org/2001/XMLSchema#string", requestedAttribute.getIssuer()), [dbPipValue]);
		
		// If we have a non-null and non-empty Session Index Hash and we didn't get the DB PIP Value from the cache, store it
		if((userSessionIndexHash != null && userSessionIndexHash != "") && !fromCache){
			// Store the value in the cache with a lifetime specified in the PIP Properties with a default of '3600' seconds.
			cache.put(userSessionIndexHash, dbPipValue, cacheTTL);
		}
	} else {
		PluginUtils.trace("WARNING :: Could not get attribute from the database or the DMAP Cache");
	}

	PluginUtils.trace("exiting "+instanceName+".getAttributes()");
}
