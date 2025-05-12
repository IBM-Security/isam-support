function string.starts(String,Start)
   return string.sub(String,1,string.len(Start))==Start
end

for key, val in pairs(HTTPRequest.getCookieNames()) do
  if string.starts(val, "_ga") then
    HTTPRequest.removeCookie(val)
  end
end
