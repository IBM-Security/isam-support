<?xml version="1.0" encoding='UTF-8'?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:stsuuser="urn:ibm:names:ITFIM:1.0:stsuuser" version="1.0">

    <xsl:output method="text" omit-xml-declaration="yes" encoding='UTF=8' indent="no"/>
    <xsl:template match="text()"></xsl:template>
    <xsl:template match="/XMLUMI/stsuuser:STSUniversalUser/stsuuser:AttributeList">
    !userreg base='o=IBM' attr='uid'!(departmentNumber=<xsl:value-of select="stsuuser:Attribute[@name='SerialNumber']/stsuuser:Value"/>)!
    </xsl:template>

</xsl:stylesheet>
