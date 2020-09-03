<!--
Author: Nick Lloyd
Email:  nlloyd@us.ibm.com
Add the following to the Reverse Proxy config after importing the rule.
[http-transformations]
vhj-to-stdjct = request_switch_from_vhj_to_stdjct_using_302.xslt
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

  <xsl:template match="//HTTPRequest">
	<HTTPResponseChange action="replace">
          <Version>HTTP/1.1</Version>
          <StatusCode>302</StatusCode>
          <Reason>Found</Reason>
          <Header action="add" name="location">https://isam9070-web.level2.org/LRR/passwordreset.html</Header>
          <Body>Redirecting To Password Reset</Body>
	</HTTPResponseChange>
  </xsl:template>
    
</xsl:stylesheet>