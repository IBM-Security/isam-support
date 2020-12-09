<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPRequestChange>
      <xsl:apply-templates />
    </HTTPRequestChange>
  </xsl:template>

  <xsl:template match="//HTTPRequest/Cookies">
    <xsl:if test="Cookie/@name='servicesUrl'">
      <Cookie action="update" name="servicesUrl">%2Fnavigator</Cookie>
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
