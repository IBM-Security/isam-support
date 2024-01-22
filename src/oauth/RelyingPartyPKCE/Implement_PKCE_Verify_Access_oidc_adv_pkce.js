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
importMappingRule("addPKCEAttributes");
/*
 * The advanced mapping rule allows the OIDC RP implementation to influence the contents of requests to the OP.
 * For example we can include custom parameters on the redirect to the /authorize endpoint of the OP, or in the
 * POST to the token endpoint.
 * 
 * This example mapping rule will trace parameters at various points in the flow, and includes boolean'd-out examples
 * of some common modifications that you may wish to make.
 */

/*
 * First determine what operation is in progress.
 */
var operation = stsuu.getContextAttributes().getAttributeValueByNameAndType("operation","urn:ibm:SAM:oidc:rp:operation");
var use_pkce=true;

// For additional trace:
IDMappingExtUtils.traceString("oidc_rp_adv mapping rule(operation:" + operation + ") called with stsuu:\n " + stsuu.toString() + "\n");

/*
 * A value of "authorize" means that we have received a request to /kickoff, and we can use this portion to consume incoming 
 * request parameters on the kickoff URL and modify the subsequent redirect to /authorize.
 */
if(operation == "authorize") {
   if(use_pkce){
  addPKCEAttributes();
  }
  var trace_kickoff = true;
  if(trace_kickoff) {
    var traceString = "\n OIDC kickoff request parameters are: ";

    var attributes = stsuu.getContextAttributes().getAttributesByType("urn:ibm:SAM:oidc:rp:kickoff:param");
    for (var i in attributes) {
      var attr = attributes[i];
      traceString += "\n\tkickoff attribute name: " + attr.getName();
      traceString += "\n\tkickoff attribute value: " + attr.getValues()[0];
    }

    //Extract the authorize url:
    var authorize_url = stsuu.getContextAttributes().getAttributeValueByNameAndType("url", "urn:ibm:SAM:oidc:rp:authorize:uri");
    traceString += "\n /authorize url is: "; 
    traceString += authorize_url;

    traceString += "\n OIDC authorize request parameters are: ";

    var attributes = stsuu.getContextAttributes().getAttributesByType("urn:ibm:SAM:oidc:rp:authorize:req:param");
    for( var i in attributes) {
      var attr = attributes[i];
      if(attr.getValues().length == 1) {
        traceString += "\n\trequest attribute: " + attr.getName() + "=" + attr.getValues()[0];
      } else {
        for(var itr = 0; i < attr.getValues().length; i++) {
          traceString += "\n\trequest attribute: " + attr.getName() + "=" + attr.getValues()[itr];
        }
      }
    }
    IDMappingExtUtils.traceString(traceString);
  }

  /*
   * The following is an example of how to author and include an claims object in the request to /authorize.
   * 
   * This claims parameter will request the email claim in the id_token as essential.
   */
  var add_claim_parameter = false;
  if(add_claim_parameter) {
    var claims = {
      "id_token": {
        "email": {"essential":true}
      }
    };
    stsuu.addContextAttribute(new Attribute("claims", "urn:ibm:SAM:oidc:rp:authorize:req:param", JSON.stringify(claims)));
  }
}

/*
 * An operation with the value "token" means we have received a request at our /redirect back from the OP 
 * (typically with the authorization code, and are about to invoke a request to the token endpoint. 
 * We can use this hook point for adding parameters to the /token and /userinfo request.
 */
if (operation == "token") {
   if(use_pkce){
  addPKCEAttributes();
  }
  var trace_token = true;

  if(trace_token) {
    traceString += "\n OIDC redirect incomming reponse parameters are: ";
    var attributes = stsuu.getContextAttributes().getAttributesByType("urn:ibm:SAM:oidc:rp:authorize:rsp:param");
    for (var i in attributes) {
      var attr = attributes[i];
      if(attr.getValues().length == 1) {
        traceString += "\n\trequest attribute: " + attr.getName() + "=" + attr.getValues()[0];
      } else {
        for (var itr = 0; i < attr.getValues().length; i++) {
          traceString += "\n\trequest attribute: " + attr.getName() + "=" + attr.getValues()[itr];
        }
      }
    }
  }


  /*
   * The following snippet, if enabled, will extract the access_token returned and include it as a query string parameter 
   * (in addition to the bearer header), for a userinfo request (if configured). This is necessary for some OPs to 
   * successfully process a request to the userinfo endpoint.
   */
  var add_oauth_token_param = false;
  if(add_oauth_token_param) {
    // Get an access token
    var at = stsuu.getContextAttributes().getAttributeByName("access_token");
    if(at != null) {
      // Some OP's need userinfo to include the token as a request param
      var reqParam = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("oauth_token", "urn:ibm:SAM:oidc:rp:userinfo:req:param" , at.getValues());
      stsuu.addContextAttribute(reqParam);
    }
  }

  /*
   * The following will add the nonce attribute as if it was present in the
   * returned id_token. This is necessary if an OP does not include the nonce
   * in the id_token. This requirement is defined by the specification in
   * section 2.
   */ 
  var work_around_missing_nonce = false;
  if(work_around_missing_nonce) {

    var nonce = stsuu.getContextAttributes().getAttributeByNameAndType("nonce","urn:ibm:SAM:oidc:rp:meta");
    if(nonce != null) {
      var id_token_nonce = new com.tivoli.am.fim.trustserver.sts.uuser.Attribute("nonce", "urn:id_token:attribute:token" , nonce.getValues());
      stsuu.addAttribute(id_token_nonce);
    }
  }

}

// For additional trace:
IDMappingExtUtils.traceString("oidc_rp_adv mapping rule finished with stsuu:\n " + stsuu.toString() + "\n");
