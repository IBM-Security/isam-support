
if HTTPResponse.getStatusCode() == 200 then
   HTTPResponse.setStatusCode(302)
   HTTPResponse.setStatusMsg("Found")
   HTTPResponse.setHeader("location","https://www.example.org/pkmslogout")
end


--[[
original comments in xslt:

Author: Nick Lloyd
Email:  nlloyd@us.ibm.com
Add the following to the Reverse Proxy config after importing the rule.

[http-transformations]
redirect-pkmslogout = response-redirect-to-pkmslogout.xslt

[http-transformations:redirect-pkmslogout]
request-match = response:GET /dashboard/logout*
]]
