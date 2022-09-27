Control.trace(9,Control.dumpContext())
pat="/modify%-uri%.html"
if string.match(HTTPRequest.getURL(),pat) then
   HTTPRequest.setURL(string.gsub(HTTPRequest.getURL(),pat,"/new-modify-uri.html",1))
end
-- if you need to filter all pattern matched strings, then try following
-- pat="modify%-uri%.html"
-- if string.match(HTTPRequest.getURL(),pat) then
--    HTTPRequest.setURL(string.gsub(HTTPRequest.getURL(),pat,"new-modify-uri.html"))
-- end
