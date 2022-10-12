<?xml version="1.0" encoding="UTF-8"?>
<!--
Author: Nick Lloyd
Email:  nlloyd@us.ibm.com
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

	<xsl:strip-space elements="*" />


	<xsl:variable name="varURIGlobal">
		<xsl:value-of select="//HTTPRequest/RequestLine/URI"/>
	</xsl:variable>

  <xsl:template match="/">
    <HTTPRequestChange>
      <xsl:apply-templates />
    </HTTPRequestChange>
  </xsl:template>

	<xsl:template match="//HTTPRequest/RequestLine/URI">
			<xsl:variable name="a" select="substring-after($varURIGlobal, '/')" />
			<xsl:variable name="junctionName" select="substring-before($a, '/')" />
			<xsl:variable name="theRest" select="substring-after($a, '/')" />

	<xsl:variable name="junctionNameLower">
      <xsl:call-template name="to-lower-case">
        <xsl:with-param name="text" select="$junctionName" />
      </xsl:call-template>
	</xsl:variable>

	<xsl:choose>
	<xsl:when test="$junctionNameLower='dashboard'">
			<URI action="update" name="{@name}"><xsl:value-of select="concat('/dashboard/', $theRest)" /></URI>
      </xsl:when>
	</xsl:choose>

  <xsl:template name="to-lower-case">
    <xsl:param name="text" />
    <xsl:variable name="lowercase" select="'abcdefghijklmnopqrstuvwxyz'" />
    <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
    <xsl:value-of select="translate($text, $uppercase, $lowercase)" />
  </xsl:template>

</xsl:stylesheet>
