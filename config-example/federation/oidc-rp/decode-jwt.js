/*
 * Author: Nick Lloyd
 * Email: nlloyd@us.ibm.com
 * Use case: Decode the JWT on the RP.  This data can be pulled from the stsuuser but
 * if needed here is the code.
 */
 
var jwt = "" + stsuu.getContextAttributes().getAttributeValueByName("id_token");

IDMappingExtUtils.traceString("DEBUG: jwt = " + jwt);

var jwtArray = jwt.split('.');
var header = jwtArray[0];
var jwtClaims = jwtArray[1];
var signature = jwtArray[2];

IDMappingExtUtils.traceString("DEBUG:   header              = " + header);
IDMappingExtUtils.traceString("DEBUG:   jwtClaims           = " + jwtClaims);
IDMappingExtUtils.traceString("DEBUG:   signature           = " + signature);

var headerDecoded = new java.lang.String(java.util.Base64.getUrlDecoder().decode(header));
var jwtClaimsDecoded = new java.lang.String(java.util.Base64.getUrlDecoder().decode(jwtClaims));
var signatureDecoded = new java.lang.String(java.util.Base64.getUrlDecoder().decode(signature));

IDMappingExtUtils.traceString("DEBUG:   headerDecoded    = " + headerDecoded);
IDMappingExtUtils.traceString("DEBUG:   jwtClaimsDecoded = " + jwtClaimsDecoded);
IDMappingExtUtils.traceString("DEBUG:   signatureDecoded = " + signatureDecoded);
