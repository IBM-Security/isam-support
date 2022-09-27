
white_list={"pd-s-session-id","pd-h-session-id","pd-id","jsessionid","appcookie"}
allowed={}
for k, v in pairs(white_list) do
   allowed[v]=HTTPRequest.getCookie(v)
end
HTTPRequest.clearCookies()
for k, v in pairs(allowed) do
   HTTPRequest.setCookie(k,v)
end

