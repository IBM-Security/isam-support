#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
bundle_id=$4
bundle=$5

${CURL} -u "$username:$password" -H "Accept: application/json"									\
				--data-ascii "{\"filename\":\"@${bundle}\"}"                 					\
				-X PUT https://${appliance_hostname}/iam/access/v8/bundles/${bundle_id}/file

exit $?
