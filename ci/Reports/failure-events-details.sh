#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ] || CURL="curl -s -k"

alias jf='python -mjson.tool'

tenant=$1
access_token=$2
log=$3

echo "Pulling Failed Authentication events for ${tenant}"


for event in `grep _id ${log} | awk -F\: '{ print $2 }' | awk -F\" '{ print $2 }'`
do
    echo $event
    echo "{\"EVENTID\":\"${event}\"}" > temp.json
    ./reports.sh ${tenant} ${access_token} auth_event_details temp.json  | jf
    echo ""
done
