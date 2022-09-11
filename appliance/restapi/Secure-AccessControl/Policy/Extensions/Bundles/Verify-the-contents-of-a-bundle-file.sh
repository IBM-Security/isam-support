#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
bundle=$4

${CURL} -u "$username:$password" -H "Content-type: multipart/form-data"		\
				--form import_file=${bundle}								\
				--form file=@${bundle}										\
				-X POST https://${appliance_hostname}/iam/access/v8/bundles/verify

exit $?
