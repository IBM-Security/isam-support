#!/bin/sh

tenant=$1
access_token=$2
payload=$3

curl -v -s -k 	-H "Content-Type: application/scim+json;charset=utf-8"	\
				-H "Accept: application/json, text/plain, */*"			\
				-H "accept-encoding: gzip, deflate, br, zstd"			\
				-H "Authorization: Bearer ${access_token}"				\
				-X POST https://${tenant}/v2.0/Bulk --data-ascii @${payload}
