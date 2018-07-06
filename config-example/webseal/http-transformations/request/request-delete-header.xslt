<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPRequestChange>
      <xsl:apply-templates />
    </HTTPRequestChange>
  </xsl:template>

  <xsl:template match="//HTTPRequest/Headers">
    <xsl:apply-templates select="//HTTPRequest/Headers/Header" />
  </xsl:template>

  <xsl:template match="//HTTPRequest/Headers/Header">
    <xsl:choose>
      <xsl:when test="contains(@name, 'this_was_removed')">
        <Header action="remove" name="this_was_removed"><xsl:value-of select="node()" /></Header>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
