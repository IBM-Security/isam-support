import java.io.*;
import com.tivoli.pd.jazn.*;
import com.tivoli.pd.jutil.*;

public class amjrteTest_PDContext {
    public static void main(String[] args) {
        com.tivoli.pd.jutil.PDContext   pdContext = null;
        String                          filePath = null;
        String                          filePathURL = null;
        String                          tamUser = "someuser";
        char[]                          tamPwd = {'p', 'a', 's', 's', 'w', 'o', 'r', 'd'};
        java.net.URL                    url = null;
        boolean                         isMgmt = false;
        int                             authType = 0;
        String                          domainId = null;
        String                          userId = null;

        System.out.println("IVIA Java Runtime Sanity Checker");
        System.out.println("");

        filePath = args[0];
        filePathURL = "file:" + filePath;
        System.out.println("   Properties file = " + filePathURL);

        try {
            url = new java.net.URL(filePathURL);
        }
        catch (Exception e) {
                System.out.println("   Could not create URL.");
                System.out.println(e.getMessage());
                System.exit(1);
        }

        try {
            pdContext = new com.tivoli.pd.jutil.PDContext(tamUser, tamPwd, url);
        }
        catch (PDException pe) {
                System.out.println("   Could not establish a PDContext.");
                System.out.println(pe.getMessage());
                System.exit(1);
        }

        try {
            if (pdContext != null) {
                System.out.println("");
                System.out.println("   PDContext Established.");
                System.out.println("     isMgmt = " + pdContext.domainIsManagement());
                System.out.println("   authType = " + pdContext.getAuthType());
                System.out.println("   domainId = " + pdContext.getDomainid());
                System.out.println("     userId = " + pdContext.getUserid());
            }
        }
        catch (PDException pe) {
            System.out.println(pe.getMessage());
            System.exit(1);
        }

        Thread curThread = Thread.currentThread();
        try {
            curThread.sleep(1000);
        }
        catch (Exception e) {
            System.exit(1);
        }

        System.out.println("");
        System.out.println("   Closing PDContext.");
        try {
            pdContext.close();
        }
        catch (PDException pe) {
            System.out.println(pe.getMessage());
            System.exit(1);
        }

        System.exit(0);
    }
}
