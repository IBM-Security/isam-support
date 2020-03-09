<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPRequestChange>
      <xsl:apply-templates />
    </HTTPRequestChange>
  </xsl:template>

  <xsl:template match="//HTTPRequest/RequestLine/URI">
    <URI>/WST13/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:o365mex</URI>
  </xsl:template>


</xsl:stylesheet>
