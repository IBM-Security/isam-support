#!/bin/sh
[ "$DEBUG" ] && set -x
[ "$CURL" ]  || CURL="curl -s -k"

appliance_hostname=$1
username=$2
password=$3

./run-cli-command.sh $appliance_hostname $username $password "tools connections" | sed -e 's/\\n/\n/g'

exit $?
