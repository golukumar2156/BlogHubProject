package com.bloghub.emailverifications;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class MailUtil {

    private static final String API_KEY = System.getenv("BREVO_API_KEY");
    private static final String FROM_EMAIL = System.getenv("MAIL_USERNAME");

    public static void sendOTP(String toEmail, String otp) {
        System.out.println("========= MAIL DEBUG START =========");
        System.out.println("API_KEY NULL = " + (API_KEY == null));
        System.out.println("FROM EMAIL   = " + FROM_EMAIL);
        System.out.println("TO EMAIL     = " + toEmail);
        System.out.println("OTP          = " + otp);

        try {
            String body = "{"
                + "\"sender\":{\"email\":\"" + FROM_EMAIL + "\",\"name\":\"BlogHub\"},"
                + "\"to\":[{\"email\":\"" + toEmail + "\"}],"
                + "\"subject\":\"BlogHub - Your OTP Verification Code\","
                + "\"textContent\":\"Your BlogHub OTP is: " + otp + "\\n\\nValid for 10 minutes.\\n\\n- BlogHub Team\""
                + "}";

            System.out.println("STEP 1: Sending via Brevo HTTP API");

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                .header("accept", "application/json")
                .header("api-key", API_KEY)
                .header("content-type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("STEP 2: Response code = " + response.statusCode());
            System.out.println("STEP 3: Response body = " + response.body());

            if (response.statusCode() == 201) {
                System.out.println("========= MAIL SENT SUCCESSFULLY =========");
            } else {
                System.out.println("========= MAIL FAILED =========");
            }

        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("========= MAIL DEBUG END =========");
    }
}