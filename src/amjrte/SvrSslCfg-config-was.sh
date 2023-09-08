#!/bin/sh -x
##
## Update as needed.
##
WAS=/opt/IBM/WebSphere/AppServer

##
## Make sure the WAS Java is in the path.
## cd $WAS/bin
## . ./setupCmdLine.sh
## which java
## /opt/IBM/WebSphere/AppServer/java/8.0/bin/java
##

##
## NOTE:
## The -authzsvr argument is required but there does not need to actually be a PDACLD running.
## The -port and -dbdir arguments are required but a remote mode app does not actually use them.
##

java -cp $WAS/tivoli/tam/PD.jar -Dpd.cfg.home=$WAS/tivoli/tam com.tivoli.pd.jcfg.SvrSslCfg -action config                 \
                                  -admin_id sec_master -admin_pwd sec_master_password                                     \
                                  -appsvr_id "WebSphereTAIPlusPlus"                                                       \
                                  -policysvr policy_server_hostname:7135:1                                                \
                                  -authzsvr authorization_server_hostname:7136:1                                          \
                                  -port 9999 -mode remote -dbdir .                                                        \
                                  -cfg_file $WAS/tivoli/tam/PolicyDirector/WebSphereTAIPlusPlus.properties                \
                                  -key_file $WAS/tivoli/tam/PolicyDirector/WebSphereTAIPlusPlus.ks                        \
                                  -cfg_action create

exit $?
