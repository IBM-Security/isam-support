if Session.containsCredentialAttribute("emailAddress") then
   HTTPResponse.setHeader("email", Session.getCredentialAttribute("emailAddress"))
end

