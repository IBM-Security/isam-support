host = HTTPRequest.getHeader("host");
if (host) then
   HTTPRequest.setHeader("source_host", host);
end
