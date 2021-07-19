#!/usr/bin/perl

use Time::Local;
use POSIX qw(strftime);

print "Thread\tBrowser => PD\tPD => BackEnd\tBackend => PD\tPD => Browser\tPD Delay 1\tBackend Delay\tPD Delay 2\tRequest\n";

my $delay   =   0;
my $segment =  '';    # need to init out of loop so it can be used to process next lines

while (<>) {
    # print;
    chomp;

    # This Regex needs to check for 30 min time zones
    # Matches 'yyyy-mm-dd-hh:mm:ss.sss-oo:00I----- thread(tnum) [source reference] ---------------- component ===> component -----------------'
    # Also matches 'yyyy-mm-dd-hh:mm:ss.1sss-oo:00I----- thread(tnum) [source reference] ---------------- component ===> component -----------------'
    
    if ( /^(\d{4})-(\d{2})-(\d{2})-(\d{2}):(\d{2}):(\d{2})\.(1?\d{3})[-+]\d{2}:[03]0I----- thread\((\d+)\) trace.pdweb.debug.* ----------------- (\w+) ([<=]==[=>]) (\w+) -----------------/){
        # fixing indenting
        # print "Matched timestamp of ";
        $frac = substr( $7 / 1000 + 0.0001, 1, 4 );
        # print $frac, "-", $6, "-", $5, "-", $4, "-", $3, "-", $2, "-", $1, "-", $_, "\n";
        $time = timelocal( $6, $5, $4, $3, $2 - 1, $1 - 1900 ) + $frac;
        $thread = $8;
        if ( $10 eq '===>' ) {
            $segment = $9 . '2' . $11;
        }
        else {
            $segment = $11 . '2' . $9;
        }
        # print $time, " ", $thread, " ", $segment, "\n";
        $time{$thread}{$segment} = $time;
        $frac{$thread}{$segment} = $frac;
        if ( $segment eq "PD2Browser" ) {
            if (    exists $time{$thread}{'Browser2PD'}
                and exists $time{$thread}{'PD2Browser'} ) {
                # fixing indenting
                if ( $time{$thread}{'PD2Browser'} -
                    $time{$thread}{'Browser2PD'} > $delay ) {
                    print $thread, "\t";
                    if (    exists $time{$thread}{'PD2BackEnd'}
                        and exists $time{$thread}{'BackEnd2PD'} ) {
                        print 
                            strftime( "%H:%M:%S", localtime $time{$thread}{'Browser2PD'} ), $frac{$thread}{'Browser2PD'}, "\t",
                            strftime( "%H:%M:%S", localtime $time{$thread}{'PD2BackEnd'} ), $frac{$thread}{'PD2BackEnd'}, "\t",
                            strftime( "%H:%M:%S", localtime $time{$thread}{'BackEnd2PD'} ), $frac{$thread}{'BackEnd2PD'}, "\t",
                            strftime( "%H:%M:%S", localtime $time{$thread}{'PD2Browser'} ), $frac{$thread}{'PD2Browser'}, "\t";
                        $pd1 = $time{$thread}{'PD2BackEnd'} - $time{$thread}{'Browser2PD'};
                        $be  = $time{$thread}{'BackEnd2PD'} - $time{$thread}{'PD2BackEnd'};
                        $pd2 = $time{$thread}{'PD2Browser'} - $time{$thread}{'BackEnd2PD'};
                        #printf "\tDelay:\t\tPD\t%6.3f secs\t\tBackEnd\t%6.3f secs\t\tPD\t%6.3f secs\n", $pd1, $be, $pd2;
                        printf "%6.3f\t%6.3f\t%6.3f\t", $pd1, $be, $pd2;
                    } else {
                        print 
                            strftime( "%H:%M:%S", localtime $time{$thread}{'Browser2PD'} ), $frac{$thread}{'Browser2PD'}, "\t\t\t",
                            strftime( "%H:%M:%S", localtime $time{$thread}{'PD2Browser'} ), $frac{$thread}{'PD2Browser'}, "\t";
                        $pd  = $time{$thread}{'PD2Browser'} - $time{$thread}{'Browser2PD'};
                        #printf "\tDelay:\t\t\t\t\t\tPD\t%6.3f secs\n", $pd;
                        printf "\t\t%6.3f\t", $pd;
                    }
                    print $time{$thread}{'request'}, "\n";
                }
            }
            undef( $time{$thread} );
            undef( $frac{$thread} );
        }
    } elsif ( $segment eq "Browser2PD" and /^(GET|HEAD|POST)\s(\S+)/i ) {
        $time{$thread}{'request'} = $1 . ' ' . $2;
        # print $1, " ", $2, "\n";
    }
}
