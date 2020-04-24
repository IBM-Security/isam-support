<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPResponseChange>
      <xsl:apply-templates />
    </HTTPResponseChange>
  </xsl:template>

  <xsl:template match="//HTTPResponse/Cookies">
    <xsl:if test="Cookie/@name='JSESSIONID'">
      <Cookie action="remove" name="JSESSIONID">
      </Cookie>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>
