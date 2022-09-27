Control.trace(9,Control.dumpContext())
--[[
[http-transformations]
request-normalize-uri = request-normalize-uri.lua

[http-transformations:request-normalize-uri]
request-match = request:GET /*
match-case-insensitive = yes
]]
HTTPRequest.setURL(string.lower(HTTPRequest.getURL()))
