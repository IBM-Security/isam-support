if not HTTPRequest.containsHeader("iv-junction") then
   uri = HTTPRequest.getURL()
   junction = string.match(uri, "/(.-)/");
   HTTPRequest.setHeader("iv-junction", junction)
end
