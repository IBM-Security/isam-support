#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$DEBUG" ] && VERBOSE="-v"

appliance_hostname=$1
username=$2
password=$3
volume=$4

[ "$CURL" ]  || CURL="curl $VERBOSE -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -X POST https://${appliance_hostname}/isam/container_ext/volume --data-ascii "{\"name\":\"$volume\"}"

exit $?
