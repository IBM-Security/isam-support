#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
id=$4

${CURL} -u "$username:$password" -H "Accept: application/octet-stream" -H "Accept: application/json" 	\
		-H "Content-Type: application/json"						\
		-X GET "https://${appliance_hostname}/iam/access/v8/definitions/export/${id}"

exit $?
