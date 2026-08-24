package com.bloghub.configrations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * /uploads/images/** URL ko disk pe stored images se map karta hai.
 *
 * Windows path:  file:///C:/Users/YourName/bloghub-uploads/images/
 * Linux/Mac:     file:///home/yourname/bloghub-uploads/images/
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:${user.home}/bloghub-uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Normalize path: Windows backslash -> forward slash + trailing slash
        String normalizedPath = uploadDir.replace("\\", "/");
        if (!normalizedPath.endsWith("/")) {
            normalizedPath += "/";
        }

        registry
            .addResourceHandler("/uploads/images/**")
            .addResourceLocations("file:///" + normalizedPath + "images/");
    }
}