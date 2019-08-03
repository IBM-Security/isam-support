#!/bin/sh -x
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
command=$4

${CURL} -u "$username:$password" -H "Accept: application/json" -X POST "https://${appliance_hostname}/core/cli" \
        --data-ascii "{\"command\":\"$command\"}"

exit $?
