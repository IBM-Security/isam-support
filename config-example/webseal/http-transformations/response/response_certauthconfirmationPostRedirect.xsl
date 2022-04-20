<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:external="http://xsltfunctions.isam.ibm.com" version="1.0">

  <!-- name: response_certauthconfirmationPostRedirect.xsl -->
  <!-- author: jcyarbor@us.ibm.com -->

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPResponseChange>
      <xsl:apply-templates />
    </HTTPResponseChange>
  </xsl:template>

  <xsl:template match="//HTTPResponse/Headers">
	<xsl:variable name="uri" select="//HTTPResponse/HTTPRequest/RequestLine/URI/node()" />
	<xsl:variable name="transactionid" select="substring-after($uri, '?')" />
	<Header action="update" name="am-eai-redir-url">/mga/sps/authsvc?<xsl:value-of select="$transactionid" /></Header>
  </xsl:template>
</xsl:stylesheet>