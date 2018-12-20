#!/bin/sh
[ "$DEBUG" ] && set -x

PWD=`pwd`
TOP=`dirname $PWD`

find $TOP -name "*.sh" -exec ln -s {} . \;

exit $?
