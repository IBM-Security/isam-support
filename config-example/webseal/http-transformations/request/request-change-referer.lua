
if HTTPRequest.containsHeader("referer") then
   r=HTTPRequest.getHeader("referer")
   s=string.gsub(r,"isam9010%-web","isam9010-replace")
   HTTPRequest.setHeader("referer", s)
end
