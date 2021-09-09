<?xml version="1.0" encoding="UTF-8"?>
<!--
Author: Nick Lloyd
Email:  nlloyd@us.ibm.com
Usage:  Normalizes incoming request's entire URI.
	For example,
          https://www.level2.org/DasHBoard/helLo.hTML to /dashboard/hello.html
	  https://www.level2.org/DasHBoard/A/B/C/D/E to /dashboard/a/b/c/d/e

Reverse Proxy Config File Setting:

[http-transformations]
request-normalize-uri = request-normalize-uri.xslt

[http-transformations:request-normalize-uri]
request-match = request:GET /*
match-case-insensitive = yes
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
	<xsl:variable name="URItoLower">
		<xsl:call-template name="to-lower-case">
			<xsl:with-param name="text" select="$varURIGlobal" />
		</xsl:call-template>
	</xsl:variable>
      <URI action="update" name="{@name}"><xsl:value-of select="$URItoLower"/></URI>
    </xsl:template>

  <xsl:template name="to-lower-case">
    <xsl:param name="text" />
    <xsl:variable name="lowercase" select="'abcdefghijklmnopqrstuvwxyz'" />
    <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
    <xsl:value-of select="translate($text, $uppercase, $lowercase)" />
  </xsl:template>

</xsl:stylesheet>
