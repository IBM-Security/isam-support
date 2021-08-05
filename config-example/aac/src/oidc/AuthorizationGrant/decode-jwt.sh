#!/bin/sh
[ "$DEBUG" ] && set -x

alias jf='python -mjson.tool'

HEADER=`echo $1 | cut -d "." -f 1`
PAYLOAD=`echo $1 | cut -d "." -f 2`

./base64-decode.pl $HEADER | jf
echo ""
./base64-decode.pl $PAYLOAD | jf

exit 0
