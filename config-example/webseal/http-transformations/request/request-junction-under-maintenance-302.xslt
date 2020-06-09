<!--
Author: Nick Lloyd
Email:  nlloyd@us.ibm.com
Add the following to the Reverse Proxy config after importing the rule.

[http-transformations]
under-maintenance = request-junction-under-maintenance-302.xslt

[http-transformations:under-maintenance]
request-match = request:GET /standard-junction/*
request-match = response:[www.vhj.org]GET /*
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
          <Header action="add" name="location">https://www.example.org/jct/under-maintenance.html</Header>
          <Body>Application is under maintenance</Body>
	</HTTPResponseChange>
  </xsl:template>
    
</xsl:stylesheet>
