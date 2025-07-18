#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"
alias jf='python -mjson.tool'

tenant=$1
access_token=$2
applicationId=$3
payload=$4

${CURL} -H "Authorization: Bearer ${access_token}"	\
		-H "Content-Type: application/json"			\
		-X PUT "https://${tenant}/v1.0/applications/${applicationId}"		\
		--data-ascii @./${payload}

exit $?
