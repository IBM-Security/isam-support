
//  VerifyCred : Tushar Prasad
//Template format that needs to be created
//location /authsvc/authenticator/infomap/success.json
//---------Below content
//  {
//       "result":"@result@"
//  }
//----End of Content


importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.OAuthMappingExtUtils);



var verifyCred=false;
var result="error";
const redir = "/authsvc/authenticator/infomap/success.json";
let validClient=false;
var temp_clientid="";
var temp_clientsecret="";
var storedClientId="";

IDMappingExtUtils.traceString( "Entering VerifyCreds" );

//read clientid clientsecret
var client_id = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "client_id");
var client_secret = context.get(Scope.REQUEST, "urn:ibm:security:asf:request:parameter", "client_secret");


IDMappingExtUtils.traceString(client_id+client_secret);

if(client_id !="" && client_id != null  && client_secret != "" && client_secret != null)
{
    verifyCred=true;
}



// Now generate response 
if(verifyCred){
   
    

try{
    if( client_id != null  ){
     temp_clientid=OAuthMappingExtUtils.getClient(client_id);
    if(temp_clientid != null){
       storedClientId= temp_clientid.getClientId();
       temp_clientsecret=temp_clientid.getClientSecret(); 
         validClient=true;
    }
    }
} catch(e){
throwSTSException(e)

}

    if(validClient)
    {
  //do a match
     if((client_id==storedClientId) && (client_secret==temp_clientsecret)){
    
        result="success";

     }

    }

page.setValue(redir);
macros.put("@result@", result );
success.setValue(false);


}
else{

  result="error";

page.setValue(redir);
macros.put("@result@", result );
success.setValue(false);

}



