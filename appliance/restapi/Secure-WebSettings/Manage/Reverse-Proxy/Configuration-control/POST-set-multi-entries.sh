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
inputtype=$8
if [ ! -z ${inputtype} ]
then
	if [ ${inputtype} -eq "json" ]
	then
		payload=`UTILITY_input-json_output-json_create-multiple-entries.sh ${entry} |tail -1`
	elif [ ${inputtype} -eq "csv" ]
	then
		payload=`UTILITY_input-csv_output-json_create-multiple-entries.sh ${entry} |tail -1`
	else
		printf "Invalid file type specified\n"
	fi
else
	printf "No input file type specified, defaulting to JSON input\n"
	payload=`UTILITY-create-multi-entry-json.sh ${entry} |tail -1`
fi
	

echo ${payload}
if [ -z ${json} ]
then
	${CURL} -u "$username:$password" -H "Accept: application/json" -X POST -H "Content-type: application/json" --data ${payload} "https://${appliance_hostname}/wga/reverseproxy/${id}/configuration/stanza/${stanza}/entry_name/${entry}" -vv | JSON.sh
else
	${CURL} -u "$username:$password" -H "Accept: application/json" -X POST -H "Content-type: application/json" --data $payload "https://${appliance_hostname}/wga/reverseproxy/${id}/configuration/stanza/${stanza}/entry_name/${entry}" -vv
fi

exit $?
