
--[[
   Use the following configuration file entries to successfully invoke the http transformation:
   [http-transformations]
   ...
   O365mex = O365mex

   [http-transformations:O365mex]
   request-match = request:* /TrustServerWST13/mex
   xslt-buffer-size = 409600

   Need to replace '@POINTOFCONTACT@' with a URL of your Point of Contact URL :
   example : https://isam9071.hyperv.lab
]]
output=[[<?xml version="1.0"?>
<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing">
  <s:Header>
    <a:Action s:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2004/09/transfer/GetResponse</a:Action>
    <a:RelatesTo>1386375951</a:RelatesTo>
  </s:Header>
  <s:Body>
    <Metadata xmlns="http://schemas.xmlsoap.org/ws/2004/09/mex" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsx="http://schemas.xmlsoap.org/ws/2004/09/mex">
      <wsx:MetadataSection xmlns="" Dialect="http://schemas.xmlsoap.org/wsdl/" Identifier="http://schemas.microsoft.com/ws/2008/06/identity/securitytokenservice">
        <wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:t="http://schemas.xmlsoap.org/ws/2005/02/trust" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:tns="http://schemas.microsoft.com/ws/2008/06/identity/securitytokenservice" xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl" xmlns:wsap="http://schemas.xmlsoap.org/ws/2004/08/addressing/policy" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:trust="http://docs.oasis-open.org/ws-sx/ws-trust/200512" xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" xmlns:wsa10="http://www.w3.org/2005/08/addressing" name="SecurityTokenService" targetNamespace="http://schemas.microsoft.com/ws/2008/06/identity/securitytokenservice">
          <wsp:Policy wsu:Id="UserNameWSTrustBinding_IWSTrustFeb2005Async_policy">
            <wsp:ExactlyOne>
              <wsp:All>
                <sp:TransportBinding xmlns:sp="http://schemas.xmlsoap.org/ws/2005/07/securitypolicy">
                  <wsp:Policy>
                    <sp:TransportToken>
                      <wsp:Policy>
                        <sp:HttpsToken RequireClientCertificate="false"/>
                      </wsp:Policy>
                    </sp:TransportToken>
                    <sp:AlgorithmSuite>
                      <wsp:Policy>
                        <sp:Basic256/>
                      </wsp:Policy>
                    </sp:AlgorithmSuite>
                    <sp:Layout>
                      <wsp:Policy>
                        <sp:Strict/>
                      </wsp:Policy>
                    </sp:Layout>
                    <sp:IncludeTimestamp/>
                  </wsp:Policy>
                </sp:TransportBinding>
                <sp:SignedSupportingTokens xmlns:sp="http://schemas.xmlsoap.org/ws/2005/07/securitypolicy">
                  <wsp:Policy>
                    <sp:UsernameToken sp:IncludeToken="http://schemas.xmlsoap.org/ws/2005/07/securitypolicy/IncludeToken/AlwaysToRecipient">
                      <wsp:Policy>
                        <sp:WssUsernameToken10/>
                      </wsp:Policy>
                    </sp:UsernameToken>
                  </wsp:Policy>
                </sp:SignedSupportingTokens>
                <sp:EndorsingSupportingTokens xmlns:sp="http://schemas.xmlsoap.org/ws/2005/07/securitypolicy">
                  <wsp:Policy>
                    <mssp:RsaToken xmlns:mssp="http://schemas.microsoft.com/ws/2005/07/securitypolicy" sp:IncludeToken="http://schemas.xmlsoap.org/ws/2005/07/securitypolicy/IncludeToken/Never" wsp:Optional="true"/>
                    <sp:SignedParts>
                      <sp:Header Name="To" Namespace="http://www.w3.org/2005/08/addressing"/>
                    </sp:SignedParts>
                  </wsp:Policy>
                </sp:EndorsingSupportingTokens>
                <sp:Wss11 xmlns:sp="http://schemas.xmlsoap.org/ws/2005/07/securitypolicy">
                  <wsp:Policy>
                    <sp:MustSupportRefKeyIdentifier/>
                    <sp:MustSupportRefIssuerSerial/>
                    <sp:MustSupportRefThumbprint/>
                    <sp:MustSupportRefEncryptedKey/>
                  </wsp:Policy>
                </sp:Wss11>
                <sp:Trust10 xmlns:sp="http://schemas.xmlsoap.org/ws/2005/07/securitypolicy">
                  <wsp:Policy>
                    <sp:MustSupportIssuedTokens/>
                    <sp:RequireClientEntropy/>
                    <sp:RequireServerEntropy/>
                  </wsp:Policy>
                </sp:Trust10>
                <wsaw:UsingAddressing/>
              </wsp:All>
            </wsp:ExactlyOne>
          </wsp:Policy>
          <wsp:Policy wsu:Id="UserNameWSTrustBinding_IWSTrust13Async_policy">
            <wsp:ExactlyOne>
              <wsp:All>
                <sp:TransportBinding xmlns:sp="http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702">
                  <wsp:Policy>
                    <sp:TransportToken>
                      <wsp:Policy>
                        <sp:HttpsToken/>
                      </wsp:Policy>
                    </sp:TransportToken>
                    <sp:AlgorithmSuite>
                      <wsp:Policy>
                        <sp:Basic256/>
                      </wsp:Policy>
                    </sp:AlgorithmSuite>
                    <sp:Layout>
                      <wsp:Policy>
                        <sp:Strict/>
                      </wsp:Policy>
                    </sp:Layout>
                    <sp:IncludeTimestamp/>
                  </wsp:Policy>
                </sp:TransportBinding>
                <sp:SignedEncryptedSupportingTokens xmlns:sp="http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702">
                  <wsp:Policy>
                    <sp:UsernameToken sp:IncludeToken="http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/AlwaysToRecipient">
                      <wsp:Policy>
                        <sp:WssUsernameToken10/>
                      </wsp:Policy>
                    </sp:UsernameToken>
                  </wsp:Policy>
                </sp:SignedEncryptedSupportingTokens>
                <sp:EndorsingSupportingTokens xmlns:sp="http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702">
                  <wsp:Policy>
                    <sp:KeyValueToken sp:IncludeToken="http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702/IncludeToken/Never" wsp:Optional="true"/>
                    <sp:SignedParts>
                      <sp:Header Name="To" Namespace="http://www.w3.org/2005/08/addressing"/>
                    </sp:SignedParts>
                  </wsp:Policy>
                </sp:EndorsingSupportingTokens>
                <sp:Wss11 xmlns:sp="http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702">
                  <wsp:Policy>
                    <sp:MustSupportRefKeyIdentifier/>
                    <sp:MustSupportRefIssuerSerial/>
                    <sp:MustSupportRefThumbprint/>
                    <sp:MustSupportRefEncryptedKey/>
                  </wsp:Policy>
                </sp:Wss11>
                <sp:Trust13 xmlns:sp="http://docs.oasis-open.org/ws-sx/ws-securitypolicy/200702">
                  <wsp:Policy>
                    <sp:MustSupportIssuedTokens/>
                    <sp:RequireClientEntropy/>
                    <sp:RequireServerEntropy/>
                  </wsp:Policy>
                </sp:Trust13>
                <wsaw:UsingAddressing/>
              </wsp:All>
            </wsp:ExactlyOne>
          </wsp:Policy>
          <wsdl:types>
            <xsd:schema targetNamespace="http://schemas.microsoft.com/ws/2008/06/identity/securitytokenservice/Imports">
              <xsd:import namespace="http://schemas.microsoft.com/Message"/>
              <xsd:import namespace="http://schemas.xmlsoap.org/ws/2005/02/trust"/>
              <xsd:import namespace="http://docs.oasis-open.org/ws-sx/ws-trust/200512"/>
            </xsd:schema>
          </wsdl:types>
          <wsdl:message name="IWSTrustFeb2005Async_TrustFeb2005IssueAsync_InputMessage">
            <wsdl:part name="request" element="t:RequestSecurityToken"/>
          </wsdl:message>
          <wsdl:message name="IWSTrustFeb2005Async_TrustFeb2005IssueAsync_OutputMessage">
            <wsdl:part name="TrustFeb2005IssueAsyncResult" element="t:RequestSecurityTokenResponse"/>
          </wsdl:message>
          <wsdl:message name="IWSTrust13Async_Trust13IssueAsync_InputMessage">
            <wsdl:part name="request" element="trust:RequestSecurityToken"/>
          </wsdl:message>
          <wsdl:message name="IWSTrust13Async_Trust13IssueAsync_OutputMessage">
            <wsdl:part name="Trust13IssueAsyncResult" element="trust:RequestSecurityTokenResponseCollection"/>
          </wsdl:message>
          <wsdl:portType name="IWSTrustFeb2005Async">
            <wsdl:operation name="TrustFeb2005IssueAsync">
              <wsdl:input wsaw:Action="http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue" message="tns:IWSTrustFeb2005Async_TrustFeb2005IssueAsync_InputMessage"/>
              <wsdl:output wsaw:Action="http://schemas.xmlsoap.org/ws/2005/02/trust/RSTR/Issue" message="tns:IWSTrustFeb2005Async_TrustFeb2005IssueAsync_OutputMessage"/>
            </wsdl:operation>
          </wsdl:portType>
          <wsdl:portType name="IWSTrust13Async">
            <wsdl:operation name="Trust13IssueAsync">
              <wsdl:input wsaw:Action="http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue" message="tns:IWSTrust13Async_Trust13IssueAsync_InputMessage"/>
              <wsdl:output wsaw:Action="http://docs.oasis-open.org/ws-sx/ws-trust/200512/RSTRC/IssueFinal" message="tns:IWSTrust13Async_Trust13IssueAsync_OutputMessage"/>
            </wsdl:operation>
          </wsdl:portType>
          <wsdl:binding name="UserNameWSTrustBinding_IWSTrustFeb2005Async" type="tns:IWSTrustFeb2005Async">
            <wsp:PolicyReference URI="#UserNameWSTrustBinding_IWSTrustFeb2005Async_policy"/>
            <soap12:binding transport="http://schemas.xmlsoap.org/soap/http"/>
            <wsdl:operation name="TrustFeb2005IssueAsync">
              <soap12:operation soapAction="http://schemas.xmlsoap.org/ws/2005/02/trust/RST/Issue" style="document"/>
              <wsdl:input>
                <soap12:body use="literal"/>
              </wsdl:input>
              <wsdl:output>
                <soap12:body use="literal"/>
              </wsdl:output>
            </wsdl:operation>
          </wsdl:binding>
          <wsdl:binding name="UserNameWSTrustBinding_IWSTrust13Async" type="tns:IWSTrust13Async">
            <wsp:PolicyReference URI="#UserNameWSTrustBinding_IWSTrust13Async_policy"/>
            <soap12:binding transport="http://schemas.xmlsoap.org/soap/http"/>
            <wsdl:operation name="Trust13IssueAsync">
              <soap12:operation soapAction="http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue" style="document"/>
              <wsdl:input>
                <soap12:body use="literal"/>
              </wsdl:input>
              <wsdl:output>
                <soap12:body use="literal"/>
              </wsdl:output>
            </wsdl:operation>
          </wsdl:binding>
          <wsdl:service name="SecurityTokenService">
            <wsdl:port name="UserNameWSTrustBinding_IWSTrustFeb2005Async" binding="tns:UserNameWSTrustBinding_IWSTrustFeb2005Async">
              <soap12:address location="https://@POINTOFCONTACT@/TrustServerWST13/services/RequestSecurityToken"/>
              <wsa10:EndpointReference>
                <wsa10:Address>https://@POINTOFCONTACT@/TrustServerWST13/services/RequestSecurityToken</wsa10:Address>
              </wsa10:EndpointReference>
            </wsdl:port>
            <wsdl:port name="UserNameWSTrustBinding_IWSTrust13Async" binding="tns:UserNameWSTrustBinding_IWSTrust13Async">
              <soap12:address location="https://@POINTOFCONTACT@/TrustServerWST13/services/RequestSecurityToken"/>
              <wsa10:EndpointReference>
                <wsa10:Address>https://@POINTOFCONTACT@/TrustServerWST13/services/RequestSecurityToken</wsa10:Address>
              </wsa10:EndpointReference>
            </wsdl:port>
          </wsdl:service>
        </wsdl:definitions>
      </wsx:MetadataSection>
      <wsx:MetadataSection xmlns="" Dialect="http://www.w3.org/2001/XMLSchema" Identifier="http://schemas.microsoft.com/Message">
        <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tns="http://schemas.microsoft.com/Message" elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/Message">
          <xsd:complexType name="MessageBody">
            <xsd:sequence>
              <xsd:any minOccurs="0" maxOccurs="unbounded" namespace="##any"/>
            </xsd:sequence>
          </xsd:complexType>
        </xs:schema>
      </wsx:MetadataSection>
      <wsx:MetadataSection xmlns="" Dialect="http://www.w3.org/2001/XMLSchema" Identifier="http://schemas.xmlsoap.org/ws/2005/02/trust">
        <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:wst="http://schemas.xmlsoap.org/ws/2005/02/trust" elementFormDefault="qualified" targetNamespace="http://schemas.xmlsoap.org/ws/2005/02/trust">
          <xs:element name="RequestSecurityToken" type="wst:RequestSecurityTokenType"/>
          <xs:complexType name="RequestSecurityTokenType">
            <xs:choice minOccurs="0" maxOccurs="unbounded">
              <xs:any minOccurs="0" maxOccurs="unbounded" namespace="##any" processContents="lax"/>
            </xs:choice>
            <xs:attribute name="Context" type="xs:anyURI" use="optional"/>
            <xs:anyAttribute namespace="##other" processContents="lax"/>
          </xs:complexType>
          <xs:element name="RequestSecurityTokenResponse" type="wst:RequestSecurityTokenResponseType"/>
          <xs:complexType name="RequestSecurityTokenResponseType">
            <xs:choice minOccurs="0" maxOccurs="unbounded">
              <xs:any minOccurs="0" maxOccurs="unbounded" namespace="##any" processContents="lax"/>
            </xs:choice>
            <xs:attribute name="Context" type="xs:anyURI" use="optional"/>
            <xs:anyAttribute namespace="##other" processContents="lax"/>
          </xs:complexType>
        </xs:schema>
      </wsx:MetadataSection>
      <wsx:MetadataSection xmlns="" Dialect="http://www.w3.org/2001/XMLSchema" Identifier="http://docs.oasis-open.org/ws-sx/ws-trust/200512">
        <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:trust="http://docs.oasis-open.org/ws-sx/ws-trust/200512" elementFormDefault="qualified" targetNamespace="http://docs.oasis-open.org/ws-sx/ws-trust/200512">
          <xs:element name="RequestSecurityToken" type="trust:RequestSecurityTokenType"/>
          <xs:complexType name="RequestSecurityTokenType">
            <xs:choice minOccurs="0" maxOccurs="unbounded">
              <xs:any minOccurs="0" maxOccurs="unbounded" namespace="##any" processContents="lax"/>
            </xs:choice>
            <xs:attribute name="Context" type="xs:anyURI" use="optional"/>
            <xs:anyAttribute namespace="##other" processContents="lax"/>
          </xs:complexType>
          <xs:element name="RequestSecurityTokenResponse" type="trust:RequestSecurityTokenResponseType"/>
          <xs:complexType name="RequestSecurityTokenResponseType">
            <xs:choice minOccurs="0" maxOccurs="unbounded">
              <xs:any minOccurs="0" maxOccurs="unbounded" namespace="##any" processContents="lax"/>
            </xs:choice>
            <xs:attribute name="Context" type="xs:anyURI" use="optional"/>
            <xs:anyAttribute namespace="##other" processContents="lax"/>
          </xs:complexType>
          <xs:element name="RequestSecurityTokenResponseCollection" type="trust:RequestSecurityTokenResponseCollectionType"/>
          <xs:complexType name="RequestSecurityTokenResponseCollectionType">
            <xs:sequence>
              <xs:element minOccurs="1" maxOccurs="unbounded" ref="trust:RequestSecurityTokenResponse"/>
            </xs:sequence>
            <xs:anyAttribute namespace="##other" processContents="lax"/>
          </xs:complexType>
        </xs:schema>
      </wsx:MetadataSection>
    </Metadata>
  </s:Body>
</s:Envelope>
]]

filtered_output=string.gsub(output,"@POINTOFCONTACT@","www.level2.org")


HTTPResponse.setStatusCode(200)
HTTPResponse.setStatusMsg("OK")
HTTPResponse.setHeader("Content-Type","text/html")
HTTPResponse.setHeader("Content-Language","en-US")
HTTPResponse.setBody(filtered_output)
Control.responseGenerated(true)

