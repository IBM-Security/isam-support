#!/bin/sh -x

keytool \
    -importkeystore              \
    -srckeystore    /usr/local/java/ibm-semeru/jdk-17.0.7+7/lib/security/cacerts	\
    -destkeystore   KEYSTORE.p12 \
    -srcstoretype   JKS          \
    -deststoretype  PKCS12       \
    -srcstorepass   changeit     \
    -deststorepass  password     \
    -srcalias       mykey      \
    -destalias      mykey      \
    -noprompt
