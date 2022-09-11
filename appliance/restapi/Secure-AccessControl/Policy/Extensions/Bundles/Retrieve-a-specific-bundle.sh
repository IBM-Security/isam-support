#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
bundle_id=$4

${CURL} -u "$username:$password" -H "Content-type: application/json"		\
				-X GET https://${appliance_hostname}/iam/access/v8/bundles/${bundle_id}

exit $?
