<?xml version="1.0" encoding="UTF-8"?>
<!--
Author: Nick Lloyd
Email:  nlloyd@us.ibm.com
Add the following to the Reverse Proxy config after importing the rule.

[http-transformations]
redirect-pkmslogout = response-redirect-to-pkmslogout.xslt

[http-transformations:redirect-pkmslogout]
request-match = response:GET /dashboard/logout*
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:external="http://xsltfunctions.isam.ibm.com">

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPResponseChange>
      <xsl:apply-templates />
    </HTTPResponseChange>
  </xsl:template>

  <xsl:template match="//HTTPResponse/ResponseLine">
    <xsl:choose>
      <xsl:when test="StatusCode='200'">
	<StatusCode>302</StatusCode>
	<Reason>Found</Reason>
	<HTTPResponseChange>
	  <Header action="add" name="location">https://isam9070-web.level2.org/pkmslogout</Header>
	</HTTPResponseChange>
      </xsl:when>
    </xsl:choose>
  </xsl:template>	
</xsl:stylesheet>
