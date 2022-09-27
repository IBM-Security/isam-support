local url=HTTPRequest.getURL()
local queryargs
local pos=string.find(url,'?')
if pos then
   queryargs=string.sub(url,pos+1)
else
   queryargs=""
end

local method=HTTPRequest.getMethod()
local content_type=HTTPRequest.getHeader("content-type")
local status_code=HTTPResponse.getStatusCode()

-- Confirm whether the response is a '400' bad request
if status_code == 400 then
   -- When the '/apiauthsvc' request doesn't contain any of the expected query arguments
   if not string.find(queryargs, "StateId") and not string.find(queryargs, "TransactionId") and not string.find(queryargs,"PolicyId") then
      HTTPResponse.setBody([[{"exceptionMsg":"Your request is missing the query arguments of 'PolicyId','StateId', or 'TransactionId'"}]])

   -- When there is only a 'StateId' provided and it's invalid
   elseif string.find(queryargs, "StateId") and not string.find(queryargs, "TransactionId") and not string.find(queryargs,"PolicyId") then
      HTTPResponse.setBody([[{"exceptionMsg":"The request has provided an invalid 'StateId' query parameter"}]])

   -- When there is only a 'TransactionId' provided and it's invalid
   elseif string.find(queryargs, "TransactionId") and not string.find(queryargs, "StateId") and not string.find(queryargs,"PolicyId") then
      HTTPResponse.setBody([[{"exceptionMsg":"The request has provided an invalid 'TransactionId' query parameter"}]])

   -- When there is only a 'PolicyId' provided and it's invalid
   elseif string.find(queryargs,"PolicyId") and not string.find(queryargs, "StateId") and not string.find(queryargs, "TransactionId") then
      HTTPResponse.setBody([[{"exceptionMsg":"The request has provided an invalid 'PolicyId' query parameter"}]])
   end
   
-- When non-JSON data is provided on a 'POST' operation   
elseif status_code == 415 then
   HTTPResponse.setBody([[{"exceptionMsg":"The ]]..method..[[ did not send JSON or the expected 'Content-type' header"}]])
end

--[[
(Copied from response-isam9070-customize-apiauthsvc-errors.xslt and a bit modified for lua)
	This HTTP Transformation can only be used at ISAM 9.0.7.0+

	Add this to your Reverse Proxy configuration file using : 
	
	[http-transformations]
	...
	apiauthsvcerrors = response-isam9070-customize-apiauthsvc-errors.lua
	
	[http-transformations:apiauthsvcerrors]
	request-match = response:GET /mga/sps/apiauthsvc*
	request-match = response:POST /mga/sps/apiauthsvc*
	request-match = response:PUT /mga/sps/apiauthsvc*
]]
