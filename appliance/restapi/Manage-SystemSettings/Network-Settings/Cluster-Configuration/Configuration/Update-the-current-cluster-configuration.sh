#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3

${CURL} -u "$username:$password" -H "Accept: application/json" --data-ascii @update-cluster-payload.json -X PUT "https://${appliance_hostname}/isam/cluster/v2"

exit $?
