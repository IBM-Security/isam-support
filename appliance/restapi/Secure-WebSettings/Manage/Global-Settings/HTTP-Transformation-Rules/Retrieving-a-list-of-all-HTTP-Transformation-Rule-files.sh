#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3

${CURL} -u "$username:$password" -H "Accept: application/json" -H "Content-Type: applicaton/json" -X GET "https://${appliance_hostname}/wga/http_transformation_rules/"

exit $?
