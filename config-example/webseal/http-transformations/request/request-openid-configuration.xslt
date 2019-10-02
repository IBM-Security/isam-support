<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
   <!--
    This is a template stylesheet which should be used as a guide when
    using WebSEAL's HTTP Transformation engine. This sample is relevant to
    a request only.
-->
   <!-- Firstly, strip any space elements -->
   <xsl:strip-space elements="*" />
   <!--
        Perform a match on the root of the document. Output the required
        HTTPRequestChange elements and then process templates.
    -->
   <xsl:template match="/">
      <HTTPRequestChange>
         <xsl:apply-templates />
      </HTTPRequestChange>
   </xsl:template>
   <!--
        OIDC Conformance-Example 1.7
        Replacing the URI 'test/.well-known/openid-configuration' with
        '/mga/sps/oauth/oauth20/metadata/OIDCDefinition'
    -->
   <xsl:template match="//HTTPRequest/RequestLine/URI">
      <xsl:variable name="output">
         <xsl:call-template name="string-replace-all">
            <xsl:with-param name="text" select="node()" />
            <xsl:with-param name="replace" select="'test/.well-known/openid-configuration'" />
            <xsl:with-param name="by" select="'/mga/sps/oauth/oauth20/metadata/OIDCDefinition'" />
         </xsl:call-template>
      </xsl:variable>
      <URI>
         <xsl:value-of select="$output" />
      </URI>
   </xsl:template>
   <xsl:template match="//HTTPRequest/Scheme">
      <!--  Is the request http or https -->
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
