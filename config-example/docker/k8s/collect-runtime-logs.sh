#!/bin/sh

POD=$1

kubectl cp $POD:var/application.logs.local/rtprofile/messages.log $POD.messages.log
kubectl cp $POD:var/application.logs.local/rtprofile/trace.log $POD.trace.log

exit $?
