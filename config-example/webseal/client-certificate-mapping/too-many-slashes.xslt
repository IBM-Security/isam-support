<?xml version="1.0" encoding='UTF-8'?>
<!--
Author: Nick Lloyd
Email:  nlloyd@us.ibm.com
IBM Security Access Manager Level II Support
Use case: Certificates with way too many backslashes.

CN=User\, Comma\,OU\=ISAML2\,OU=\Support\,OU\=Security\,O=\IBM\,C\=US  (Cert SubjectDN)
CN=User\, Comma,OU=ISAML2,OU=Support,OU=Security,O=IBM,C=US            (LDAP DN)

CN=Comma User\,OU\=ISAML2\,OU=\Support\,OU\=Security\,O=\IBM\,C\=US    (Cert SubjectDN)
CN=Comma User,OU=ISAML2,OU=Support,OU=Security,O=IBM,C=US              (LDAP DN)
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:stsuuser="urn:ibm:names:ITFIM:1.0:stsuuser" version="1.0">
  
  <xsl:output method="text" omit-xml-declaration="yes" encoding='UTF=8' indent="no"/>
  
  <xsl:template match="text()"></xsl:template>
  
  <xsl:template match="/XMLUMI/stsuuser:STSUniversalUser/stsuuser:AttributeList">
    
    <xsl:variable name="varSubjectDN">
      <xsl:value-of select="stsuuser:Attribute[@name='SubjectDN']/stsuuser:Value"/>
    </xsl:variable>
    
    <xsl:variable name="FRONT">
      <xsl:value-of select="substring-before($varSubjectDN, '\')"/>
    </xsl:variable>
         
    <xsl:variable name="BACK">
      <xsl:value-of select="translate(substring-after($varSubjectDN, '\'), '\', '')"/>
    </xsl:variable>

    <xsl:choose>
      <xsl:when test="contains($FRONT, ' ')">
        !<xsl:value-of select="concat($FRONT, $BACK)"/>!
      </xsl:when>

      <xsl:otherwise>
        !<xsl:value-of select="concat($FRONT, '\', $BACK)"/>!
      </xsl:otherwise>
    </xsl:choose>
           
  </xsl:template>
  
</xsl:stylesheet>
