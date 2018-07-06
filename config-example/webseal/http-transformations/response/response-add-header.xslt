<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPResponseChange>
      <xsl:apply-templates />
    </HTTPResponseChange>
  </xsl:template>

  <xsl:template match="//HTTPResponse/Headers">
    <xsl:choose>
      <xsl:when test="Header/@name='HEADER_ADDED_BY_ISAM'"/>
      <xsl:otherwise>
        <Header action="add" name="HEADER_ADDED_BY_ISAM">some_value_added_by_isam</Header>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
