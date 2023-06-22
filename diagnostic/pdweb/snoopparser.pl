#!/usr/bin/perl
# This is an unsupported and unmaintained tool.
# Comments more than welcome.
# Snoop parser
# 2018-05-17  Version 1 -- First public version   (Jewel edition)
# 2023-06-21  Version 1.2022.7.6 Added check for per junction snoop files
# Author - Annelise Quap
# aquap@us.ibm.com


# Requires perl version 5.14 or above.
# Usage:
# snoopparser.pl <file to parse> [<threads>] [-i <ignoreThreads>] [-ip <clientipfilter>] [-hbcsrn]
#     <threads> is a single short thread number or a comma separated list of threads to include.
#         You can use the default value 0 to parse all threads.  You only need to specify a 0 if you wish to use the other settings.
#     <ignoreThreads> is a single short thread number or a comma separated list of threads to exclude.
#     <clientipfilter> is an IP address to only show threads started by this IP.
#     -h only prints the snoop status lines.
#     -b remove WebSEAL to back-end part of trace.
#     -c remove client to WebSEAL part of trace.
#     -s remove the status lines.
#     -r raw output mode (use with caution if binary files are in the trace).
#     -n show carriage returns and new lines as \r\n

if ($ARGV[0] eq "") {
   print "You must specify the file to parse\n";
   print "Syntax:\nsnoopparser.pl <file to parse> [<threads>] [-i <ignoreThreads>] [-ip <clientipfilter>] [-hbcsr]\n";
   print "    <threads> is a single short thread number or a comma separated list of threads to include.\n";
   print "        You can use 0 to parse all threads.\n";
   print "    <ignoreThreads> is a single short thread number or a comma separated list of threads to exclude.\n";
   print "    <clientipfilter> is an IP address to only show threads started by this IP .\n";
   print "    -h only prints the snoop status lines.\n";
   print "    -b remove WebSEAL to back-end part of trace.\n";
   print "    -c remove client to WebSEAL part of trace.\n";
   print "    -s remove the status lines.\n";
   print "    -r raw output mode (use with caution if binary files are in the trace).\n";
   print "    -n show carriage returns and new lines as \\r\\n.\n";
   exit(1);
}

$ARGFile = shift(@ARGV);
if (!($ARGV[0] =~ /^\d+$/ || $ARGV[0] =~ /^\d+,\d+.*$/)) {
   $ARGThread = 0;
} else {
   if ($ARGV[0] =~ /^\d+$/) {
      $ARGThread = shift(@ARGV);
      $ARGThreads{$ARGThread} = $ARGThread;
   } elsif ($ARGV[0] =~ /^\d+,\d+.*$/) {
      $ARGThread = shift(@ARGV);
      @ARGThreads{ split(/,/, $ARGThread) } = split(/,/, $ARGThread);
   }
}


if ($ARGV[0] eq "-i") {
   shift(@ARGV);
   $ARGIgnoreThread = shift(@ARGV);
   @ARGIgnoreThreads{ split(/,/, $ARGIgnoreThread) } = (split(/,/, $ARGIgnoreThread));
}

if ($ARGV[0] eq "-ip") {
   shift(@ARGV);
   $ARGCheckClient = 1;
   $ARGClientIP    = shift(@ARGV);
}

$Filename = "";
foreach (@ARGV) {
   if ($_ eq "-h") {
      $ARGHeader = 1;
      $Filename .= ".header";
   } elsif ($_ eq "-c") {
      $ARGClient = 1;
   } elsif ($_ eq "-b") {
      $ARGBackend = 1;
   } elsif ($_ eq "-s") {
      $ARGstripheader = 1;
      $Filename .= ".striped";
   } elsif ($_ eq "-r") {
      $ARGRawBody = 1;
      $Filename .= ".raw";
   } elsif ($_ eq "-n") {
      $ARGShowReturns = 1;
      $Filename .= ".newlines";
   }
}

