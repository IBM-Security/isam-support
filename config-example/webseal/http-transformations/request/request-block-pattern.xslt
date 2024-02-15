<?xml version="1.0" encoding="UTF-8"?>

<!--	
	Author: Nick Lloyd
	Email: nlloyd@us.ibm.com
	Use case: Block requests with a specific pattern.  Replace YOUR_PATTERN_HERE with some pattern.
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:external="http://xsltfunctions.isam.ibm.com">
  <xsl:strip-space elements="*" />
  
  <xsl:template match="/">
    <HTTPRequestChange>
      <xsl:apply-templates />  
    </HTTPRequestChange>
  </xsl:template>

  <xsl:template match="//HTTPRequest/RequestLine">
    <xsl:choose>
      <xsl:when test="external:matches(URI, 'YOUR_PATTERH_HERE')">
        <HTTPResponseChange action="replace">
          <Version>HTTP/1.1</Version>
          <StatusCode>302</StatusCode>
          <Reason>Found</Reason>
          <Header action="add" name="location">https://webseal/blocked.html/</Header>
          <Body>Sorry, bad request.</Body>
	     </HTTPResponseChange>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
