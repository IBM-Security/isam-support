<?xml version="1.0" encoding="UTF-8"?>
<!--
Author: Nick Lloyd
Email:  nlloyd@us.ibm.com
Usage:  Rewrites vhj.org with a 301 to www.vhj.org.  Requires two VHJ.
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

  <xsl:template match="//HTTPRequest/Headers">
    <xsl:apply-templates select="//HTTPRequest/Headers/Header" />
  </xsl:template>

  <xsl:template match="//HTTPRequest/Headers/Header">
    <xsl:variable name="varHeader">
      <xsl:value-of select="@name"/>
    </xsl:variable>
    
    <xsl:variable name="varHeaderLower">
      <xsl:call-template name="to-lower-case">
        <xsl:with-param name="text" select="$varHeader" />
      </xsl:call-template>
    </xsl:variable>

    <xsl:choose>
      <xsl:when test="$varHeaderLower='host'">
	<xsl:variable name="varHostValue">
	  <xsl:value-of select="node()"/>
	</xsl:variable>
	<xsl:call-template name="check-host">
          <xsl:with-param name="oheader" select="$varHeaderLower"/>
          <xsl:with-param name="ovalue" select="$varHostValue"/>
	</xsl:call-template>
      </xsl:when>
    </xsl:choose>
  </xsl:template>  

  <xsl:template name="to-lower-case">
    <xsl:param name="text" />
    <xsl:variable name="lowercase" select="'abcdefghijklmnopqrstuvwxyz'" />
    <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
    <xsl:value-of select="translate($text, $uppercase, $lowercase)" />
  </xsl:template>

  <xsl:template name="check-host">
    <xsl:param name="oheader"/>
    <xsl:param name="ovalue"/>
    <xsl:choose>
      <xsl:when test="$oheader='host' and $ovalue='vhj.org'">
	<HTTPResponseChange action="replace">
          <Header name="Location" action="add">https://www.vhj.org<xsl:value-of select="$varURIGlobal"/></Header>
          <Version>HTTP/1.1</Version>
          <StatusCode>301</StatusCode>
          <Reason>OK</Reason>
	  <Body>Redirecting to www.vhj.org</Body>
	</HTTPResponseChange>
      </xsl:when>
    </xsl:choose>
  </xsl:template>
  
</xsl:stylesheet>
