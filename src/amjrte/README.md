# **Helper scripts for AMJRTE.**

### WAS Related Information ###
Starting back at WAS 8 the AMJRTE locations are handled differently than previous locations.
The information is stored under $WAS_HOME/tivoli/tam.

There should be no information under $WAS_HOME/java/jre.  This is by design and hard-coded in the AMJRTE due to many customers having a security requirement to not touch the JRE.  Also, there are WAS deployment patterns in which the JRE is shared read-only across 100s of WAS servers making it impossible to configure the AMJRTE on those servers.

The should only be a single PD.jar at $WAS_HOME/tivoli/tam/PD.jar.  No PD.jar.old, etc.  This directory is hard-coded as a WAS java extension directory.  Java will load any and all files in that directory at startup.  So you need to only have the desired version of PD.jar.  It can happen to load say PD.jar.6.1 first and use outdated and unsupported classes.  Unsure, then run,

find /opt/IBM/WebSphere/AppServer -name "\*PD.jar\*"
/opt/IBM/WebSphere/AppServer/tivoli/tam/PD.jar
/opt/IBM/WebSphere/AppServer/tivoli/tam/PD.jar.bak   <================ NO.  REMOVE THIS.
/opt/IBM/WebSphere/AppServer/java/jre/lib/ext/PD.jar <================ NO.  REMOVE THIS.

Use the scripts:

PDJrteCfg-config-was.sh  
SvrSslCfg-config-jvm.sh  
SvrSslCfg-unconfig-jvm.sh  
PDJrteCfg-unconfig-was.sh  


### Stand-alone JVM Related Information ###

Use the pdjrtecfg command in the download zip for config/unconfig of the JVM.  
Use the scripts for application config.
