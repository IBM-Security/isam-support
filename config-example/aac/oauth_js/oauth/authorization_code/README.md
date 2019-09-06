Mapping rules to assist with OAUTH 2.0 Authorization Code flows

Returning Credential Attributes at the '/userinfo' endpoint based on the 'scope':
 - oauth-azncode-userinfo-credattrs-pretoken.js
 - oauth-azncode-userinfo-credattrs-posttoken.js

OAuth 2.0 Authorization code flow that stores attributes for retrieval at the '/userinfo' endpoint based on the 'scope' passed during the authorization portion of the flow. The scope needs to be passed during both the '/authorize' call and the '/userinfo' call as a query parameter.

The above mapping rules show how to store the credential 'emailAddress' attribute as an example.
