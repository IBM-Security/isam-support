--[[

Use this transform when the AAC Advanced Configuration Property sps.authService.policyKickoffMethod is set to path

Modify the WebSEAL conf file to add the following in the [http-transformations] stanza:

request-o365mex-kickoffpath = request-o365mex-kickoffpath.lua

Then add the following just above the begining of the next stanza in your WebSEAL conf file:

[http-transformations:request-o365mex-kickoffpath]
request-match request:GET /mex HTTP/1.1
match-case-insensitive = yes
]]

content_length=HTTPRequest.getHeader('content-length')

HTTPRequest.setURL('/WST13/sps/authsvc/policy/o365mex')
if HTTPRequest.getHeader('content-type') == 'application/soap+xml; charset=utf-8' then
   HTTPRequest.setHeader('content-type', 'application/xml')
end
