/*
	File Name : insert_credential_attr.js
	Author : Jack Yarborough
	Contact : jcyarbor@us.ibm.com
	
	Usage : This InfoMap JavaScript is designed to perform the following : 
		- Insert a value into the ISAM credential
		
	**This JavaScript mapping rule is provided as-is and is supported by the author.
	** All variable names, attribute names, and logic are provided as an example
	
	Please refer to the following documentation for a complete list of classes that are available for use in InfoMap Mapping rules : 
		- https://www.ibm.com/support/knowledgecenter/en/SSPREK_9.0.7/com.ibm.isam.doc/config/concept/con_otp_customize_mapping_rules_gs_aac.html
*/

// Insert an attribute called 'sample' that has a value of 'value'
context.set(Scope.SESSION, "urn:ibm:security:asf:response:token:attributes", "sample", "value");
success.setValue(true);
