<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPResponseChange>
      <xsl:apply-templates />
    </HTTPResponseChange>
  </xsl:template>

  <xsl:template match="//HTTPResponse/Headers">
    <xsl:variable name="originvalue" select="//HTTPResponse/HTTPRequest/Headers/Header[@name='origin']/node()" />
    <xsl:choose>
	  <xsl:when test="not($originvalue)"/>
	  <xsl:otherwise>
		<xsl:choose>
		<xsl:when test="Header/@name='access-control-allow-origin'"/>
		<xsl:otherwise>
			<Header action="add" name="access-control-allow-origin"><xsl:value-of select="$originvalue" /></Header>
		</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
			<xsl:when test="Header/@name='access-control-allow-methods'"/>
		<xsl:otherwise>
			<Header action="add" name="access-control-allow-methods">GET,POST,OPTIONS</Header>
		</xsl:otherwise>
		</xsl:choose>
		<xsl:choose>
		<xsl:when test="Header/@name='access-control-max-age'"/>
		<xsl:otherwise>
			<Header action="add" name="access-control-max-age">86400</Header>
		</xsl:otherwise>
		</xsl:choose>
		</xsl:otherwise>
	</xsl:choose>
  </xsl:template>
</xsl:stylesheet>
