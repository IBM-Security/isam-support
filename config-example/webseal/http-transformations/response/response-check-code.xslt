<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:strip-space elements="*" />
  
  <xsl:template match="/">
    <HTTPResponseChange>
      <xsl:apply-templates />
    </HTTPResponseChange>
  </xsl:template>

  <xsl:template match="//HTTPResponse/ResponseLine">
    <xsl:choose>
      <xsl:when test="StatusCode='404'">
	<StatusCode>302</StatusCode>
	<Reason>Found</Reason>
	<HTTPResponseChange>
	  <Header action="add" name="location">https://server.example.org/jct/catchall.html?response=404</Header>
	</HTTPResponseChange>
      </xsl:when>
      <xsl:when test="StatusCode='500'">
	<StatusCode>302</StatusCode>
	<Reason>Found</Reason>
	<HTTPResponseChange>
	  <Header action="add" name="location">https://server.example.org/jct/catchall.html?response=500</Header>
	</HTTPResponseChange>
      </xsl:when>
      <xsl:when test="StatusCode='504'">
	<StatusCode>302</StatusCode>
	<Reason>Found</Reason>
	<HTTPResponseChange>
	  <Header action="add" name="location">https://server.example.org/jct/catchall.html?response=504</Header>
	</HTTPResponseChange>
      </xsl:when>
    </xsl:choose>
  </xsl:template>
  
</xsl:stylesheet>
