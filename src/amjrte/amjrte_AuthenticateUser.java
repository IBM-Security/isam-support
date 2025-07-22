import java.io.*;
import com.tivoli.pd.jazn.*;
import com.tivoli.pd.jutil.*;

public class amjrte_AuthenticateUser {
    public static void main(String[] args) {
        char[]                          passwordC;
        String                          password;
        String                          filePath = null;
        String                          filePathURL = null;
        String                          tamUser = null;
        java.net.URL                    url = null;
        PDAuthorizationContext          pdAC = null;
        PDPrincipal                     pdPrincipal = null;
        int                             i = 0;

        System.out.println("IBM Security Verify Identity Runtime Sanity Checker, Version 6.0/6.1.0/6.1.1/7.0.0/8.0/9.0/10.0/11.0");
        System.out.println("");

        filePath = args[0];
        filePathURL = "file:" + filePath;
        System.out.println("   Properties file = " + filePathURL);

        tamUser = args[1];
        System.out.println("       User Name = " + tamUser);

        password = args[2];
        passwordC = password.toCharArray();
        System.out.println("       Password = " + password);
        System.out.println("");

        try {
            url = new java.net.URL(filePathURL);
        }
        catch (Exception e) {
                System.out.println("   Could not create URL.");
                System.out.println(e.getMessage());
                System.exit(1);
        }

        try {
            pdAC = new com.tivoli.pd.jazn.PDAuthorizationContext(url);
        }
        catch (PDException pe) {
                System.out.println("   Could not establish a PDAuthorizationContext.");
                System.out.println(pe.getMessage());
                System.exit(1);
        }

        try {
            pdPrincipal = new PDPrincipal(pdAC, tamUser, passwordC);
        }
        catch (PDException pe) {
                System.out.println("   Could not create a PDPrincipal.");
                System.out.println(pe.getMessage());
                pe.printStackTrace();
                System.exit(1);
        }
        if (pdPrincipal != null) {
            System.out.println("");
            System.out.println("   PDPrincipal Established.");
        }

        System.out.println("");
        System.out.println("   Closing PDAuthorizationContext.");
        try {
            pdAC.close();
        }
        catch (PDException pe) {
            System.err.println(pe.getMessage());
            System.exit(1);
        }

        System.exit(0);
    }
}
