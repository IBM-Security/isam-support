<?xml version="1.0" encoding="UTF-8"?>
<!-- request-handle-large-headers-and-cookies.xslt -->
<!-- Author : jcyarbor@us.ibm.com -->
<!-- This is intended to be an example of how to redirect a request that contains headers and cookies
		over a specified size in 'bytes'.
		
		Some applications cannot handle requests over a certain size and the following will redirect to 
    prevent errors in the backend application.
    
    You can customize the 'HTTPResponseChange' and value in the 'xsl:when' 'test' to be whatever you need.
    
    This can also be extended to check the sizes of certain headers, etc.
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">

	<!-- Firstly, strip any space elements -->
	<xsl:strip-space elements="*" />

	<xsl:template match="/">
		<xsl:variable name="header-and-cookie-size"><xsl:call-template name="size-of-headers-and-cookies" /></xsl:variable>
		<xsl:choose>
			<xsl:when test="number($header-and-cookie-size) > 8192">
				<HTTPResponseChange action="replace">
					<Header name="Location" action="add">/errorpage.html</Header>
					<Version>HTTP/1.1</Version>
					<StatusCode>301</StatusCode>
					<Reason>OK</Reason>
					<Body>Oops! We're redirecting to protect our app</Body>
				</HTTPResponseChange>
			</xsl:when>
		</xsl:choose>
		<HTTPRequestChange>
			<xsl:apply-templates />
		</HTTPRequestChange>
	</xsl:template>
	
	<xsl:template name="size-of-headers-and-cookies">
		<xsl:variable name="size-of-headers" select="string-length(//HTTPRequest/Headers)" />
		<xsl:variable name="size-of-cookies" select="string-length(//HTTPRequest/Cookies)" />
		<xsl:value-of select="$size-of-cookies + $size-of-headers" />
	</xsl:template>

</xsl:stylesheet>
