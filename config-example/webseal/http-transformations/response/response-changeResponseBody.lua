--[[
Author: jcyarbor@us.ibm.com

This is an example LUA script to substitute values in the HTTP Response based on a pattern using the LPEG LUA module:
https://www.inf.puc-rio.br/~roberto/lpeg/lpeg.html#ex

Example in question is the 'global substitution' pattern.

The function was taken straight from the above documentation.

In this example, a JSON response from the junction server contains the junction server's IP address and port.
This causes problems when the Body needs to be filtered but the content-type does not support the built-in script based filtering.

The following was how the HTTP transformation stanzas were setup:

[http-transformations]
changeResponseBody = response-changeResponseBody.lua

[http-transformations:changeResponseBody]
request-match = response: GET /teamworks/*

In this scenario '10.2.1.2' was the backend server and '10.2.5.110' is my Reverse Proxy IP address.

The LUA rule substitutes the values as expected globally allowing the content to be filtered correctly.

--]]
local lpeg = require "lpeg"

function gsub (s, patt, repl)
  patt = lpeg.P(patt)
  patt = lpeg.Cs((patt / repl + 1)^0)
  return lpeg.match(patt, s)
end

local hrBody = HTTPResponse.getBody()

local hrBodyChanged = gsub(hrBody, "https://10.2.1.2:443", "https://10.2.5.110:443")

HTTPResponse.setBody(hrBodyChanged)
