importPackage(com.tivoli.am.rba.extensions);
importClass(Packages.com.tivoli.am.rba.attributes.AttributeIdentifier);

function hasAttribute (requestedAttribute, category) {
	var issuerId = instanceName;
	
	PluginUtils.trace("entering "+issuerId+".hasAttribute()");

	if (issuerId.equals(requestedAttribute.getIssuer()))
	{
	     return true;
	}
	PluginUtils.trace("exiting "+issuerId+".hasAttribute()");
	return false;
}

function getAttributes (context, requestedAttribute, category) {
	var issuerId = instanceName;
	
	PluginUtils.trace("entering "+issuerId+".getAttributes()");

	// Insert JavaScript PIP logic here

	PluginUtils.trace("exiting "+issuerId+".getAttributes()");
}
