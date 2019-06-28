/*
1) Configure your IdP system to acquire the credential attribute from LDAP. This can be accomplished in two ways :

  A) Reverse Proxy 'extended credential attributes'
    [TAM_CRED_ATTRS_SVC:eperson]
    isamcredentialattribute = ldapattribute

    For example :
    [TAM_CRED_ATTRS_SVC:eperson]
    emailAddress = mail

    The above takes the 'mail' ldap attribute and puts it in the credential attribute 'emailAddress'

  B) ISAM Federation Attribute Source
    https://www.ibm.com/support/knowledgecenter/en/SSPREK_9.0.7/com.ibm.isam.doc/admin/task/tsk_mng_attribute_sources.html
*/
/*
2) Store that attribute in a variable
*/
var ldapEmail = stsuu.getAttributeValueByName("emailAddress");
/*
3) Add that variable to the STSUU with the desired name and type :
*/
if(ldapEmail != null && ldapEmail != "") {
   stsuu.addAttribute(new Attribute("uid", "type", ldapEmail);
} else {
   IDMappingExtUtils.traceString("There was no email attribute in the credential. Please check LDAP for user : "+ stsuu.getPrincipalName());
}
