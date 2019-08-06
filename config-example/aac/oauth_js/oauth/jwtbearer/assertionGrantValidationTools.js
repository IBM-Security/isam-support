/*
	File Name : oauth-oidc-implicit-preTokenGeneration-attributeSource-with-scope-and-auditing.js
	Author : Jack Yarborough
	Contact : jcyarbor@us.ibm.com
	
	Usage : This mapping rule is the 'PreTokenGeneration' mapping rule to be used with an 'Implicit' OIDC flow.
		- Retrieve Attribute Source values from the STSUU
		- Check the provided OIDC scope values and conditionally insert the Attribute Source values into the resultant JWT
		- Audit missing attributes for investigation
		
	**This JavaScript mapping rule is provided as-is and is supported by the author.
	** All variable names, attribute names, and logic are provided as an example
	** All non-customized JS default as provided by the ISAM Appliance AAC Module when creating an API Protection Definition
	** General AAC/Federatio Auditing is available since 9.0.6.0
	
	Please refer to the following documentation for a complete list of classes that are available for use in InfoMap Mapping rules : 
		- https://www.ibm.com/support/knowledgecenter/en/SSPREK_9.0.7/com.ibm.isam.doc/config/concept/con_otp_customize_mapping_rules_gs_aac.html
*/
importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.oauth20);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);
importPackage(Packages.com.ibm.security.access.user);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.OAuthMappingExtUtils);
importClass(Packages.com.ibm.security.access.httpclient.HttpClient);
importClass(Packages.com.ibm.security.access.httpclient.HttpResponse);
importClass(Packages.com.ibm.security.access.httpclient.Headers);
importClass(Packages.com.ibm.security.access.httpclient.Parameters);
importClass(Packages.java.util.ArrayList);
importClass(Packages.java.util.HashMap);
