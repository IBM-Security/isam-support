
local mhttputil = require "http.util"
local uri=HTTPRequest.getURL()
local query_args={}
local q=string.find(uri,"?")
if q and q > 0 then
   local qs=string.sub(uri,q+1)
   for name, value in mhttputil.query_args(qs) do
      query_args[name]=value
   end
   local protocol=query_args["p"]
   local hostname=query_args["h"]
   local path    =query_args["u"]
   local redirurl=protocol .. "://" .. hostname .. mhttputil.decodeURIComponent(path)
   if protocol and hostname and path then
      HTTPResponse.setHeader("am-eai-redir-url", redirurl)
   end
end
