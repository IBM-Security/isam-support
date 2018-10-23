<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">

	<!-- Firstly, strip any space elements -->
	<xsl:strip-space elements="*" />

	<!--
		Perform a match on the root of the document. Output the required
		HTTPResponseChange elements and then process templates.
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
			<xsl:when test="contains(@name, 'emailAddress')"> 
				<Header action="add" name="email"><xsl:value-of select="node()"/></Header> 
			</xsl:when> 
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
