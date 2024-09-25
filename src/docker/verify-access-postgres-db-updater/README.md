# verify-access-postgres-db-updater

Created to address the following errors when starting the 'verify-access-postgresql' container at versions '10.0.7.0' and higher:
>2024-09-18 15:33:46.822 UTC [1] FATAL:  database files are incompatible with server
>
>2024-09-18 15:33:46.822 UTC [1] DETAIL:  The data directory was initialized by PostgreSQL version 9.6, which is not compatible with this version 15.7.

The PostgreSQL version changed from 9.6.24 in IBM Security Verify Access (ISVA) firmware version 10.0.6.0 to version 15.7 in ISVA firmware versions 10.0.7.0+.
The format of the PostgreSQL 9.X database is not compatible with 15.7 format.

To continue to use the data from firmware versions prior to 10.0.6.0 when using the ISVA PostgreSQL Docker container please use
this utility to upgrade the database version.

## USAGE:
1) Create a new volume for the PostgreSQL 15.7 data:  
docker volume create var-lib-postgresql15-data  
 - If you are using a project with docker compose use the following command:  
docker volume create var-lib-postgresql15-data --label com.docker.compose.project=<project_name>

2) Download the following files into a directory:  
bootstrap.sh  
Dockerfile  
install-pg9.sh  
install-pg15.sh  
setup.sh  

3) Download the source package for PostgreSQL 9.6.24 and PostgreSQL 15.7 for Linux from the following location into this directory:  
https://ftp.postgresql.org/pub/source/v9.6.24/postgresql-9.6.24.tar.gz  
https://ftp.postgresql.org/pub/source/v15.7/postgresql-15.7.tar.gz

5) Unzip the archives to tarballs:  
gunzip postgresql-9.6.24.tar.gz  
gunzip postgresql-15.7.tar.gz

6) Build the container from the Dockerfile:  
docker build -f Dockerfile ./ -t verify-access-postgres-db-updater:24.09

-- This will take about 15 minutes to build since it has to install and compile PostgreSQL from source.

6) Run the docker container to perform the upgrade  
docker run --name isva-pg-updater -it --volume var-lib-postgresql-data:/var/lib/postgresql9/data --volume var-lib-postgresql15-data:/var/lib/postgresql15/data verify-access-postgres-db-updater:24.09

The original data will be held in the '<var-lib-postgresql-data>' volume and the new data will be in the 'var-lib-postgresql15-data' volume.
After the container finishes successfully you should update your docker-compose.yaml files to reference the 'var-lib-postgresql15-data' volume.

7) Remove the docker container:  
docker rm isva-pg-updater

## Contact
If you have any questions please contact please open a support case:  
https://www.ibm.com/mysupport/s/?language=en_US
