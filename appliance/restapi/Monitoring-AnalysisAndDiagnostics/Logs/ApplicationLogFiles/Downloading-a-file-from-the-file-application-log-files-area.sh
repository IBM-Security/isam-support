#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
file=$4

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" -X GET "https://${appliance_hostname}/isam/application_logs/$file?type=File"

exit $?
