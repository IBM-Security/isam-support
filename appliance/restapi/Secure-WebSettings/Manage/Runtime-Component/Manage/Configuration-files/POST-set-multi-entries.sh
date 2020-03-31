#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
configurationfile=$4
stanza=$5
entry=$6
json=$7
payload=`UTILITY-create-multi-entry-json.sh ${entry} |tail -1`

echo ${payload}
if [ -z ${json} ]
then
	${CURL} -u "$username:$password" -H "Accept: application/json" -X POST -H "Content-type: application/json" --data ${payload} "https://${appliance_hostname}/isam/runtime/${configurationfile}/configuration/stanza/${stanza}/entry_name/${entry}" -vv | JSON.sh
else
	${CURL} -u "$username:$password" -H "Accept: application/json" -X POST -H "Content-type: application/json" --data $payload "https://${appliance_hostname}/isam/runtime/${configurationfile}/configuration/stanza/${stanza}/entry_name/${entry}" -vv
fi

exit $?
