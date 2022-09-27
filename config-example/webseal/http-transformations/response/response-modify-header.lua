local target_header=HTTPResponse.getHeader("header-from-backend")
-- - needs to be escaped by %
local replace="original%-value"
local by="replaced-value"

if target_header and string.match(target_header,replace) then
   HTTPResponse.setHeader(string.gsub(target_header,replace,by))
end

