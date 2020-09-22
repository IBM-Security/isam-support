#!/bin/sh

POD=$1

kubectl cp $POD:var/application.logs.local/wrp/default/trace/pdweb.debug.log $POD.pdweb.debug.log

exit $?
