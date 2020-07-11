<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPRequestChange>
      <xsl:apply-templates />
    </HTTPRequestChange>
  </xsl:template>

  <xsl:template match="//HTTPRequest/RequestLine/URI">
	<xsl:choose>
		<xsl:when test="//Header[@name='content-length'] &lt; 1120">
			<URI>/WST13/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:stshandler</URI>
		</xsl:when>
		<xsl:otherwise>
			<URI>/TrustServerWST13/services/RequestSecurityToken</URI>
		</xsl:otherwise>
	</xsl:choose>
  </xsl:template>

</xsl:stylesheet>