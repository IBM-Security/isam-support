// Author: jcyarbor@us.ibm.com
// Title: timeout.go
//
// Resources and References:
//	https://gobyexample.com/http-servers
//	https://stackoverflow.com/questions/17573190/how-to-multiply-duration-by-integer
//	https://freshman.tech/snippets/go/extract-url-query-params/
//	https://stackoverflow.com/questions/38511526/check-empty-float-or-integer-value-in-golang
//	https://pkg.go.dev/strconv#Atoi
// 
// Description: A simple HTTP server that has a single endpoint, timeout, that takes an optional query parameter, timeout.
// 		The script will timeout in seconds equivalent to the query parameter or after 31 seconds by default.
//
// Execution: go run timeout.go &
//
package main

import (
  "fmt"
  "net/http"
  "time"
  "strconv"
)

func timeout(w http.ResponseWriter, req *http.Request) {

	// This is a string so we have to convert to int
	var reqTimeout = req.URL.Query().Get("timeout")
	var reqTimeoutInt, err = strconv.Atoi(reqTimeout)
	var timeout int
	
	fmt.Fprintf(w, "error converting query parameter to int: %s\n", err)
	
	fmt.Fprintf(w, "timeout query parameter value: %d\n", reqTimeoutInt)
	
	if reqTimeoutInt > 0 && reqTimeoutInt != 0 {
		timeout = reqTimeoutInt
	} else {
		timeout = 31
	}
	
	time.Sleep(time.Duration(timeout) * time.Second);
  fmt.Fprintf(w, "hello\nYou waited for %d seconds", timeout)
}

func main() {
	http.HandleFunc("/timeout",timeout)
  http.ListenAndServe(":8090", nil)
}
