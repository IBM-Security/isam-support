Control.trace(9,Control.dumpContext())
pat="/modify%-uri%.html"
if HTTPRequest.getCookie('COOKIE_NAME') and string.match(HTTPRequest.getURL(),pat) then
   HTTPRequest.setURL(string.gsub(HTTPRequest.getURL(),pat,"/new-modify-uri.html",1))
end
