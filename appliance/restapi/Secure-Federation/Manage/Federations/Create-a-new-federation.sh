#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
payload=$4

[ "$CURL" ] && CURL="$CURL -u "$username:$password""

${CURL} -H "Accept: application/json" -H "Content-Type: application/json"		\
		--data-ascii @${payload}													\
		-X POST "https://${appliance_hostname}/iam/access/v8/federations/"

exit $?
