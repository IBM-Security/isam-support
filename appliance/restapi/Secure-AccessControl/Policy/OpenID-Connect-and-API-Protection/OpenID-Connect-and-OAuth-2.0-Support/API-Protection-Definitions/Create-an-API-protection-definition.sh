#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3

${CURL} -u "$username:$password" -H "Accept: application/json"	\
		-H "Content-Type: application/json"						\
		--data-ascii @create-definition-payload.json -X POST "https://${appliance_hostname}/iam/access/v8/definitions/"

exit $?
