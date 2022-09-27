


body=[[
<html>
<head>
<title>Redirect Page</title>
<script type="text/javascript">
window.location="$hvalue";
</script>
</head>
<body>
Redirecting to endpoint
</body>
</head>
</html>
]]

filtered_body=string.gsub(body,"$hvalue",HTTPResponse.getHeader('location'))
HTTPResponse.setBody(filtered_body)
HTTPResponse.setStatusCode(200)
HTTPResponse.setStatusMsg("OK")
