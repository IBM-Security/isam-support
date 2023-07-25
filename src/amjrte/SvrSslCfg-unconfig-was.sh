#!/bin/sh -x

WAS=/opt/IBM/WebSphere/AppServer

java -cp $WAS/tivoli/tam/PD.jar                                                      \
         -Dpd.cfg.home=$WAS/tivoli/tam com.tivoli.pd.jcfg.SvrSslCfg                  \
         -action unconfig                                                            \
         -admin_id sec_master -admin_pwd sec_master_password                         \
         -appsvr_id WebSphereTAIPlusPlus -policysvr 9.30.219.58:7135:1               \
         -cfg_file $WAS/tivoli/tam/PolicyDirector/WebSphereTAIPlusPlus.properties

exit $?
