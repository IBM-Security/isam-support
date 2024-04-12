#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
admin_domain=$4
admin_id=$5
admin_pwd=$6
commands=$7

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -H 'Content-Type: application/json' -X POST https://${appliance_hostname}/isam/pdadmin    \
            --data-ascii "{\"admin_domain\":\"$admin_domain\",\"admin_id\":\"$admin_id\",\"admin_pwd\":\"$admin_pwd\",\"commands\":[\"$commands\"]}"

exit $?
