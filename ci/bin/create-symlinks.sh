#!/bin/sh
[ "$DEBUG" ] && set -x

PWD=`pwd`
TOP=`dirname $PWD`

for file in `find $TOP -name "*.sh"`
do
        if [ "$file" = "$PWD/create-symlinks.sh" ]
        then
                continue
        fi

        if [ "$file" = "$PWD/deploy-pending-changes.sh" ]
        then
                continue
        fi

        ln -s $file .
done

exit $?
