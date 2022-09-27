Control.trace(9,Control.dumpContext())

HTTPResponse.setHeader("Location","https://www.example.org/jct/under-maintenance.html")
HTTPResponse.setStatusCode(302)
HTTPResponse.setStatusMsg("Found")
HTTPResponse.setBody("Application is under maintenance")
Control.responseGenerated(true)

