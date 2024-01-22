
/*

Created Modified BY 
Adarsh Nair
Tushar Prasad

Details are available into the blog section
https://community.ibm.com/community/user/security/blogs/adarsh-nair/2024/01/14/proof-key-for-code-exchange-implementing-pkce-thro

*/


importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.utilities);
importClass(Packages.com.tivoli.am.fim.base64.BASE64Utility);



var operation = stsuu.getContextAttributes().getAttributeValueByNameAndType("operation","urn:ibm:SAM:oidc:rp:operation");
var extcache = IDMappingExtUtils.getIDMappingExtCache(false);
var ttl = 300;

var randomstringlength=20;
var randomstringval="";
var codeverifier="";
var codechallenge="";
var code_challenge_method="S256";



function addPKCEAttributes() {

if(operation == "token"){

var state = stsuu.getContextAttributes().getAttributeValueByNameAndType("state","urn:ibm:SAM:oidc:rp:authorize:rsp:param");
var lookupkey = state+"_codeverifier";
var codeverifier = extcache.getAndRemove(lookupkey);

// var codeverifier=IDMappingExtUtils.getSPSSessionData(lookupkey);

// Remove code verifier
// IDMappingExtUtils.removeSPSSessionData("lookupkey");


IDMappingExtUtils.traceString("received State:******* "+state+ " code_verifier: " +codeverifier);

stsuu.addContextAttribute(new Attribute("code_verifier", "urn:ibm:SAM:oidc:rp:token:req:param", codeverifier))

IDMappingExtUtils.traceString("Added into token call:******* " +codeverifier);

}

if(operation == "authorize"){

var state = stsuu.getContextAttributes().getAttributeValueByNameAndType("state","urn:ibm:SAM:oidc:rp:authorize:req:param");
var lookupkey = state+"_codeverifier";

IDMappingExtUtils.traceString("oidc_rp_adv pkce generation:\n "  + "\n");

verifychallenge = getCodeVerifierandChallenge()

codeverifier = verifychallenge[0];
codechallenge = verifychallenge[1]


//IDMappingExtUtils.setSPSSessionData(lookupkey,codeverifier);

extcache.put(lookupkey,codeverifier, ttl);


IDMappingExtUtils.traceString("****** Setting inside codeverifier: "+codeverifier+" challenge method:  "+code_challenge_method);

stsuu.addContextAttribute(new Attribute("code_challenge", "urn:ibm:SAM:oidc:rp:authorize:req:param", codechallenge));
stsuu.addContextAttribute(new Attribute("code_challenge_method", "urn:ibm:SAM:oidc:rp:authorize:req:param", code_challenge_method));
    


}
}



function getCodeVerifierandChallenge() {

var hashval="";
randomstringval=OAuthMappingExtUtils.generateRandomString(randomstringlength);

codeverifier=randomstringval;

hashval = OAuthMappingExtUtils.SHA256Sum(codeverifier);

//base64encode the hash value

hashofverifier =  BASE64Utility.encode(hashval, false);

codechallenge=hashofverifier.toString().replace('+','-').replace('/','_').replace('=','');

IDMappingExtUtils.traceString("****** Hash of Code Challenge: "+hashval.toString());

IDMappingExtUtils.traceString("****** Code Verifier: "+codeverifier);

return [codeverifier,codechallenge]
}
