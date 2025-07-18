#!/bin/sh
set -x

PROP=$1


java com.tivoli.pd.rgy.util.RgyConfig $PROP create Default Default ldaphostname:636:readwrite:5 "bind-dn" "password"

java com.tivoli.pd.rgy.util.RgyConfig $PROP set ldap.basic-user-support true

java com.tivoli.pd.rgy.util.RgyConfig $PROP set ldap.basic-user-principal-attribute uid

java com.tivoli.pd.rgy.util.RgyConfig $PROP set ldap.connection-inactivity 270

java com.tivoli.pd.rgy.util.RgyConfig $PROP set ldap.ssl-enable true

java com.tivoli.pd.rgy.util.RgyConfig $PROP set ldap.ssl-truststore LDAP_TRUST.ks

java com.tivoli.pd.rgy.util.RgyConfig $PROP set ldap.ssl-truststore-pwd password

java com.tivoli.pd.rgy.util.RgyConfig $PROP set ldap.ssl-keystore LDAP_KEYSTORE.ks

java com.tivoli.pd.rgy.util.RgyConfig $PROP set ldap.ssl-keystore-pwd password

java com.tivoli.pd.rgy.util.RgyConfig -server feddir_hostname $PROP set ldap.svrs "feddir_hostname:389:readwrite:1"

java com.tivoli.pd.rgy.util.RgyConfig -server feddir_hostname $PROP set ldap.suffix OU=SCIM

java com.tivoli.pd.rgy.util.RgyConfig -server feddir_hostname $PROP set ldap.bind-pwd feddir-password

java com.tivoli.pd.rgy.util.RgyConfig -server feddir_hostname $PROP set ldap.bind-dn feddir-bind-dn

java com.tivoli.pd.rgy.util.RgyConfig -server feddir_hostname $PROP set ldap.basic-user-principal-attribute uid



exit $?
