--[[

Use this transform when the AAC Advanced Configuration Property sps.authService.policyKickoffMethod is set to path

Modify the WebSEAL conf file to add the following in the [http-transformations] stanza:

request-stshandler-kickoffpath = request-stshandler-kickoffpath.lua

Then add the following just above the begining of the next stanza in your WebSEAL conf file:

[http-transformations:request-stshandler-kickoffpath]
request-match = request:POST /TrustServerWST12*
match-case-insensitive = yes
]]

content_length=HTTPRequest.getHeader('content-length')

if tonumber(content_length) < 1120 then
   HTTPRequest.setURL('/WST13/sps/authsvc/policy/stshandler')
   if HTTPRequest.getHeader('content-type') == 'application/soap+xml; charset=utf-8' then
      HTTPRequest.setHeader('content-type', 'application/x-www-form-urlencoded')
   end
else
   HTTPRequest.setURL('/TrustServerWST13/services/RequestSecurityToken')
end
