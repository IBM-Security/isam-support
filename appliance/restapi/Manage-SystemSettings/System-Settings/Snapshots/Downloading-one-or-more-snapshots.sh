#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
id=$4

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"		\
	-H "Accept-Encoding: gzip, deflate, br"								\
	-H "Content-Type: application/json"								\
	-X GET https://${appliance_hostname}/snapshots/download?record_ids=$id

exit $?
