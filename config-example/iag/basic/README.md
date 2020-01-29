There are only a few places which need to be updated to get this lab up.
========================================================================


config/l2dashboard.yml  

```
identity:  
  ci_oidc:  
    client_id: "<client-id>"  
    client_secret: "<client-secret>"  
    tenant: "<tenant>.ice.ibmcloud.com"  
    hostname: "<vanity-hostname-or-just-use-full-tenant-name>"  
  
  resource_servers:
  - connection_type: "tcp"
    path: "/dashboard"
    servers:
      - host: "<ip>"
        port: <port>
    transparent_path: false
```
 
  
  


