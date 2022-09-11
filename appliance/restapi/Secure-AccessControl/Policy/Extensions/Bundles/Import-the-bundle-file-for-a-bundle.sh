#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3
bundle_id=$4
bundle=$5

${CURL} -u "$username:$password" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"		\
				 -H "Content-type: multipart/form-data"																					\
				--form import_file=${bundle} 																							\
				--form file=@${bundle}                                                                          						\
				-X POST https://${appliance_hostname}/iam/access/v8/bundles/${bundle_id}/file

exit $?
