<?xml version="1.0" encoding="UTF-8"?>
<!-- preserveCredAttrsOnEAI.xsl -->
<!-- Author : jcyarbor@us.ibm.com -->
<!-- This is intended to be an example of how to edit the EAI response headers to account 
		for credential attributes being overwritten when multiple EAIs are in play
		
		When an EAI Authentication is performed all the Credential Attributes are overwritten.
		This can cause issues and unexpected behavior if you are invoking AAC Policy or another
		mechanism that is dependent on the presence of certain Credential Attributes
-->
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">

<!--
	This is a template stylesheet which should be used as a guide when
	using WebSEAL's HTTP Transformation engine. This sample is relevant to
	a response only.
-->

<!-- 
The following are the XML that this rule was based on : 

<?xml version="1.0" encoding='UTF-8'?>
<HTTPResponse>
	<Credential>
		<Attributes>
			<Attribute name="authenticationTypes">urn:ibm:security:authentication:asf:eula</Attribute>
		</Attributes>
	</Credential>
	<ResponseLine>
		<Version>HTTP/1.1</Version>
		<StatusCode>302</StatusCode>
		<Reason>Found</Reason>
	</ResponseLine>
	<Headers>
		<Header name="content-length">0</Header>
		<Header name="date">Wed, 30 Jan 2019 01:02:00 GMT</Header>
		<Header name="location">https://rp.hyperv.lab/eaiSSL/</Header>
		<Header name="tagvalue_attr1">value1</Header>
		<Header name="am-eai-user-id">juser</Header>
		<Header name="am-eai-auth-level">3</Header>
		<Header name="tagvalue_attr2">value2</Header>
		<Header name="am-eai-redir-url">/junction/</Header>
		<Header name="am-eai-xattrs">tagvalue_attr1,tagvalue_attr2,tagvalue_attr3</Header>
		<Header name="tagvalue_attr3">value3</Header>
	</Headers>
	<Cookies/>
</HTTPResponse>

You can get this document using the 'pdweb.http.transformations' tracing component

The following configuration entries can be used : 
===
[http-transformations]
eai-res = preserveCredAttrsOnEAI.xsl

[http-transformations:eai-res]
cred-attr-name = credentialattr1
request-match = response:POST /eaijct/eaiendpoint
===

When implementing this you'd substitute 'credentialattr1' for the actual ISAM Credential Attribute that you want to preserve.

-->
	<!-- Firstly, strip any space elements -->
	<xsl:strip-space elements="*" />

	<!--
		Perform a match on the root of the document. Output the required
		HTTPResponseChange elements and then process templates.
	-->
	<xsl:template match="/">
		<HTTPResponseChange>
			<xsl:apply-templates />
		</HTTPResponseChange>
	</xsl:template>

	<xsl:template match="//HTTPResponse/Credential/Attributes">
		<xsl:choose>
			<!-- Test that the desired credential attribute is not null or empty, such that you are only updating the EAI response if the attribute existed in the first place -->
			<xsl:when test="(Attribute[@name='credentialattr1'] != ' ') and (Attribute[@name='credentialattr1'] != '')">
				<!-- Update the Extra Attributes header -->
				<Header name="am-eai-xattrs" action="update">tagvalue_eai_hdr_compliance,tagvalue_eai_hdr-pswd,tagvalue_eai_hdr-encr,credentialattr1</Header>
				<!-- Create the header that holds the value of the credential attribute -->
				<Header name="credentialattr1" action="add"><xsl:value-of select="Attribute[@name='credentialattr1']" /></Header>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
