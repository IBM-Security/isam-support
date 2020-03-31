#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
id=$4
stanza=$5
entry=$6
json=$7

if [ ! -z "${json}" ] && [ ${json} -eq 1 ]
then
	${CURL} -u "$username:$password" -H "Accept: application/json" -X GET "https://${appliance_hostname}/wga/reverseproxy/${id}/configuration/stanza/${stanza}/entry_name/${entry}" | JSON.sh
else
	${CURL} -u "$username:$password" -H "Accept: application/json" -X GET "https://${appliance_hostname}/wga/reverseproxy/${id}/configuration/stanza/${stanza}/entry_name/${entry}"
fi

exit $?