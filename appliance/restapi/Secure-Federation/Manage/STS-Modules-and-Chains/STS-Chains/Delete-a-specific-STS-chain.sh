#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
sts_chain_instance_id=$4

[ "$CURL" ] || CURL="curl -s -k -u "$username:$password""

${CURL} -H 'Accept: application/json' -H 'Content-Type: application/json' -X DELETE https://${appliance_hostname}/iam/access/v8/sts/chains/${sts_chain_instance_id}

exit $?
