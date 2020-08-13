<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPResponseChange>
      <xsl:apply-templates />
    </HTTPResponseChange>
  </xsl:template>

  <xsl:template match="//HTTPResponse/Headers">
    <xsl:apply-templates select="//HTTPResponse/Headers/Header" />
  </xsl:template>

  <xsl:template match="//HTTPResponse/Headers/Header">
    <xsl:choose>
      <xsl:when test="@name = 'am-eai-xattrs'">
        <Header action="update" name="{@name}">AZN_CRED_AUTH_METHOD,AZN_CRED_AUTH_METHOD_INFO</Header>
        <Header action="add" name="AZN_CRED_AUTH_METHOD">oauth</Header>
        <Header action="add" name="AZN_CRED_AUTH_METHOD_INFO">OAuth Authentication</Header>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
