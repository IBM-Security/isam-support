<?xml version="1.0" encoding="UTF-8"?>
<!-- request-remove-non-whitelisted-cookies.xslt -->
<!-- Author : jcyarbor@us.ibm.com -->
<!-- This HTTP Transformation removes cookies if they are not in a pre-determined whitelist.
		
		Some applications cannot handle requests over a certain size and the following will remove cookies
    to keep the headers size at a minimum value.
    
    You can customize the 'whitelist' variable to allow cookies to pass to ISAM.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">

	<!-- Firstly, strip any space elements -->
	<xsl:strip-space elements="*" />

	<!--
		Perform a match on the root of the document. Output the required
		HTTPRequestChange elements and then process templates.
	-->
	<xsl:template match="/">
		<HTTPRequestChange>
			<xsl:apply-templates />

			<!--  Perform Object Name processing here. Output should be in the form
				<ObjectName>VALUE</ObjectName>
			if required. -->
		</HTTPRequestChange>
	</xsl:template>
	
	<xsl:template match="//HTTPRequest/Cookies/Cookie">
		<!--Put the cookies you want to go to the backend in the 'whitelist'-->
		<!--Be sure to whitelist the session and failover cookies since the HTTP transformation happens before the session cookie is read-->
		<xsl:variable name="whitelist" select="'pd-s-session-id.pd-id.jsessionid.appcookie'" />
		<xsl:variable name="lowercase" select="'abcdefghijklmnopqrstuvwxyz'" />
		<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
		<xsl:variable name="normalized" select="translate(@name, $uppercase, $lowercase)" />
		<xsl:if test="not(contains($whitelist, $normalized))" >
			<Cookie action="remove" name="{@name}" />
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>
