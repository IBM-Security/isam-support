--[[
Usage:
This rule when matched for a specified request will replace the first occurrence
of the pattern with the specified value.

Add the following to the Reverse Proxy config after importing the rule.
[http-transformations]
modify-uri = request-modify-uri.lua
[http-transformations:modify-uri]
request-match = request:GET /path/to/modify/file.ext*
]]

-- Control.trace(9,Control.dumpContext())

-- When specifying a pattern, you must escape certain characters such as - and . with %
pat="/modify%-uri%.html"
if string.match(HTTPRequest.getURL(),pat) then
--   string.gsub(string, pattern, replaceWith [,replaceFirstNumOccurrences])
   HTTPRequest.setURL(string.gsub(HTTPRequest.getURL(),pat,"/new-modify-uri.html",1))
end
-- If you need to filter all pattern matched strings, then try following:
--   pat="modify%-uri%.html"
--   if string.match(HTTPRequest.getURL(),pat) then
--      HTTPRequest.setURL(string.gsub(HTTPRequest.getURL(),pat,"new-modify-uri.html"))
--   end
