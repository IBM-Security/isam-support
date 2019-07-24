#!/bin/sh
#
# Update the actual call with resource and simple grep for expected output
# to keep output to a minimum.
#

HOST=$1
USER=$2
PASSWORD=$3

rm -rf cookie.jar*

while :
do
    for count in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30
    do
            num=$RANDOM
            ./pkmslogin.sh $HOST $USER $PASSWORD cookie.jar.$num > /dev/null 2>&1
            curl -s -k --cookie cookie.jar.$num --cookie-jar cookie.jar.$num -X GET https://${HOST}/jct/AAC/simple-geoLocation.html | grep "Your geoLocation" &
    done

    echo "BLOCK DONE"

    sleep 1
done
