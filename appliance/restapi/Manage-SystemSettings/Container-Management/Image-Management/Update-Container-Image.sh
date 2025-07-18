#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$DEBUG" ] && VERBOSE="-v"

appliance_hostname=$1
username=$2
password=$3
image_id=$4

[ "$CURL" ]  || CURL="curl $VERBOSE -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -X PUT https://${appliance_hostname}/isam/container_ext/image/${image_id}

exit $?
