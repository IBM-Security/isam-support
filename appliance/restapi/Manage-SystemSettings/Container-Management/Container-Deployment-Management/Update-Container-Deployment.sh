#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$DEBUG" ] && VERBOSE="-v"

appliance_hostname=$1
username=$2
password=$3
container_id=$4
payload=$5

[ "$CURL" ]  || CURL="curl $VERBOSE -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -X PUT https://${appliance_hostname}/isam/container_ext/container/${container_id} --data-ascii @${payload}

exit $?
