#/bin/sh -x
set -x

tenant=$1
client_id=$2
username=$3
password=$4
client_id=$2

curl -s -k -H "Accept: application/json"	\
		--data-ascii "grant_type=password&username=${username}&password=${password}&client_id=${client_id}&response_type=id_token"	\
		-X POST https://${tenant}/oauth2/token

exit $?
