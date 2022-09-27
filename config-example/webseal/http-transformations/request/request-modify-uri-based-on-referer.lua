Control.trace(9,Control.dumpContext())

refj=string.match(HTTPRequest.getHeader('referer'),".*://[^/]+(/[^/]+)")
-- urlj=string.match(HTTPRequest.getURL(),"(/[^/?]+)")
newurl=string.gsub(HTTPRequest.getURL(),"^/[^/?]+",refj,1)

HTTPRequest.setURL(newurl)

