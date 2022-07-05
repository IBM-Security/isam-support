#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
replica=$4
pattern=$5
max=$6

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -X GET "https://${appliance_hostname}/isam/dsc/admin/replicas/${replica}/sessions?user=${pattern}&max=${max}"

exit $?
