#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$DEBUG" ] && VERBOSE="-v"

appliance_hostname=$1
username=$2
password=$3

[ "$CURL" ]  || CURL="curl $VERBOSE -s -k -u "$username:$password""

for id in `${CURL} -H "Accept:application/json"  -X GET "https://${appliance_hostname}/isam/application_logs/access_control/runtime"  | jq  -r '.contents[].name' | grep 'messages.*.log'`
do 
   echo $id
   ${CURL} -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" -X GET "https://${appliance_hostname}/isam/application_logs/access_control/runtime/$id?type=File" -o "$id"
done
