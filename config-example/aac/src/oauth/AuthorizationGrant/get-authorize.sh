#!/bin/sh
[ "$DEBUG" ] && set -x

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3

curl -v -s -k --cookie cookie.jar --cookie-jar cookie.jar		\
	 "https://$HOST/mga/sps/oauth/oauth20/authorize?response_type=code&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET" 2>&1 | grep location

