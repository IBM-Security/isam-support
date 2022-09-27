Control.trace(9,Control.dumpContext())

c=HTTPRequest.getCookie('servicesUrl')
if c then
   HTTPRequest.setCookie('servicesUrl','%Fnavigator')
end
