Control.trace(9,Control.dumpContext())

-- count size of headers and cookies
len=0
for key, val in pairs(HTTPRequest.getHeaderNames()) do
   len=len+string.len(val)+string.len(HTTPRequest.getHeader(val))+4 -- ': ' and \d\a
end
len=len+string.len("Cookie: ")+2*#HTTPRequest.getCookieNames() -- 2 -> cookie separator '; ' 
for key, val in pairs(HTTPRequest.getCookieNames()) do
   len=len+string.len(val)+string.len(HTTPRequest.getCookie(val))+1 -- '='
end

Control.trace(9,"header and cookie: " .. len .. " bytes")

if len > 8192 then
   HTTPResponse.setHeader("content-type", "text/plain")
   HTTPResponse.setHeader("Location", "/errorpage.html")
   HTTPResponse.setBody("Oops! We are redirecting to protect our app")
   HTTPResponse.setStatusCode(301)
   HTTPResponse.setStatusMsg("OK")
   
   Control.responseGenerated(true)
end
