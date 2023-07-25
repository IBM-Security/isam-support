#!/bin/sh -x

WAS=/opt/IBM/WebSphere/AppServer

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
