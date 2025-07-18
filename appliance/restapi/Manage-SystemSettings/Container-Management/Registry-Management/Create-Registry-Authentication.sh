#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$DEBUG" ] && VERBOSE="-v"

appliance_hostname=$1
username=$2
password=$3
payload=$4

[ "$CURL" ]  || CURL="curl $VERBOSE -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -X POST https://${appliance_hostname}/isam/container_ext/repo --data-ascii @${payload}

exit $?
