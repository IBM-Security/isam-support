if not HTTPRequest.containsHeader("iv-junction") then
   uri = HTTPRequest.getURL()
   junction = string.match(uri, "/(.-)/");
   if junction then
      HTTPRequest.setHeader("iv-junction", junction)
   end
end
