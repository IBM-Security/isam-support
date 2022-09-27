
local originvalue = HTTPRequest.getHeader("origin")

if originvalue then
   if not HTTPResponse.containsHeader("access-control-allow-origin") then
      HTTPResponse.setHeader("access-control-allow-origin", originvalue)
   end

   if not HTTPResponse.containsHeader("access-control-allow-methods") then
      HTTPResponse.setHeader("access-control-allow-methods", "GET,POST,OPTIONS")
   end

   if not HTTPResponse.containsHeader("access-control-max-age") then
      HTTPResponse.setHeader("access-control-max-age", "86400")
   end

end
