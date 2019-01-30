**Geeneric Diagnostic Tools that can be used against many components**

*These are available as-is and are not maintained*

cipherTester.sh - a Bash script that loops through openssl ciphers to confirm which the target server is using
Usage : cipherTester.sh --host `<hostname|ip>` --port `<port>` [-tls1 -tls1_1 -tls1_2 -debug]

-- Note --
Requires 'bash' and 'openssl' to run as intended
