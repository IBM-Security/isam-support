Control.trace(9,Control.dumpContext())

-- header names can be retrieved by lower cases
if HTTPRequest.getHeader('host') == 'vhj.org' then
   HTTPResponse.setHeader("Location", "https://www.vhj.org" .. HTTPRequest.getURL())
   HTTPResponse.setStatusCode(301)
   HTTPResponse.setStatusMsg("OK")
   HTTPResponse.setBody("Redirecting to www.vhj.org")
   Control.responseGenerated(true)
end
