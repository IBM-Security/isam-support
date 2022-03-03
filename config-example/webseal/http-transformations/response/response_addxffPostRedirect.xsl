<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:external="http://xsltfunctions.isam.ibm.com" version="1.0">

  <!-- name: response_addxffPostRedirect.xsl -->
  <!-- author: jcyarbor@us.ibm.com -->

  <xsl:strip-space elements="*" />

  <xsl:template match="/">
    <HTTPResponseChange>
      <xsl:apply-templates />
    </HTTPResponseChange>
  </xsl:template>

  <xsl:template match="//HTTPResponse/Headers">
	<xsl:variable name="uri" select="//HTTPResponse/HTTPRequest/RequestLine/URI/node()" />
	<xsl:variable name="protocol" select="substring-after(substring-before($uri,'&amp;Target='),'p=')" />
	<xsl:variable name="hostname" select="substring-after(substring-before($uri,'&amp;r='),'h=')" />
	<xsl:variable name="path" select="substring-after(substring-before($uri,'&amp;h='),'u=')" />
	<Header action="update" name="am-eai-redir-url"><xsl:value-of select="$protocol" />://<xsl:value-of select="$hostname" /><xsl:value-of select="external:replace($path, '%2F','/')" /></Header>
  </xsl:template>
</xsl:stylesheet>