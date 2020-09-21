#!/bin/sh

kubectl exec --stdin=true $1  -- isam_cli -v -e -c isam admin<<EOF
login -a sec_master -p password
s t $1 trace set pdweb.debug 9 file path=pdweb.debug.log
EOF

exit $?
