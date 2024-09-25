#!/bin/sh
cd /tmp/postgres9/postgresql-9.6.24
./configure --without-readline --without-zlib --prefix /usr/local/pgsql9
make
su
make install
exit

