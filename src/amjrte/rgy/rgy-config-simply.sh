#!/bin/sh
set -x

PROP=$1
LDAP=$2
PORT=$3
BIND=$4
PASSWORD=$5
RGYJAR=$6

java $RGYJAR com.tivoli.pd.rgy.util.RgyConfig $PROP create Default Default $LDAP:$PORT:readwrite:5 "$BIND" "$PASSWORD"

java $RGYJAR com.tivoli.pd.rgy.util.RgyConfig $PROP set ldap.connection-inactivity 60

java $RGYJAR com.tivoli.pd.rgy.util.RgyConfig $PROP set ldap.ssl-enable false

exit $?
