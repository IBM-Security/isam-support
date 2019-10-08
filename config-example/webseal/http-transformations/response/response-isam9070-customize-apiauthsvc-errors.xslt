<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0" xmlns:external="http://xsltfunctions.isam.ibm.com">

<!--
	This HTTP Transformation can only be used at ISAM 9.0.7.0+

	Add this to your Reverse Proxy configuration file using : 
	
	[http-transformations]
	...
	apiauthsvcerrors = response-isam9070-customize-apiauthsvc-errors.xslt
	
	[http-transformations:apiauthsvcerrors]
	request-match = response:GET /mga/sps/apiauthsvc*
	request-match = response:POST /mga/sps/apiauthsvc*
	request-match = response:PUT /mga/sps/apiauthsvc*
	
-->
	<xsl:strip-space elements="*" />

	<xsl:template match="/">
		<HTTPResponseChange>
			<xsl:apply-templates />
		</HTTPResponseChange>
	</xsl:template>

	<xsl:template match="//HTTPResponse/HTTPRequest/RequestLine/URI">
		<xsl:variable name="queryargs" select="substring-after(node(),'?')" />
		<xsl:variable name="method" select="//HTTPResponse/HTTPRequest/RequestLine/Method/node()" />
		<xsl:variable name="content-type" select="//HTTPResponse/HTTPRequest/Headers/Header[@name='content-type']/node()" />
		<xsl:choose>
			<!-- Confirm whether the response is a '400' bad request -->
			<xsl:when test="//HTTPResponse/ResponseLine/StatusCode/node() = '400' ">
				<xsl:choose>
					<!-- When the '/apiauthsvc' request doesn't contain any of the expected query arguments -->
					<xsl:when test="not(contains($queryargs,'StateId')) and not(contains($queryargs,'TransactionId')) and not(contains($queryargs,'PolicyId'))">
						<HTTPResponseChange action="update">
							<Body>%7B%22exceptionMsg%22%3A%22Your%20request%20is%20missing%20the%20query%20arguments%20of%20'PolicyId','StateId',%20or%20'TransactionId'%22%7D</Body>
						</HTTPResponseChange>
					</xsl:when>
					<!-- When there is only a 'StateId' provided and it's invalid -->
					<xsl:when test="contains($queryargs,'StateId') and not(contains($queryargs,'TransactionId')) and not(contains($queryargs,'PolicyId'))">
						<HTTPResponseChange action="update">
							<Body>%7B%22exceptionMsg%22%3A%22The%20request%20has%20provided%20an%20invalid%20'StateId'%20query%20parameter%22%7D</Body>
						</HTTPResponseChange>
					</xsl:when>
					<!-- When there is only a 'TransactionId' provided and it's invalid -->
					<xsl:when test="contains($queryargs,'TransactionId') and not(contains($queryargs,'StateId')) and not(contains($queryargs,'PolicyId'))">
						<HTTPResponseChange action="update">
							<Body>%7B%22exceptionMsg%22%3A%22The%20request%20has%20provided%20an%20invalid%20'TransactionId'%20query%20parameter%22%7D</Body>
						</HTTPResponseChange>
					</xsl:when>
					<!-- When there is only a 'PolicyId' provided and it's invalid -->
					<xsl:when test="contains($queryargs,'PolicyId') and not(contains($queryargs,'StateId')) and not(contains($queryargs,'TransactionId'))">
						<HTTPResponseChange action="update">
							<Body>%7B%22exceptionMsg%22%3A%22The%20request%20has%20provided%20an%20invalid%20'PolicyId'%20query%20parameter%22%7D</Body>
						</HTTPResponseChange>
					</xsl:when>
				</xsl:choose>
			</xsl:when>
			<!-- When non-JSON data is provided on a 'POST' operation -->
			<xsl:when test="//HTTPResponse/ResponseLine/StatusCode/node() = '415' ">
				<HTTPResponseChange action="update">
					<Body>%7B%22exceptionMsg%22%3A%22The%20<xsl:value-of select="$method" />%20did%20not%20send%20JSON%20or%20the%20expected%20'Content-type'%20header%22%7D</Body>
				</HTTPResponseChange>
			</xsl:when>
			<xsl:otherwise />
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
