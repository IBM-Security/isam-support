
local target_cookie="CookieName"
if HTTPResponse.containsCookie(target_cookie) then
   local cookie=HTTPResponse.getCookie(target_cookie)
   if not string.match(cookie, ";%s*Secure") then
      HTTPResponse.setCookie(target_cookie, cookie.."; Secure")
   end
end

--[[

  <xsl:template match="//HTTPResponse/Cookies">
    <xsl:if test="Cookie/@name='CookieName'">
      <Cookie action="update" name="CookieName">
        <Secure>1</Secure>
      </Cookie>
    </xsl:if>
  </xsl:template>
]]
