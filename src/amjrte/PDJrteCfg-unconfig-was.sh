#!/bin/sh -x

WAS=/opt/IBM/WebSphere/AppServer
WAS_JAVA=/opt/IBM/WebSphere/AppServer/java/8.0/jre

java -cp $WAS/tivoli/tam/PD.jar -Dpd.home=$WAS/tivoli/tam/PolicyDirector -Dpd.cfg.home=$WAS/tivoli/tam com.tivoli.pd.jcfg.PDJrteCfg -was -action unconfig -java_home $WAS_JAVA

exit $?
