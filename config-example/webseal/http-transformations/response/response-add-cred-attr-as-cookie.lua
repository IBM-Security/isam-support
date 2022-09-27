--[[
    This HTTP Transformation adds the userid and session index into cookies.
    It shows examples of how the cookie updates should be formatted.
]]

if Session.containsCredentialAttribute("AZN_CRED_PRINCIPAL_NAME") then
   HTTPResponse.setCookie("CUID", Session.getCredentialAttribute("AZN_CRED_PRINCIPAL_NAME") .. "; Path=/; Domain=hyperv.lab; Expires=Mon, 07 Jun 2021 10:12:14 GMT; Secure")
end

if Session.containsCredentialAttribute("tagvalue_session_index") then
   HTTPResponse.setCookie("CSID", Session.getCredentialAttribute("tagvalue_session_index") .. "; Path=/; Domain=hyperv.lab; Expires=Mon, 07 Jun 2021 10:12:14 GMT; Secure")
end


