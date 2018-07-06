<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPResponseChange>
      <xsl:apply-templates />
    </HTTPResponseChange>
  </xsl:template>

  <xsl:template match="//HTTPResponse/Cookies">
    <xsl:if test="Cookie/@name='CookieName'">
      <Cookie action="update" name="CookieName">
        <Secure>1</Secure>
      </Cookie>
    </xsl:if>
  </xsl:template>
</xsl:stylesheet>
