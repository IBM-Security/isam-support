#!/usr/bin/perl

use strict;
use warnings;
use Crypt::JWT qw(encode_jwt decode_jwt);
use Crypt::PK::RSA;
use Data::Dumper;

########################
# Encode (Create signature)
########################

my $payload = {
        iss => "issuer",
        sub => "iuser",
        exp => time + 86400,
};

my $keyfile = "key.pem";
my $key = Crypt::PK::RSA->new($keyfile);
my $alg = "RS256";

my $token = encode_jwt(payload => $payload, key => $key, alg => $alg);
print "\n";
print "token: $token\n\n";

########################
# Decode (Verify signature)
########################

my $pubkeyfile = "certificate.pem";
my $pubkey = Crypt::PK::RSA->new($pubkeyfile);
my $data = decode_jwt(token => $token, key => $pubkey);
print Dumper $data;

