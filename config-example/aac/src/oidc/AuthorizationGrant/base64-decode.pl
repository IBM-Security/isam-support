#!/usr/bin/perl

use MIME::Base64;

$raw =  decode_base64($ARGV[0]);
print($raw);
print("\n");

exit 0
