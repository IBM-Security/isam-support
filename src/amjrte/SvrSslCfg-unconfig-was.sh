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

java -cp $WAS/tivoli/tam/PD.jar                                                      \
         -Dpd.cfg.home=$WAS/tivoli/tam com.tivoli.pd.jcfg.SvrSslCfg                  \
         -action unconfig                                                            \
         -admin_id sec_master -admin_pwd sec_master_password                         \
         -appsvr_id WebSphereTAIPlusPlus -policysvr policy_server_hostname:7135:1    \
         -cfg_file $WAS/tivoli/tam/PolicyDirector/WebSphereTAIPlusPlus.properties

exit $?
