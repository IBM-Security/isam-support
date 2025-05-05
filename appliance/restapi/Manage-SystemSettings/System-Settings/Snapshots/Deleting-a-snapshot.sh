#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
id=$4

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: */*"       	       	\
       	-H "Accept-Encoding: gzip, deflate, br"	       	       	       	       	       	       	       	\
       	-X DELETE https://${appliance_hostname}/snapshots/${id}

exit $?
