
-- this may need sample configuration for webseald.conf.

content_length=HTTPRequest.getHeader('content-length')

if tonumber(content_length) < 1120 then
   HTTPRequest.setURL('/WST13/sps/authsvc?PolicyId=urn:ibm:security:authentication:asf:stshandler')
   if HTTPRequest.getHeader('content-type') == 'application/soap+xml; charset=utf-8' then
      HTTPRequest.setHeader('content-type', 'application/x-www-form-urlencoded')
   end
else
   HTTPRequest.setURL('/TrustServerWST13/services/RequestSecurityToken')
end
