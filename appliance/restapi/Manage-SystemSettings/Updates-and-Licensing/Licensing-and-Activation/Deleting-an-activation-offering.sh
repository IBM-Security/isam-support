#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
id=$4

${CURL} -u "$username:$password" -H 'Accept: application/json' -X DELETE https://${appliance_hostname}/isam/capabilities/${id}/v1

exit $?
