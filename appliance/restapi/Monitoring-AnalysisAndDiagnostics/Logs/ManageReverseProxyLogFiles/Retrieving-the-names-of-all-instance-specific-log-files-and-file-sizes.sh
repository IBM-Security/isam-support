#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
instance_id=$4


${CURL} -u "$username:$password" -H "Accept: application/json" -X GET "https://${appliance_hostname}/wga/reverseproxy_logging/instance/${instance_id}"

exit $?
