Control.trace(9,Control.dumpContext())
--[[
Add the following to the Reverse Proxy config after importing the rule.
[http-transformations]
vhj-to-stdjct = request_switch_from_vhj_to_stdjct_using_302.lua
[http-transformations:vhj-to-stdjct]
request-match = request:[www.vhj.org]GET /LRR/passwordreset*
]]
-- header names can be retrieved by lower cases
HTTPResponse.setStatusCode(302)
HTTPResponse.setStatusMsg("Found")
HTTPResponse.setHeader("location","https://webseal.example.org/LRR/passwordreset.html")
HTTPResponse.setBody("Redirecting To Password Reset")
Control.responseGenerated(true)

