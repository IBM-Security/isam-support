#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2

${CURL} --header "Authorization: Bearer ${access_token}"	\
		--header 'Accept: application/json'					\
		--request GET										\
		--url https://${tenant}/v1.0/authnmethods/password/

exit $?
