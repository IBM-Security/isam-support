#!/bin/sh
[ "$DEBUG" ] && set -x

HOST=$1
CLIENT_ID=$2
CLIENT_SECRET=$3

curl -v -s -k --cookie cookie.jar --cookie-jar cookie.jar		\
	 "https://$HOST/mga/sps/oauth/oauth20/device_authorize?response_type=device_code&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&redirect_uri=https://isam9070.level2.org/dashboard/" 2>&1 | grep location
