FROM alpine:latest

LABEL Version="24.09"
LABEL Description="ISVA L2 Postgresql Database version updater"
LABEL Maintainer="Jack Yarborough"
LABEL EMAIL="jcyarbor@us.ibm.com"

USER root

COPY install-pg9.sh install-pg15.sh postgresql-9.6.24.tar postgresql-15.7.tar bootstrap.sh setup.sh /tmp

RUN /tmp/setup.sh

USER postgresql

RUN cd /tmp

ENTRYPOINT /tmp/bootstrap.sh
