-- Uncomment this if you don't need JavaScript to access the cookie
HTTPResponse.setCookie("COOKIE_NAME1","VALUE; Path=/; Secure; HTTPOnly");

-- Uncomment this if you need to allow JavaScript to access the cookie
HTTPResponse.setCookie("COOKIE_NAME2","VALUE; Path=/; Secure");

-- Uncomment this if you need to allow JavaScript to access the cookie with SameSite
HTTPResponse.setCookie("COOKIE_NAME2","VALUE; Path=/; Secure; HTTPOnly; SameSite=None");


