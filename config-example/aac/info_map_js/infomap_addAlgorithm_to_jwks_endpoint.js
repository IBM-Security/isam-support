/*
Purpose:The purpose of the code is to be used in Infomap to modify JWKS json response to add Alg example, alg:256 to it.
At present the jwsk public endpoint of verify access doesn't return alg at (/sps/jwks)

The full documentation is provided at the Blog

Blog -> https://community.ibm.com/community/user/security/blogs/tushar-prasad1/2022/05/21/ 


*/


importPackage(Packages.com.tivoli.am.fim.trustserver.sts.utilities);
importClass(Packages.com.tivoli.am.fim.trustserver.sts.utilities.IDMappingExtUtils);
importClass(Packages.com.ibm.security.access.httpclient.HttpClientV2);



const RUNTIME_HOST='http://localhost';
const URI_PUBLIC_JWKS="/sps/jwks";
let algToAdd="RS256";

let urlString=RUNTIME_HOST+URI_PUBLIC_JWKS;


try
{
let response=new HttpResponse();
response=HttpClientV2.httpGet(urlString);
var httpData=response.getBody();
var httpResponseCode=response.getCode();
}
catch(error)
{
    IDMappingExtUtils.traceString("The error around httpcall"+error) ;
}

try
{

if(httpResponseCode == 200)
{

IDMappingExtUtils.traceString("Method addAlgtoJwtcalled"+httpData.toString());
let addforSig=true;
let addforEnc=true;
inputJwt=httpData.toString();
let parsedJson=JSON.parse(inputJwt);

for(keys in parsedJson)
{

for(let j=0; j<parsedJson.keys.length;j++)
{
    let sigVal=parsedJson.keys[j].use;

    if(sigVal.match('sig') && addforSig)
    {
//add alg for sig
parsedJson.keys[j].alg=algToAdd;

    }

    if(sigVal.match('enc') && addforEnc)
    {
        //add alg for sig

        parsedJson.keys[j].alg=algToAdd;
    }
}

}


page.setValue("/authsvc/authenticator/addAlToJwt/success.json");

macros.put("@result@", JSON.stringify(parsedJson));
success.setValue(false);
}
else
{

    IDMappingExtUtils.traceString("The status code is not 200");
}

}
catch(error)
{
    IDMappingExtUtils.traceString("The error around putting jwt"+error) ;
}