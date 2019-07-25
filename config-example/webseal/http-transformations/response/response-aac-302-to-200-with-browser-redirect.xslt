<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0" xmlns:external="http://xsltfunctions.isam.ibm.com">

<!--
	This is a template stylesheet which should be used as a guide when
	using WebSEAL's HTTP Transformation engine. This sample is relevant to
	a response only.
-->

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


	<xsl:template match="//HTTPResponse/Headers/Header">
		<xsl:choose>
			<xsl:when test="@name='location'">
				<xsl:variable name="hvalue">
					<xsl:value-of select="node()" />
				</xsl:variable>
				<xsl:choose>
					<xsl:when test="contains($hvalue, 'authsvc')">
						<HTTPResponseChange>
							<StatusCode action="update">200</StatusCode>
							<Reason action="update">OK</Reason>
							<Body>%3Chtml%3E%0D%0A%3Chead%3E%0D%0A%3Ctitle%3ERedirect%20Page%3C%2Ftitle%3E%0D%0A%3Cscript%20type%3D%22text%2Fjavascript%22%3E%0D%0Awindow.location%3D%22<xsl:value-of select='$hvalue' />%22%3B%0D%0A%3C%2Fscript%3E%0D%0A%3C%2Fhead%3E%0D%0A%3Cbody%3E%0D%0ARedirecting%20to%20endpoint%0D%0A%3C%2Fbody%3E%0D%0A%3C%2Fhead%3E%0D%0A%3C%2Fhtml%3E</Body>
						</HTTPResponseChange>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
