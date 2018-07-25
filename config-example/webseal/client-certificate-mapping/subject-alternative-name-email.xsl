<?xml version="1.0" encoding='UTF-8'?>
<!--
  Author: Serge Vereecke
  Email : serge_vereecke@be.ibm.com
  IBM Security
  Example of a Certificate mapping used with Certificate Authentication.
  Use case : retrieve AlternativeEmail attribute from Certificate (Subject Alternative Name attribute) and use this attribute to perform a user (uid) lookup in the ISAM LDAP .
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:stsuuser="urn:ibm:names:ITFIM:1.0:stsuuser" version="1.0">

    <!-- Required to constrain output of rule evaluation -->
    <xsl:output method="text" omit-xml-declaration="yes" encoding='UTF=8' indent="no"/>

    <!-- Need this to ensure default text node printing is off -->
    <xsl:template match="text()"></xsl:template>

    <!-- Let's make it easier by matching the constant part of our XML name -->
   <xsl:template match="/XMLUMI/stsuuser:STSUniversalUser/stsuuser:AttributeList">
        <!--!<xsl:value-of select="stsuuser:Attribute[@name='AlternativeEmail']/stsuuser:Value"/>! -->
        !userreg base='o=ac' attr='uid'!(mail=<xsl:value-of select="stsuuser:Attribute[@name='AlternativeEmail']/stsuuser:Value"/>)!

    </xsl:template>
</xsl:stylesheet>