<xsl:if test='azn_cred_groups = "cn=printUsers,o=ibm,c=us"
    and (contains(azn_engine_requested_actions,"p")
      or contains(azn_engine_requested_actions,"q"))
    and printQuota &lt;20'>
  !TRUE!
</xsl:if>
