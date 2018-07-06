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
      <xsl:when test="@name = 'referer'">
        <xsl:variable name="output">
          <xsl:call-template name="string-replace-all">
            <xsl:with-param name="text" select="node()" />
            <xsl:with-param name="replace" select="'isam9010-web'" />
            <xsl:with-param name="by" select="'isam9010-replace'" />
          </xsl:call-template>
        </xsl:variable>
        <Header action="update" name="{@name}"><xsl:value-of select="$output" /></Header>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="string-replace-all">
    <xsl:param name="text" />
    <xsl:param name="replace" />
    <xsl:param name="by" />
    <xsl:choose>
      <xsl:when test="contains($text, $replace)">
        <xsl:value-of select="substring-before($text,$replace)" />
        <xsl:value-of select="$by" />
        <xsl:call-template name="string-replace-all">
          <xsl:with-param name="text" select="substring-after($text,$replace)" />
          <xsl:with-param name="replace" select="$replace" />
          <xsl:with-param name="by" select="$by" />
        </xsl:call-template>
      </xsl:when>
      <xsl:otherwise>
        <xsl:value-of select="$text" />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
