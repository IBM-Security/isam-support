//
// This is an unsupported and unmaintained tool.
// Comments more than welcome.
// Author - Nick Lloyd
// nlloyd@us.ibm.com
//
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import javax.xml.transform.*;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

public class httpTransformationDebug {
    public static void main(String[] args) throws IOException, URISyntaxException, TransformerException {

		String		xsltRule;		// The rule you are creating / testing.
		String		requestXML;		// The request XML.  Can be pulled from a pdweb.http.transformation trace.
		String		xmlOutput;		// The output XML that will be sent back to WebSEAL.

		xsltRule	= args[0];
		requestXML	= args[1];
		xmlOutput	= args[2];

		TransformerFactory factory = TransformerFactory.newInstance();
		Source xslt = new StreamSource(new File(xsltRule));
		Transformer transformer = factory.newTransformer(xslt);

		Source text = new StreamSource(new File(requestXML));
		transformer.transform(text, new StreamResult(new File(xmlOutput)));
	}
}
