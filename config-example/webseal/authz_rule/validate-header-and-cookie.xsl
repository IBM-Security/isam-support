<!-- Configuration file updates needed : -->
<!--[azn-decision-info] -->
<!--... -->
<!--xforwardedfor = header:x-forwarded-for  -->
<!--azncookie = cookie:azncookie  -->

<!-- example cURL request -->
<!-- curl -k -b /cookies.txt -c /cookies.txt "https://isam9070.hyperv.lab/scim/Me" -H "Accept: application/json" -H "X-forwarded-for: 10.2.2.234" -vv -->

<xsl:if test='substring-before(/XMLADI/xforwardedfor,".") = "10" and /XMLADI/azncookie="internal"'>
  !TRUE!
</xsl:if>
