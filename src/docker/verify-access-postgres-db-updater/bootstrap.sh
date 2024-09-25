#!/bin/sh

pwd

cd /tmp

/usr/local/pgsql15/bin/initdb -D /var/lib/postgresql15/data/isva --lc-collate=en_US.utf8 --lc-ctype=en_US.utf8 --locale=en_US.utf8 --lc-messages=en_US.utf8 --lc-monetary=en_US.utf8 --lc-numeric=en_US.utf8 --lc-time=en_US.utf8 -U postgresql
/usr/local/pgsql15/bin/pg_ctl -D /var/lib/postgresql15/data/isva -l logfile start
/usr/local/pgsql15/bin/createuser postgresql -s
/usr/local/pgsql15/bin/pg_ctl -D /var/lib/postgresql15/data/isva -l logfile stop

export LD_LIBRARY=/usr/local/pgsql15/lib
export PATH=$PATH:/usr/local/pgsql15/bin

/usr/local/pgsql15/bin/pg_upgrade -b /usr/local/pgsql9/bin -B /usr/local/pgsql15/bin -d /var/lib/postgresql9/data/isva -D /var/lib/postgresql15/data/isva -U postgresql

cp /var/lib/postgresql9/data/isva/pg_*.conf /var/lib/postgresql15/data/isva
cp /var/lib/postgresql9/data/isva/postgresql.conf /var/lib/postgresql15/data/isva
