#!/bin/sh
apk update
apk add shadow
apk add tar
apk add gcc
apk add g++
apk add make
apk add linux-headers

groupadd -g 70 postgresql
useradd -u 70 -g 70 -d /tmp postgresql

mkdir /var/run/postgresql9
chown postgresql:postgresql /var/run/postgresql9

mkdir -p /var/lib/postgresql9/data/isva
chown -R postgresql:postgresql /var/lib/postgresql9

mkdir /var/run/postgresql15
chown postgresql:postgresql /var/run/postgresql15 

mkdir -p /var/lib/postgresql15/data/isva
chown -R postgresql:postgresql /var/lib/postgresql15

mkdir -p /usr/local/pgsql9
chown postgresql:postgresql /usr/local/pgsql9

mkdir -p /usr/local/pgsql15
chown postgresql:postgresql /usr/local/pgsql15

mkdir /tmp/postgres9
mkdir /tmp/postgres15

tar -xf /tmp/postgresql-9.6.24.tar -C /tmp/postgres9
tar -xf /tmp/postgresql-15.7.tar -C /tmp/postgres15

chown -R postgresql:postgresql /tmp/postgres*

chmod 755 /tmp/install*.sh

su postgresql -c "/tmp/install-pg9.sh"

su postgresql -c "/tmp/install-pg15.sh"

chmod 755 /tmp/bootstrap.sh
chown postgresql:postgresql /tmp/bootstrap.sh

apk del linux-headers
apk del make
apk del shadow
apk del g++
apk del gcc
apk del tar

apk cache clean

rm -rf /tmp/post*
