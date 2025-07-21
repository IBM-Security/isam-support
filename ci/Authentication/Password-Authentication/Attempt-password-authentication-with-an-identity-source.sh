#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
id=$3
jwt=$4
payload=$5

rm -f cookie.jar

${CURL} -H "Authorization: Bearer ${access_token}" -H "Accept: application/json" -H "Content-Type: application/json" -X POST "https://${tenant}/v1.0/authnmethods/password/${id}?returnJwt=${jwt}"		\
			--data-ascii @./${payload} --cookie cookie.jar --cookie-jar cookie.jar

exit $?
