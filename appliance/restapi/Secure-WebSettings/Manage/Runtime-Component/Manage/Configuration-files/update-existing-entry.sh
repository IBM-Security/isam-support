#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
configurationfile=$4
stanza=$5
entry=$6
value=$7

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

${CURL} -H "Accept: application/json" -H 'Content-Type: application/json' -X PUT https://${appliance_hostname}/isam/runtime/${configurationfile}/configuration/stanza/${stanza}/entry_name/${entry} --data-ascii '{"value":"${value}"}'

exit $?
