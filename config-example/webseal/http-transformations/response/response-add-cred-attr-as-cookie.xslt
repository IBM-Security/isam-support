<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">

	<!-- Firstly, strip any space elements -->
	<xsl:strip-space elements="*" />

	<!--
		Perform a match on the root of the document. Output the required
		HTTPResponseChange elements and then process templates.
    ---
    
    This HTTP Transformation adds the userid and session index into cookies.
    It shows examples of how the cookie updates should be formatted.
    
    Here is our HTTP Transformation Reference that has examples of updating cookies : 
    
    ---
	-->
	<xsl:template match="/">
		<HTTPResponseChange>
			<xsl:apply-templates />
		</HTTPResponseChange>
	</xsl:template>

  <!--
    In order for the credential attributes to be available to the HTTP Transformation
  -->
	<xsl:template match="//HTTPResponse/Credential/Attributes/Attribute">
		<xsl:choose>
			<xsl:when test="contains(@name, 'AZN_CRED_PRINCIPAL_NAME')">
				<Cookie action="add" name="CUID">
					<Content><xsl:value-of select="node()"/></Content>
					<Path>/</Path>
					<Domain>hyperv.lab</Domain>
					<Expires>Mon, 07 Jun 2021 10:12:14 GMT</Expires>
					<Secure>1</Secure>
					<HTTPOnly>0</HTTPOnly>
				</Cookie>
			</xsl:when>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="contains(@name, 'tagvalue_session_index')">
				<Cookie action="add" name="CSID">
					<Content><xsl:value-of select="node()"/></Content>
					<Path>/</Path>
					<Domain>hyperv.lab</Domain>
					<Expires>Mon, 07 Jun 2021 10:12:14 GMT</Expires>
					<Secure>1</Secure>
					<HTTPOnly>0</HTTPOnly>
				</Cookie>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
