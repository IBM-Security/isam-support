<?xml version="1.0" encoding="UTF-8"?>
<!--
Author: Nick Lloyd
Email:  nlloyd@us.ibm.com
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

  <xsl:strip-space elements="*" />
  
  <xsl:variable name="varMethodGlobal">
    <xsl:value-of select="//HTTPRequest/RequestLine/Method"/>
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
      <xsl:when test="$varHeaderLower='origin'">
	<xsl:variable name="varOriginValue">
	  <xsl:value-of select="node()"/>
	</xsl:variable>
	<xsl:call-template name="check-origin">
          <xsl:with-param name="oheader" select="$varHeaderLower"/>
          <xsl:with-param name="ovalue" select="$varOriginValue"/>
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

  <xsl:template name="check-origin">
    <xsl:param name="oheader"/>
    <xsl:param name="ovalue"/>
    <xsl:choose>
      <xsl:when test="$oheader='origin' and $ovalue='https://isam.level2.org' and $varMethodGlobal='OPTIONS'">
	<HTTPResponseChange action="replace">
          <Header name="Access-Control-Allow-Origin" action="add">https://isam.level2.org</Header>
          <Header name="Access-Control-Max-Age" action="add">86400</Header>
          <Header name="Access-Control-Allow-Credentials" action="add">true</Header>
          <Header name="Access-Control-Allow-Methods" action="add">POST,OPTIONS,GET</Header>
          <Version>HTTP/1.1</Version>
          <StatusCode>200</StatusCode>
          <Reason>OK</Reason>
	  <Body>Hi</Body>
	</HTTPResponseChange>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