$WebSEALbuffer = 0;
if ($ARGClient && !$ARGBackend) {
   $Filename = "$ARGFile.$ARGThread.Backend$Filename.out";
} elsif ($ARGBackend && !$ARGClient) {
   $Filename = "$ARGFile.$ARGThread.Client$Filename.out";
} elsif ($ARGBackend && $ARGClient) {
   $Filename = "$ARGFile.$ARGThread.Socket$Filename.out";
} else {
   $Filename = "$ARGFile.$ARGThread$Filename.out";
}
open(OUTFILE, ">$Filename") or die "Can not open filename $Filename\n";
print "Writing output using file name $Filename\n";
binmode(OUTFILE);
open(SNOOPFILE, $ARGFile);
while ($line = <SNOOPFILE>) {
   if ($line =~ /(\d*\-\d*\-\d*\-\d*:\d*:\d*\.\d*).*thread\((\d*)\).*pdweb\.snoop\.(\w*)(?:\.[\/\w]*)?:(\d).*/) {
      $timestamp = $1;
      $thread    = $2;
      $part      = $3;
      $level     = $4;
      if ($level != 1) { next;}
      $line      = <SNOOPFILE>;
      $line      = <SNOOPFILE>;
      chomp($line);

      ## Doesn't handle ICAP and some very rare forms of ISAM8 and ISAM9 yet.
       if ($line =~ /.*local (?:\[::ffff:(.*?)\]|::ffff:(.*?)|\[(.*?)\]|(.*?)):(\d*); remote (?:\[::ffff:(.*?)\]|::ffff:(.*?)|\[(.*?)\]|(.*?)):(\d*)/) {
         $localaddress  = $1 . $2 . $3 . $4;
         $localport     = $5;
         $remoteaddress = $6 . $7 . $8 . $9;
         $remoteport    = $10;

      } else {
         $localaddress  = "";
         $remoteaddress = "";
         $localport     = "";
         $remoteport    = "";
      }
      $line = <SNOOPFILE>;
      if ($line =~ /(\w*) (-?\w*) bytes/) {
         $mode = $1;
         $size = $2;
      } else {
         $mode = $line;
         chomp($mode);
         $size = 0;
      }

      if ($ARGCheckClient) {
         if (($ARGThreads{$thread} || $ARGThread == 0) && (!$ARGIgnoreThreads{$thread})) {
            if ($remoteaddress eq $ARGClientIP) {
               $DisplayThreads{$thread}++;
            } elsif ($DisplayThreads{$thread} && $mode eq "Receiving" && $part eq "client") {
               #Weird WebSEAL issue.
               #Dropping thread $thread as it was used by a new client ($remoteaddress:$remoteport)
               $DisplayThreads{$thread} = 0;
            }
         }
      } else {
         if (($ARGThreads{$thread} || $ARGThread == 0) && (!$ARGIgnoreThreads{$thread})) {
            $DisplayThreads{$thread}++;
         }
      }

      if ($DisplayThreads{$thread}) {
         if ($mode eq "Receiving") {
            if ($part eq "jct") {
               if (!$ARGBackend) {
                  $ShowBody = 1;
                  if (!$ARGstripheader) {
                     if (!$ARGHeader) {
                        print OUTFILE "\n";
                     }
                     print OUTFILE "($thread) $timestamp BackEnd ($remoteaddress:$remoteport) to WebSEAL ($localaddress:$localport) sending $size bytes\n";
                  }
               }
            } else {
               if (!$ARGClient) {
                  $ShowBody = 1;
                  $WebSEALbuffer += $size;
                  if (!$ARGstripheader) {
                     if (!$ARGHeader) {
                        print OUTFILE "\n";
                     }
                     print OUTFILE "($thread) $timestamp Client ($remoteaddress:$remoteport) to WebSEAL ($localaddress:$localport) sending $size bytes\n";
                  }
               }
            }
         } elsif ($mode eq "Sending") {
            if ($part eq "jct") {
               if (!$ARGBackend) {
                  $ShowBody = 1;
                  $WebSEALbuffer -= $size;
                  if (!$ARGstripheader) {
                     if (!$ARGHeader) {
                        print OUTFILE "\n";
                     }
                     print OUTFILE "($thread) $timestamp WebSEAL ($localaddress:$localport) to BackEnd ($remoteaddress:$remoteport) sending $size bytes\n";
                  }
               }
            } else {
               if (!$ARGClient) {
                  $ShowBody = 1;
                  if (!$ARGstripheader) {
                     if (!$ARGHeader) {
                        print OUTFILE "\n";
                     }
                     print OUTFILE "($thread) $timestamp WebSEAL ($localaddress:$localport) to Client ($remoteaddress:$remoteport) sending $size bytes\n";
                  }
               }
            }
         } elsif ($mode eq "Wrote") {
            #skip this mode.
         } else {
            if ($part eq "jct") {
               $targetaddress = "BackEnd";
            } else {
               $targetaddress = "Client";
            }
            if (!(($targetaddress eq "BackEnd" && $ARGBackend) || ($targetaddress eq "Client" && $ARGClient))) {
               if (!$ARGstripheader) {
                  if (!$ARGHeader) {
                     print OUTFILE "\n";
                  }
                  print OUTFILE "($thread) $timestamp WebSEAL ($localaddress:$localport) to $targetaddress ($remoteaddress:$remoteport) $mode\n";
               }
               if ($ARGCheckClient && $mode eq "Closing socket." && $remoteaddress eq $ARGClientIP) {
                  $DisplayThreads{$thread} = 0;
               }
               $ShowBody = 1;
            }
         }
         if (!$ARGHeader && $ShowBody) {
            $transcript = "";
            for ($i = 0; $i < $size / 16; $i++) {
               $line = <SNOOPFILE>;
            $line =~ s/\A0x[0-9A-Fa-f]*   ([0-9A-Fa-f ]{2,39})        .*\z/$1/s;
               $line =~ s/ //g;
               $templine = pack "H*", $line;
               if (!$ARGRawBody) {
                  $templine =~ s{([^\x0d\x0a\t\x20-\x7E])}{'\x'.sprintf('%x',ord($1))}eg;
               }
               if ($ARGShowReturns) {
                  $templine =~ s/\x0d/\\r/g;
                  $templine =~ s/\x0a/\\n/g;
                  $templine =~ s/\\n/\\n\n/g;
               }
               $transcript .= $templine;
            }
            print OUTFILE $transcript;
            $ShowBody = 0;
         }
      }
   }
}
