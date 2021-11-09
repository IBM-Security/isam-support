#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
user_name=$4
new_password=$5

${CURL} -u "$username:$password" -H 'Accept: application/json' -X PUT https://${appliance_hostname}/core/sysaccount/users/${user_name}/v1	\
				--data-ascii "{\"password\":\"$new_password\"}"

exit $?
