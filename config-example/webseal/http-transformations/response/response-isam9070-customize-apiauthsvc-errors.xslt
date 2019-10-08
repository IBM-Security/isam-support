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

	<xsl:template match="//HTTPResponse/HTTPRequest/RequestLine/URI">
		<xsl:choose>
			<!-- Confirm whether the response is a '400' bad request -->
			<xsl:when test="//HTTPResponse/ResponseLine/StatusCode/node() = '400' ">
				<xsl:choose>
					<!-- When the '/apiauthsvc' request doesn't contain any of the expected query arguments -->
					<xsl:when test="not(contains(substring-after(node(),'?'),'StateId')) and not(contains(substring-after(node(),'?'),'TransactionId')) and not(contains(substring-after(node(),'?'),'PolicyId'))">
						<HTTPResponseChange action="update">
							<Body>%7B%22error_code%22%3A%22Your%20request%20is%20missing%20the%20query%20arguments%20of%20'PolicyId','StateId',%20or%20'TransactionId'%22%7D</Body>
						</HTTPResponseChange>
					</xsl:when>
          
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise />
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
