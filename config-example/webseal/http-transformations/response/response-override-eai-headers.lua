
-- the original http transformation does not care about if the response contains am-eai-xattrs or not.
-- it will be overwritten
-- HTTPResponse.setHeader("am-eai-xattrs", "AZN_CRED_AUTH_METHOD,AZN_CRED_AUTH_METHOD_INFO")
if HTTPResponse.containsHeader("am-eai-xattrs") then
   HTTPResponse.setHeader("am-eai-xattrs", HTTPResponse.getHeader("am-eai-xattrs") .. ",AZN_CRED_AUTH_METHOD,AZN_CRED_AUTH_METHOD_INFO")
else   
   HTTPResponse.setHeader("am-eai-xattrs", "AZN_CRED_AUTH_METHOD,AZN_CRED_AUTH_METHOD_INFO")
end

HTTPResponse.setHeader("AZN_CRED_AUTH_METHOD","oauth")
HTTPResponse.setHeader("AZN_CRED_AUTH_METHOD_INFO","OAuth Authentication")
