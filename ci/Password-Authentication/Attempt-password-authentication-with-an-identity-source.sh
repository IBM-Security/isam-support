#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

tenant=$1
access_token=$2
id=$3
username=$4
password=$5

${CURL} --header "Authorization: Bearer ${access_token}"				\
	 --header 'Accept: application/json'							\
	 --header 'Content-Type: application/json'						\
	 --request POST													\
	 --url https://${tenant}/v1.0/authnmethods/password/${id}?returnJwt=true		\
	 --data "{\"username\":\"$username\",\"password\":\"$password\"}"

exit $?
