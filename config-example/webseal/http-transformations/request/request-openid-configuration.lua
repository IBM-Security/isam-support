Control.trace(9,Control.dumpContext())

target='test/.well-known/openid-configuration'
replaced_by='/mga/sps/oauth/oauth20/metadata/OIDCDefinition'
-- - needs to be escaped by % as pattern
escaped=string.gsub(target,"%-","%%-")

if string.match(HTTPRequest.getURL(), escaped) then
   HTTPRequest.setURL(replaced_by)
end
