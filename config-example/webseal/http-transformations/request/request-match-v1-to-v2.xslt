<?xml version="1.0" encoding="UTF-8"?>

<!--	
	Author: Nick Lloyd
	Email: nlloyd@us.ibm.com
	Use case: Change v1 to v2 for deprecated web services.  Example of regex match and find-and-replace.
  Requirements: ISAM 9.0.7.0 or higher.
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
      <xsl:when test="external:matches(URI, '^/dashboard/cgi-bin/service/v1/.*')">
        <URI><xsl:value-of select="external:replace(URI, '/dashboard/cgi-bin/service/v1/(.*)', '/dashboard/cgi-bin/service/v2/$1')"/></URI>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
