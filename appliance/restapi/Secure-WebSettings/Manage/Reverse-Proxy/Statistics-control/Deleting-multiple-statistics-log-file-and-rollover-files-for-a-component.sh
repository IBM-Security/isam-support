#!/bin/sh
[ "$DEBUG" ] && set -x

appliance_hostname=$1
username=$2
password=$3
instance_id=$4
component_id=$5
file_to_delete=$6

[ "$CURL" ]  || CURL="curl -s -k -u "$username:$password""

for stat_file in $files_to_delete
do
	echo $stat_file
done


${CURL} -u "$username:$password" -H "Accept: application/json" -X PUT https://${appliance_hostname}/wga/reverseproxy/${instance_id}/statistics/${component_id}/stats_files/?action=delete		\ --data-ascii "{"files":["name":"pdweb.http.2018-07-05-11-32-11","name":"pdweb.http.2018-07-05-23-41-59"]}

exit $?
