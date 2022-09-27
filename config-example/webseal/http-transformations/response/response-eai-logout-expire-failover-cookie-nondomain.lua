

-- The 'name' of the cookie needs to match the value of the 'failover-cookie-name' entry in the applicable Reverse Proxy configuration File
-- Secure flag should be set when 'failover-auth = https' or 'failover-auth = both', or unset when 'failover-auth = http'
HTTPResponse.setCookie("PD-ID","expired; Path=/; Expires=Sun, 01-Jan-1995 01:00:00 GMT; HTTPOnly; Secure")

--[[
(Explanation copied from response-eai-logout-expire-failover-cookie-nondomain.xsl)
		Author: jcyarbor@us.ibm.com
		
		********* DISCLAIMER *********
		This HTTP Transformation only works when the following is set:
		[session]
		...
		resend-webseal-cookies = no
		********************************
	
	
		The intention of this HTTP Transformation is to provide a way to remove failover cookies when performing an EAI logout.
		Currently, Security Access Manager does not remove the failover or session cookies during an EAI logout even if the following are set : 
		
		[session]
		...
		logout-remove-cookie = yes
		
		This transformation is applicable when the following Failover mechanism entries are in place : 
		[failover]
		failover-auth = [http|https|both]
		…
		enable-failover-cookie-for-domain = no
		
		Steps to implement : 
		1) Navigate to 'Secure Web Settings -> Global Settings -> HTTP Transformation
		2) Create an HTTP Transformation Rules File of type 'Response'
		3) Name it 'remove_failover_cookies'
		4) Insert the contents of this HTTP Transformation into the file, save, and deploy changes.
		5) Update the Reverse Proxy with the following configuration : 
		[http-transformations]
		...
		remove_failover_cookies = remove_failover_cookies
		
		[http-transformations:remove_failover_cookies]
		request-match = response:POST /identity/sps/identity/saml20/slo*
		request-match = response:GET /identity/sps/identity/saml20/slo*
		
		The above is an example of removing the cookies for a SAML 2.0 Single Log Out request on the IdP instance.
		
		The same could be accomplished for any response that contains the following header:
		...
		am-eai-server-task: terminate session <value>
		...
		
		You can validate whether a response contains the above header using the 'pdweb.debug' tracing component and searching for 'am-eai-server-task'.
		You can then follow the 'thread(number)' to the request to see the value to use for the request match.
		
]]
