
if not HTTPRequest.containsHeader("hatch") then
   HTTPRequest.setHeader("hatch", HTTPRequest.getURL())
end
