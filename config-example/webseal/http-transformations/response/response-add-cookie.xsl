<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPResponseChange>
      <xsl:apply-templates />
    </HTTPResponseChange>
  </xsl:template>

<-- Uncomment this if you don't need JavaScript to access the cookie
  <xsl:template match="//HTTPResponse/Cookies">
    <Cookie action="add" name="COOKIE_NAME">
      <Secure>1</Secure>
	    <Content>VALUE</Content>
	    <Path>/</Path>
      <HTTPOnly>1</HTTPOnly>
	  </Cookie>
  </xsl:template>
-->

<-- Uncomment this if you need to allow JavaScript to access the cookie
  <xsl:template match="//HTTPResponse/Cookies">
    <Cookie action="add" name="COOKIE_NAME">
      <Secure>1</Secure>
	    <Content>VALUE</Content>
	    <Path>/</Path>
      <HTTPOnly>0</HTTPOnly>
	  </Cookie>
  </xsl:template>
-->

</xsl:stylesheet>
