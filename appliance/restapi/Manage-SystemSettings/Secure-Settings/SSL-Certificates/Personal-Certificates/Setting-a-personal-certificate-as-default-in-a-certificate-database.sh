#!/bin/sh -x
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
kdb_id=$4
cert_id=$5

[ "$CURL" ] || CURL="curl -v -s -k -u $username:$password"

${CURL} -u "$username:$password" -H "Accept: application/json,text/javascript,*/*;q=0.01" "Content-Type: application/json" -X PUT "https://${appliance_hostname}/isam/ssl_certificates/${kdb_id}/personal_cert/${cert_id}"      \
        --data-ascii '{"default":"yes"}'

exit $?

