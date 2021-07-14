/*
*	Name : infomap_authenticate_ulh_custom-properties_LDAP-server-connection.js
*	Author: jcyarbor@us.ibm.com
*
*	Intended Usage:
*		This mapping rule is intended to authenticate against the internal ISAM registry 
*		on a single node ISAM appliance with the following activations:
*			IBM Security Verify Access Base Appliance
*			IBM Security Verify Access Advanced Access Control
*
*		The Java Documentation resides at 'Manage System Settings -> Secure Settings -> File Downloads ->> access_control -> doc -> ISAM-javadoc.zip'
*
*		Line 33 should be updated to reflect the hostname, port, credentials, bind-dn, and bind-pwd for your own environment.
*/
importPackage(Packages.com.ibm.security.access.user);
importPackage(Packages.com.ibm.security.access.server_connections);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.java.util.Properties);

// Get submitted username and password from request
var username = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "username");
var password = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "password");

if(username == null && password == null|| username == null || password == null){
	
	IDMappingExtUtils.traceString("Either the Username, Password, or both were empty values");
	
	success.setValue(false);
	
} else {
	var ulhSearch = new UserLookupHelper();
	var ulhAuth = new UserLookupHelper();
	
	var searchOverrideProperties = new Properties();
	var authOverrideProperties = new Properties();

	var users;
	var foundUserDN = "";
	
	var authResult;

	// This assumes you have a Server Connection of type 'LDAP' configured on your appliance with the name 'AD-Server-Pool'.
	var ldapServerConnection = ServerConnectionFactory().getLdapConnectionByName("AD-Server-Pool");

	var ldapConHosts = ldapServerConnection.getHosts();

	var numHosts = ldapConHosts.length;

	var ldapHosts = [];

	for(var i = 0; i < numHosts; i++){
		var currentHost = ldapConHosts[i];
		
		var bindDn = currentHost.getBindDn();
		var bindPwd = currentHost.getBindDnPwd();
		var hostname = currentHost.getHostname();
		var port = currentHost.getPort();
		
		var isSSL = currentHost.isSsl();
		
		var keystore = "";
		var label = "";
		if(isSSL){
			IDMappingExtUtils.throwSTSException("TLS is not currently supported with user lookup helper. The initialization using 'Custom Properties' requires the keystore passwords and there is not a way to get those passwords at this point in time");
			
		}
		
		// Add to the JSON Array of LDAP hosts.
		ldapHosts[i] = {"BindDn":bindDn,"BindDnPwd":bindPwd,"Hostname":hostname,"Port":port,"isSSL":isSSL,"Keystore":keystore,"KeyLabel":label};
	}
	
	for(host in ldapHosts){
		// Check to see if primary host is configured (it shouldn't be)
		var primaryHost = searchOverrideProperties.getProperty("ldap.svrs");
		
		// If the primary host has not been configured then configure it with the first server in the ldapHosts array
		if(primaryHost == null || primaryHost == ""){
			// Format is : host:port:mode:priority
			// Valid modes:
			//	readwrite, readonly
			//
			// Valid Priority : 1 - 10, where 10 is highest
			searchOverrideProperties.setProperty("ldap.svrs",ldapHosts[host].Hostname+":"+ldapHosts[host].Port+":readwrite:5");
		
			
			// Set the Bind information
			IDMappingExtUtils.traceString("ULH_DEBUG : Bind DN : " + ldapHosts[host].BindDn);
			searchOverrideProperties.setProperty("ldap.bind-dn", ldapHosts[host].BindDn);
			IDMappingExtUtils.traceString("ULH_DEBUG : Bind DN PWD: " + ldapHosts[host].BindDnPwd);
			searchOverrideProperties.setProperty("ldap.bind-pwd", ldapHosts[host].BindDnPwd);
			
		} else {
			// If the primary host exists we simply want the other entries to be readonly replicas at a lower priority
			searchOverrideProperties.setProperty("ldap.replica",ldapHosts[host].Hostname+":"+ldapHosts[host].Port+":readonly:4");
		}
	}
		
	// Set the Access Manager domain to something fake:
	searchOverrideProperties.setProperty("mgmt_domain","fake");
	searchOverrideProperties.setProperty("local_domain","fake");
	
	// Set properties about the search characteristics
	searchOverrideProperties.setProperty("ldap.connection-inactivity","30");
	searchOverrideProperties.setProperty("ldap.follow-referrals","false");
	searchOverrideProperties.setProperty("ldap.max-server-connections","16");

	// Initiate the Search ULH with the above properties.
	ulhSearch.init(searchOverrideProperties);

	if(ulhSearch.isReady()) {
		IDMappingExtUtils.traceString("ULH_DEBUG : Initiation was successful");
		
		// Update 'sAMAccountName' to be whatever you have set for 'basic-user-principal-attribute'
		users = ulhSearch.search("sAMAccountName",username,10);
		if(users != null && users.length >0) {
			for(var i = 0; i < users.length; i++){
				IDMappingExtUtils.traceString("ULH_DEBUG : User found : " + users[i]);
			}
		}
		
		// Attempt to authenticate with the first user returned from the search
		if(users.length == 1) {
			foundUserDN = users[0];
		}		
	}
	
	// Now that the search successfully found a user let's update the Override Properties to authenticate via the user's DN.
	// Initiating the new UserLookupHelper with the new credentials inherently performs authentication.
	
	authOverrideProperties = searchOverrideProperties;
	
	if(foundUserDN != "" && foundUserDN != null){
		authOverrideProperties.setProperty("ldap.bind-dn",foundUserDN);
		
		if(password != null && password != ""){
			authOverrideProperties.setProperty("ldap.bind-pwd",password);
		}
	}
	
	// Now we initialize the 'ulhAuth' to authenticate the user.
	ulhAuth.init(authOverrideProperties);
	
	if(ulhAuth.isReady()) {
		IDMappingExtUtils.traceString("ULH_DEBUG : Authentication succeeded");
		context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "username", username);
		success.setValue(true);
	} else {
		IDMappingExtUtils.traceString("ULH_DEBUG : Authentication did not succeed");
		success.setValue(false);
	}
}
