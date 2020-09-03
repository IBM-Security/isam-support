<!--
Author: Nick Lloyd
Email:  nlloyd@us.ibm.com
Add the following to the Reverse Proxy config after importing the rule.
[http-transformations]
vhj-to-stdjct = request-switch-from-vhj-to-stdjct.xslt
[http-transformations:vhj-to-stdjct]
request-match = request:[www.vhj.org]GET /LRR/passwordreset*
-->

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
      <xsl:when test="contains(@name, 'host')">
        <Header action="update" name="host">webseal.example.org</Header>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
