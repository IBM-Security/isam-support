#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
bundle=$4

${CURL} -u "$username:$password" -H "Content-type: application/json"		\
				--data-ascii "{\"filename\":\"${bundle}\"}"					\
				-X POST https://${appliance_hostname}/iam/access/v8/bundles

exit $?
