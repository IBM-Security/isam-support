Control.trace(9,Control.dumpContext())
--[[
[http-transformations]
request-normalize-specific-junction = request-normalize-specific-junction.lua

[http-transformations:request-normalize-specific-junction]
request-match = request:GET /dashboard/*
match-case-insensitive = yes
]]
HTTPRequest.setURL(string.gsub(HTTPRequest.getURL(),"^/[^/]+", "/dashboard"))
