#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3

[ "$CURL" ] && CURL="$CURL -u "$username:$password""

${CURL} -H "Accept: application/json"												\
		-X GET "https://${appliance_hostname}/mga/runtime_profile/v1"

exit $?
