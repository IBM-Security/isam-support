/*
	File Name : token-router.js
	Author : Jack Yarborough
	Contact : jcyarbor@us.ibm.com
	
	Usage : This mapping rule is used to route between different trust chains for validation of token types.
          It accomplishes the following:
		- Confirms whether the token is a JWT or an OAUTH token
    - Extracts the issuer from JWT tokens
		- Sends JWT for validation
    - Sends OAUTH tokens for validation
    - Returns STSUU with Reverse Proxy consumable attributes
		
	**This JavaScript mapping rule is provided as-is and is supported by the author.
	** All variable names, attribute names, and logic are provided as an example
	** All non-customized JS default as provided by the ISAM Appliance AAC Module when creating an API Protection Definition
	** The LocalSTSClient class is available in 9.0.5.0+
	
	Please refer to the following documentation for a complete list of classes that are available for use in InfoMap Mapping rules : 
		- https://www.ibm.com/support/knowledgecenter/en/SSPREK_9.0.7/com.ibm.isam.doc/config/concept/con_otp_customize_mapping_rules_gs_aac.html
*/
