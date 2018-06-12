# Federation Example Configurations

## Contents : 

### mapping_rules : 
This section contains example mapping rules intended to be used in IdP or SP flows.
They will have the format of
> `<role>_<name>.js`

### access_policy : 
This section contains example Javascript mapping rules intended to be used as 'Access Policy' for the 'Secure Federation' component of ISAM

**mfa_for_partner.js** : 
  This rule was created to perform an MFA transaction once per session.
  You can edit the authentication policy used, as well as the URLs and logic to meet your needs
