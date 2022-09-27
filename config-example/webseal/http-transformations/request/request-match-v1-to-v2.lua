Control.trace(9,Control.dumpContext())

-- "-" needs to be escaped by %
m=string.match(HTTPRequest.getURL(),'^/dashboard/cgi%-bin/service/v1/(.*)')
if m then
   HTTPRequest.setURL('/dashboard/cgi-bin/service/v2/'..m)
end
