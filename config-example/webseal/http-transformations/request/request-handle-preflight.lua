Control.trace(9,Control.dumpContext())

-- header names can be retrieved by lower cases
if HTTPRequest.getHeader('origin') == 'https://isam.level2.org' and HTTPRequest.getMethod() == "OPTIONS" then
   HTTPResponse.setHeader("Access-Control-Allow-Origin","https://isam.level2.org")
   HTTPResponse.setHeader("Access-Control-Max-Age","86400")
   HTTPResponse.setHeader("Access-Control-Allow-Credentials","true")
   HTTPResponse.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS,GET")
   HTTPResponse.setStatusCode(200)
   HTTPResponse.setStatusMsg("OK")
   HTTPResponse.setBody("Hi")
   Control.responseGenerated(true)
end
