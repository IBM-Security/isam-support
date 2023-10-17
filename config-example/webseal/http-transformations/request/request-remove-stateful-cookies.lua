local reqCookies = HTTPRequest.getCookieNames()

for _,name in pairs(reqCookies) do
	found = string.find(name, "PD_STATEFUL")
	if found ~= nil then
		HTTPResponse.setCookie(name,"expired; Path=/; Expires=Sun, 01-Jan-1995 01:00:00 GMT; HTTPOnly; Secure")
	end
end
