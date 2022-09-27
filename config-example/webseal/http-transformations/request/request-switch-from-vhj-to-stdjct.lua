--[[
Add the following to the Reverse Proxy config after importing the rule.
[http-transformations]
vhj-to-stdjct = request-switch-from-vhj-to-stdjct.lua
[http-transformations:vhj-to-stdjct]
request-match = request:[www.vhj.org]GET /LRR/passwordreset*
]]

HTTPRequest.setHeader('host', 'webseal.example.org')
