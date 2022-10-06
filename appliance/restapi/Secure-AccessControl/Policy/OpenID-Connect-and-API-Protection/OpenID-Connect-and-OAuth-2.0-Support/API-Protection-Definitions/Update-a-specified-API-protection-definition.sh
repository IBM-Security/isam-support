#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
id=$4
payload=$5

${CURL} -u "$username:$password" -H "Accept: application/json"	\
		-H "Content-Type: application/json"						\
		--data-ascii @${payload} -X PUT "https://${appliance_hostname}/iam/access/v8/definitions/${id}"

exit $?
