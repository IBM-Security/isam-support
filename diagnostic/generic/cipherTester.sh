# !/bin/bash

hostname=
port=
versions=
debug=0

while [ "$1" != "" ]; do
	case $1 in
		-h | --host ) shift
			hostname=$1
			;;
		-p | --port ) shift
			port=$1
			;;
		-tls1_2 ) versions="$versions -tls1_2"
			;;
		-tls1 ) versions="$versions -tls1"
			;;
		-tls1_1 ) versions="$versions -tls1_1"
			;;
		-debug ) debug=1
			;;
		* ) exit 1
	esac
	shift
done

echo "Input Variables"
echo $hostname
echo $port

echo ""

echo "Input TLS Versions"
echo $versions
echo ""

for cipher in `openssl ciphers|sed -e "s/:/\n/g`
do
	echo $cipher;
	case $debug in
		0) openssl s_client -connect $hostname:$port $versions -cipher $cipher|grep "handshake failure"
			;;
		1) openssl s_client -connect $hostname:$port $versions -cipher $cipher
			;;
	esac
done
