#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
federation_id=$4
partner_id=$5
payload=$6

[ "$CURL" ] && CURL="$CURL -u "$username:$password""

${CURL} -H "Accept: application/json" -H "Content-Type: application/json"			\
		--data-ascii @${payload}													\
		-X PUT "https://${appliance_hostname}/iam/access/v8/federations/${federation_id}/partners/${partner_id}/"

exit $?
