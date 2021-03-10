/*
*	Name : infomap_authenticate_ulh_last-login-support.js
*
*
*
*/
importPackage(Packages.com.ibm.security.access.user);
importPackage(Packages.com.ibm.security.access.server_connections);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.java.util.Properties);

var ulh = new UserLookupHelper();

// Get submitted username and password from request
var username = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "username");
var password = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "password");

var user;
var authResult;

var overridePropertiesULH = new Properties();
overridePropertiesULH.setProperty("ldap.enable-last-login", "true");

// Initiate the user lookup helper using override properties and static data.
ulh.init("localhost",389,"cn=root,secAuthority=Default","passw0rd",null,null,"(|(objectClass=Person)(objectClass=ePerson))","Default",30,false,overridePropertiesULH);

if(username == null && password == null){
	success.setValue(false);
} else {
	if(ulh.isReady()) {
		IDMappingExtUtils.traceString("ULH_DEBUG : Initiation was successful");
		
		user = ulh.getUser(username);
		
		if(user != null) {
			authResult = user.authenticate(password);
		}
	}
	if(authResult) {
		IDMappingExtUtils.traceString("ULH_DEBUG : Authentication succeeded");
		context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "username", username);
		success.setValue(true);
	} else {
		IDMappingExtUtils.traceString("ULH_DEBUG : Authentication did not succeed");
		success.setValue(false);
	}
}