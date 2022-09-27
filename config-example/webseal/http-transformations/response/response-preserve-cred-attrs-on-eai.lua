

local target_attr="credentialattr1"
if Session.containsCredentialAttribute(target_attr) then
   local new_am_eai_xattrs
   if HTTPResponse.containsHeader("am-eai-xattrs") then
      new_am_eai_xattrs=HTTPResponse.getHeader("am-eai-xattrs") .. ", " ..  target_attr
   else
      new_am_eai_xattrs=target_attr
   end
   HTTPResponse.setHeader("am-eai-xattrs", new_am_eai_xattrs)
   HTTPResponse.setHeader(target_attr, Session.getCredentialAttribute(target_attr))
end

--[[
Original: preserveCredAttrsOnEAI.xsl
Original Author : jcyarbor@us.ibm.com
This is intended to be an example of how to edit the EAI response headers to account 
for credential attributes being overwritten when multiple EAIs are in play

When an EAI Authentication is performed all the Credential Attributes are overwritten.
This can cause issues and unexpected behavior if you are invoking AAC Policy or another
mechanism that is dependent on the presence of certain Credential Attributes

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

]]
