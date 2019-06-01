#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3

${CURL} -u "$username:$password" -H "Accept: application/json" --data-ascii @create-cluster-payload.json -X POST "https://${appliance_hostname}/isam/cluster/v2"

exit $?
