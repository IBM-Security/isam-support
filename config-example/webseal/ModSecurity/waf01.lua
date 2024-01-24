
  --created by Yutaka Kanemoto


Control.trace(5, "waf01: called for " .. HTTPRequest.getURL())

local cname="iam"
if string.match(HTTPRequest.getURL(), "/env.cgi") then
    if HTTPRequest.containsCookie(cname) and string.match(HTTPRequest.getCookie(cname), "admin") then
        Control.trace(5, "waf01: you are admin. not triggered!")
    else
        Control.trace(5, "waf01: you are NOT admin. Triggered!")
        Control.triggerWAF("1,2,5")
    end
end
