#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
instance_id=$4
id=$5
new_directory_name=$6

${CURL} -u "$username:$password" -H "Accept: application/json, text/javascript, */*; q=0.01"                \
            -H "Content-Type: application/json"                                                             \
            -X POST https://${appliance_hostname}/wga/reverseproxy/${instance_id}/management_root/${id}     \
            --data-ascii "{\"dir_name\":\"$new_directory_name\",\"type\":\"dir\"}"

exit $?
