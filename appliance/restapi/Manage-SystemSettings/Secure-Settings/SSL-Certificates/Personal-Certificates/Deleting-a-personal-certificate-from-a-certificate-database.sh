#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
kdb_id=$4
cert_id=$5

[ "$CURL" ] || CURL="curl -s -k -u $username:$password"

${CURL} -u "$username:$password" -H "Accept: application/json" -X DELETE "https://${appliance_hostname}/isam/ssl_certificates/${kdb_id}/personal_cert/${cert_id}"

exit $?
