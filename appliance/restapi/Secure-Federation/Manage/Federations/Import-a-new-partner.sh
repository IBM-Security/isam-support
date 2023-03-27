#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
federation_id=$4
metadata=$5

[ "$CURL" ] && CURL="$CURL -u "$username:$password""

${CURL} -H "Accept: application/json" 	\
		--form metadata=@${metadata}													\
		-X POST "https://${appliance_hostname}/iam/access/v8/federations/${federation_id}/partners/metadata/"

exit $?
