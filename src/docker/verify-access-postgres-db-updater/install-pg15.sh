#!/bin/sh
cd /tmp/postgres15/postgresql-15.7
./configure --without-readline --without-zlib --prefix /usr/local/pgsql15
make
su
make install
exit

