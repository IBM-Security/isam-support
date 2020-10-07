<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0" xmlns:external="http://xsltfunctions.isam.ibm.com">

	<!-- Firstly, strip any space elements -->
	<xsl:strip-space elements="*" />

	<!-- 
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
		enable-failover-cookie-for-domain = yes
		
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
		
		-->

	<xsl:template match="/">
		<HTTPResponseChange>
			<xsl:apply-templates />
		</HTTPResponseChange>
	</xsl:template>

	<xsl:template match="//HTTPResponse/Cookies">
			<!-- The 'name' needs to match the value of the 'failover-cookie-name' entry in the applicable Reverse Proxy configuration File -->
			<Cookie name="PD-ID" action="add">
					<Content>expired</Content>
					<Path>/</Path>
					<!-- replace 'hyperv.lab' with the Domain of your organization -->
					<Domain>hyperv.lab</Domain>
					<Expires>Sun, 01-Jan-1995 01:00:00 GMT</Expires>
					<HTTPOnly>1</HTTPOnly>
					<!-- This should be set to '1' when 'failover-auth = https' or 'failover-auth = both' and '0' when 'failover-auth = http' -->
					<Secure>1</Secure>
			</Cookie>
	</xsl:template>
</xsl:stylesheet>
