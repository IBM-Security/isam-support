importClass(Packages.com.ibm.security.access.httpclient.Headers);
importClass(Packages.com.ibm.security.access.httpclient.HttpClient);
importClass(Packages.com.ibm.security.access.httpclient.HttpResponse);
importClass(Packages.com.ibm.security.access.httpclient.Parameters);
importClass(Packages.com.ibm.security.access.scimclient.ScimClient);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.MMFAMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.OAuthMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.uuser.ContextAttributes);
importClass(Packages.java.util.ArrayList);
importClass(Packages.java.util.HashMap);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts);
importPackage(Packages.com.tivoli.am.fim.trustserver.sts.uuser);

importMappingRule("INFOMAP_COMMON");

trace("INFOMAPDEBUGGER: ", "ENTER");

var moveon = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "moveon");

if (moveon == null) {
    //
    // CBA attributes.
    //
    trace("INFOMAPDEBUGGER: ", "CBA attributes");
    trace("INFOMAPDEBUGGER: ", "  Get a single CBA attribute");
    var action= context.get(Scope.SESSION, "urn:ibm:security:asf:cba:attribute", "action");
    if (action != null) {
        trace("INFOMAPDEBUGGER: ", "  action = " + action);
    }

    trace("INFOMAPDEBUGGER: ", "  Dumping CBA attributesMap");
    dumpMap(Scope.SESSION, "internal:authsvc:cba", "attributesMap");

    trace("INFOMAPDEBUGGER:", "");

    //
    // Request Token Attributes
    //
    trace("INFOMAPDEBUGGER: ", "Request Token Attributes");
    var userName = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:token:attribute", "username");
    if (userName != null) {
	trace("INFOMAPDEBUGGER:   userName = ", userName);
    }

    var emailAddress = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:token:attribute", "emailAddress");
    if (emailAddress != null) {
	trace("INFOMAPDEBUGGER:   emailAddress = ", emailAddress);
    }

    trace("INFOMAPDEBUGGER:", "");

    //
    // AAC transaction info
    //
    trace("INFOMAPDEBUGGER: ", "ACC Transaction Info");
    var policyID = context.get(Scope.SESSION, "urn:ibm:security:asf:policy", "policyID");
    if (policyID != null) {
	trace("INFOMAPDEBUGGER: policyID = ", policyID);
        macros.put("@CUSTOM_MACRO@", policyID);
    }

    var transactionID = context.get(Scope.SESSION, "urn:ibm:security:asf:transaction", "transactionID");
    if (transactionID != null) {
        trace("INFOMAPDEBUGGER: transactionID = ", transactionID);
    }

    trace("INFOMAPDEBUGGER:", "");

    //
    // Headers
    //
    trace("INFOMAPDEBUGGER: ", "Request Headers");
    var reqHeader = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:header", "Cookie");
    if (reqHeader != null) {
	trace("INFOMAPDEBUGGER:   Cookie = ", reqHeader);
    }

    trace("INFOMAPDEBUGGER:   ", "Dumping headersMap");
    dumpMap(Scope.REQUEST, "internal:authsvc:request", "headersMap");

    trace("INFOMAPDEBUGGER:", "");

    //
    // Get all the POST parameters
    //
    trace("INFOMAPDEBUGGER: ", "Dumping parametersMap");
    dumpMap(Scope.REQUEST, "internal:authsvc:request", "parametersMap");
}

if (moveon != null) {
    trace("INFOMAPDEBUGGER: ", "Keep on Trucking");

    trace("INFOMAPDEBUGGER:", "");

    trace("INFOMAPDEBUGGER: ", "  Dumping CBA attributesMap");
    dumpMap(Scope.SESSION, "internal:authsvc:cba", "attributesMap");

    trace("INFOMAPDEBUGGER:", "");

    trace("INFOMAPDEBUGGER: ", "Request Headers");
    trace("INFOMAPDEBUGGER:   ", "Dumping headersMap");
    dumpMap(Scope.REQUEST, "internal:authsvc:request", "headersMap");

    trace("INFOMAPDEBUGGER:", "");

    trace("INFOMAPDEBUGGER: ", "Dumping parametersMap");
    dumpMap(Scope.REQUEST, "internal:authsvc:request", "parametersMap");

    success.setValue(true);
}


trace("INFOMAPDEBUGGER: ", "EXIT");

//
// Must update sps.page.htmlEscapedMacros at https://appliance_hostname/mga/advanced_config
//
