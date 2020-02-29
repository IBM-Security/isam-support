#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
kdb_id=$4
cert=$5
passphrase=$6

[ "$CURL" ] || CURL="curl -s -k -u $username:$password"

${CURL} -H "Accept: application/json" -X POST "https://${appliance_hostname}/isam/ssl_certificates/${kdb_id}/personal_cert"	\
			--form cert=@${cert} --form password="${passphrase}" --form operation=import/

exit $?
