#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$DEBUG" ] && VERBOSE="-v"

appliance_hostname=$1
username=$2
password=$3
metadata_name=$4

[ "$CURL" ]  || CURL="curl $VERBOSE -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -X GET https://${appliance_hostname}/isam/container_ext/metadata/${metadata_name}

exit $?
