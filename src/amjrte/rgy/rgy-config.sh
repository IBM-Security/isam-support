#!/bin/sh
set -x

java com.tivoli.pd.rgy.util.RgyConfig ldap.properties create Default Default           	       	\
       	       	"ldap:636:readwrite:5" "cn=admin" "secret" trust.p12 trust_password

exit $?
