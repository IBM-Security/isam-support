<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPRequestChange>
      <xsl:apply-templates />
    </HTTPRequestChange>
  </xsl:template>

  <xsl:template match="//HTTPRequest/Headers">
    <xsl:choose>
      <xsl:when test="Header/@name='THIS_WAS_ADDED'" />
      <xsl:otherwise>
        <Header action="add" name="THIS_WAS_ADDED">ADDED_VALUE</Header>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
