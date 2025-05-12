for key, val in pairs(HTTPRequest.getCookieNames()) do
  if string.match(val, "_ga") then
    HTTPRequest.removeCookie(val)
  end
end
