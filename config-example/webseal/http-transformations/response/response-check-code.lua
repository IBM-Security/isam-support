
local status=HTTPResponse.getStatusCode()

if status==404 or status==500 or status==504 then
   HTTPResponse.setStatusCode(302)
   HTTPResponse.setStatusMsg("Found")
   HTTPResponse.setHeader("location", string.format("https://server.example.org/jct/catchall.html?response=%d", status))
end

