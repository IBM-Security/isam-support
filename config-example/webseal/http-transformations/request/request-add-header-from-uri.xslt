<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

  
  <xsl:variable name="varUriGlobal">
    <xsl:value-of select="//HTTPRequest/RequestLine/URI"/>
  </xsl:variable>
  
  
  <xsl:template match="/">
    <HTTPRequestChange>
      <xsl:apply-templates />
    </HTTPRequestChange>
  </xsl:template>
  

  <xsl:template match="//HTTPRequest/Headers">
    <xsl:choose>
      <xsl:when test="Header/@name='hatch'" />
      <xsl:otherwise>
        <Header action="add" name="hatch"><xsl:value-of select="$varUriGlobal"/></Header>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
