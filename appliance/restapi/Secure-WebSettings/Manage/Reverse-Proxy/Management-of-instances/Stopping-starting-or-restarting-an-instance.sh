#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
id=$4
action=$5

${CURL} -u "$username:$password" -H "Accept: application/json" -X PUT "https://${appliance_hostname}/wga/reverseproxy/${id}" --data-ascii "{\"operation\":\"$action\"}"

exit $?
