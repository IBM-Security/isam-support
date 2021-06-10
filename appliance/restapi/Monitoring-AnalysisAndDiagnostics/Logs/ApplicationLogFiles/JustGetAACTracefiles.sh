#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3


[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""


for id in `curl -s -k -u admin:admin -H "Accept:application/json"  -X GET 'https://192.168.10.70/isam/application_logs/access_control/runtime'  | jq  -r '.contents[].name' | grep 'trace.*.log'`
do 
   echo $id
   ${CURL} -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" -X GET "https://${appliance_hostname}/isam/application_logs/access_control/runtime/$id?type=File" -o "$id"
done
