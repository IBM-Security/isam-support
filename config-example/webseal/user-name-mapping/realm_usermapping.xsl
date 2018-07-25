<?xml version="1.0" encoding='UTF-8'?>
<!--
  Author: Serge Vereecke
  Email : serge_vereecke@be.ibm.com
  IBM Security
  User mapping to augment the STSUU XML and hence the iv-cred structure .
  Use case : the Principal (after Certificate authentication) in the STSUU is a CN structure, containing information about the Customer Active Directory Domain.  This information is needed when performing Kerberos SSO.
  This mapping parses the Principal attribute and filters out the Domain Component (DC) information and stores this in a new attribute (acrealm) .
-->

<!--
  This XSLT file is used to control the mapping of an authenticated user to an
  ISAM user identity.

  The input into the rule evaluation will be an XML representation of the 
  authentication data, i.e.
    <?xml version="1.0" encoding='UTF-8'?>

    <XMLUMI>
      <stsuuser:STSUniversalUser xmlns:stsuuser="urn:ibm:names:ITFIM:1.0:stsuuser">
        <stsuuser:Principal>
          <stsuuser:Attribute name="name">    
            <stsuuser:Value>
              - authenticated user identity -
            </stsuuser:Value>
          </stsuuser:Attribute>
        </stsuuser:Principal>
        <stsuuser:AttributeList>
          <stsuuser:Attribute name="-attrname-">
            <stsuuser:Value>-attrvalue-</stsuuser:Value>
          </stsuuser:Attribute>
          ...
        </stsuuser:AttributeList>
      </stsuuser:STSUniversalUser>
    </XMLUMI>

  At a minimum the '-attr-name-' can be one of the following:
    * address
    * qop
    * browser
    * method

  Additional attributes can be provided dependent on the authentication 
  mechanism.  Refer to the documentation for a complete list of supplied 
  attributes.

  The output from the rule will be:
    - an optional identity element: <identity>{value}</identity>
    - 0 or more attribute elements: <attribute name={name}>{value}</attribute>

  The {value} can be either:
    - Free form text, which can also include elements from the source XML
    - An LDAP search, the result of which will be used as the real value. This
      will have the format of:
	    <userreg base='%base%' attr='%name%'>%ldap-search-filter%</userreg>
-->

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:stsuuser="urn:ibm:names:ITFIM:1.0:stsuuser" version="1.0">

    <!-- Required to constrain output of rule evaluation -->
    <xsl:output method="xml" omit-xml-declaration="yes" encoding='UTF=8' indent="no"/>

    <!-- Need this to ensure default text node printing is off -->
    <xsl:template match="text()"></xsl:template>

    <!-- Let's make it easier by matching the constant part of our XML name -->
  <xsl:template match="/XMLUMI/stsuuser:STSUniversalUser/stsuuser:Principal/stsuuser:Attribute [@name='name']">
  <attribute name='acrealm'>
       <xsl:call-template name="tokenize">
        <xsl:with-param name="csv" select="stsuuser:Value" />
      </xsl:call-template>
   </attribute> 
  </xsl:template>


  <xsl:template name="tokenize">
    <xsl:param name="csv" />

    <!-- Version 1.0 does not support upper-case(), this is a work-around -->
    <xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyz'" />
    <xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />

    <xsl:choose>
      <!-- In case csv contains ',' (comma). This means that there are more tokens imbedded in csv. -->
      <xsl:when test="contains($csv, ',')">
        <xsl:variable name="token" select="normalize-space(substring-before($csv, ','))" />
        <xsl:if test="contains($token, 'DC=')">
          <xsl:value-of select="concat(translate(substring-after($token, '='),$smallcase, $uppercase), '.')" />          
        </xsl:if>
      </xsl:when>
      <xsl:otherwise>
        <!-- In case there are no ',' (comma). This is the last token -->
        <xsl:value-of select="translate(substring-after($csv, '='),$smallcase, $uppercase)" />
      </xsl:otherwise>
    </xsl:choose>

    <!-- If there are DC attributes in csv, then tokenize to retrieve the corresponding value -->
    <xsl:if test="contains($csv, 'DC=')">
      <xsl:call-template name="tokenize">
        <xsl:with-param name="csv" select="substring-after($csv,',')" />
      </xsl:call-template>
    </xsl:if>
  </xsl:template>



</xsl:stylesheet>