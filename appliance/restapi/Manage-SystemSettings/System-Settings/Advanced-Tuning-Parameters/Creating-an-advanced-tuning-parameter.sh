#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname="$1"
username="$2"
password="$3"
key=$4
value=$5
comment=$6

${CURL} -u "$username:$password" -H "Accept: application/json,application/javascript" -H "Content-Type: application/json"       \
                                --data-ascii "{\"comment\":\"$comment\",\"key\":\"$key\",\"value\":\"$value\"}"                 \
                                -X POST https://${appliance_hostname}/adv_params/

exit $?
