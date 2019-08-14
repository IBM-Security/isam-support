<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

<xsl:comment> Declare a variable named varUriGlobal. Assign the value of //HTTPRequest/RequestLine/URI </xsl:comment>
  
  <xsl:variable name="varUriGlobal">
    <xsl:value-of select="//HTTPRequest/RequestLine/URI"/>
  </xsl:variable>
  
  
  <xsl:template match="/">
    <HTTPRequestChange>
      <xsl:apply-templates />
    </HTTPRequestChange>
  </xsl:template>
  
<xsl:comment> Test to determine if the header named hatch already exists. If it does not exist, then add a header named hatch and the value is the variable varUriGlobal </xsl:comment>
  
  <xsl:template match="//HTTPRequest/Headers">
    <xsl:choose>
      <xsl:when test="Header/@name='hatch'" />
      <xsl:otherwise>
        <Header action="add" name="hatch"><xsl:value-of select="$varUriGlobal"/></Header>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
