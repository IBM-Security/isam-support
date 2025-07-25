#!/bin/sh
set -x

ADMIN_ID=$1
PASSWORD=$2
APPSVR_ID=$3
POLICYSVR=$4
AUTHZSVR=$5
CFG_FILE=$6
KEY_FILE=$7

java -cp $PDJAR --add-exports java.base/sun.security.util=ALL-UNNAMED --add-opens java.base/sun.security.pkcs10=ALL-UNNAMED --add-exports java.base/sun.security.pkcs10=ALL-UNNAMED --add-opens java.base/sun.security.x509=ALL-UNNAMED --add-exports java.base/sun.security.x509=ALL-UNNAMED --add-opens java.base/sun.security.util=ALL-UNNAMED --add-exports java.base/sun.security.util=ALL-UNNAMED -Djavax.net.debug=all com.tivoli.pd.jcfg.SvrSslCfg -action config										\
                                  -admin_id "${ADMIN_ID}" -admin_pwd "${PASSWORD}"		\
                                  -appsvr_id "${APPSVR_ID}" -port 9999					\
                                  -mode remote -dbdir .									\
                                  -policysvr "${POLICYSVR}"								\
                                  -authzsvr "${AUTHZSVR}"								\
                                  -cfg_file "${CFG_FILE}"								\
                                  -key_file "${KEY_FILE}"								\
                                  -cfg_action create

exit $?
