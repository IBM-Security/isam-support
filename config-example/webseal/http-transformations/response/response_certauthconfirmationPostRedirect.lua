
local uri=HTTPRequest.getURL()
local q=string.find(uri,"?")
if q and q > 0 then
   local transactionid=string.sub(uri,q+1)
   if string.find(transactionid, "TransactionId") then
      HTTPResponse.setHeader("am-eai-redir-url", "/mga/sps/authsvc?" .. transactionid)
   end
end

--[[
  <!-- name: response_certauthconfirmationPostRedirect.xsl -->
  <!-- author: jcyarbor@us.ibm.com -->
]]
