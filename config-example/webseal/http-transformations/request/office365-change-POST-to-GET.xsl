<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0" xmlns:external="http://xsltfunctions.isam.ibm.com">

<!--
	This is a template stylesheet which should be used as a guide when
	using WebSEAL's HTTP Transformation engine. This sample is relevant to
	a request only.
-->

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

			<!--  Set the ACL bits which are to be used in the
                              authorization decision.  Output should be in the 
                              form
				<AclBits>r</AclBits>
			if required. -->

		</HTTPRequestChange>
	</xsl:template>

	<!--
		Match on the Method. Any Method processing should happen within this
		template.
	-->
	<xsl:template match="//HTTPRequest/RequestLine/Method">
		<xsl:choose>
			<xsl:when test="@node() = 'POST'">
				<METHOD action="update">GET</METHOD>
			</xsl:when>
			<xsl:otherwise />
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
