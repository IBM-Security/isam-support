<?xml version="1.0" encoding="UTF-8"?>
<!--
Author: Nick Lloyd
Email:  nlloyd@us.ibm.com
Usage:  Normalizes incoming requests to match a junction named /dashboard.
        For example, /DasHBoard/hello.html to /dashboard/hello.html
Reverse Proxy Config File Setting:

[http-transformations]
request-normalize-specific-junction = request-normalize-specific-junction.xslt

[http-transformations:request-normalize-specific-junction]
request-match = request:GET /dashboard/*
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
      <xsl:variable name="a" select="substring-after($varURIGlobal, '/')" />
      <xsl:variable name="junctionName" select="substring-before($a, '/')" />
      <xsl:variable name="theRest" select="substring-after($a, '/')" />
      <URI action="update" name="{@name}"><xsl:value-of select="concat('/dashboard/', $theRest)" /></URI>
    </xsl:template>
</xsl:stylesheet>
