//Placeholder
importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.utilities);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.fedmgr2.trust.util.LocalSTSClient);

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'uuidxxxxxxxx-xxxy-xyxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

macros.put("@WSUID@",create_UUID());

var username = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:header", "iv-user");

var email = "" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:token:attribute", "emailAddress");

var anonRst = "<s:Envelope xmlns:s=" + context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "<s:Envelope xmlns:s");

IDMappingExtUtils.traceString(username);
IDMappingExtUtils.traceString(anonRst);
IDMappingExtUtils.traceString(email);

if(username != null && username != "" && username.toLowerCase() != "unauthenticated") {
	
	var stsbase = new STSUniversalUser();
	stsbase.setPrincipalName(username);
	stsbase.addAttribute(new Attribute("mail","",email));
	xmlstsuu = IDMappingExtUtils.stringToXMLElement(stsbase.toString());
	
	var res = LocalSTSClient.doRequest("http://schemas.xmlsoap.org/ws/2005/02/trust/Issue","urn:federation:MicrosoftOnline","stshandler", xmlstsuu, null);
	
	IDMappingExtUtils.traceString(IDMappingExtUtils.xmlElementToString(res.token));
	
	var assertion = IDMappingExtUtils.xmlElementToString(res.token);
	
	var assertionId = assertion.substring(assertion.lastIndexOf("\" AssertionID=\""), assertion.indexOf("\" IssueInstant="));
	macros.put("@ASSERTIONID@",assertionId.substr(15));
	
	var issueInstant = assertion.substring(assertion.lastIndexOf("\" IssueInstant=\""), assertion.indexOf("\" Issuer="));
	macros.put("@ISSUEINSTANT@", issueInstant.substr(16));
	
	var notOnOrAfter = assertion.substring(assertion.lastIndexOf(" NotOnOrAfter=\""),assertion.indexOf("\"><saml:AudienceRestrictionCondition"));
	
	macros.put("@NOTONORAFTER@", notOnOrAfter.substr(15));
	
	macros.put("@XML@", assertion);
} else {
	var currentTime = IDMappingExtUtils.getCurrentTimeStringUTC();

	macros.put("@CURRENTTIME@", currentTime);
	
	page.setValue("/authsvc/authenticator/stshandler/errorresponse.xml");
}
success.setValue(false);
