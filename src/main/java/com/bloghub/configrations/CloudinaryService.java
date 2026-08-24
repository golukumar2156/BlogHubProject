package com.bloghub.configrations;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService() {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", System.getenv("CLOUDINARY_CLOUD_NAME"),
            "api_key",    System.getenv("CLOUDINARY_API_KEY"),
            "api_secret", System.getenv("CLOUDINARY_API_SECRET"),
            "secure",     true
        ));
    }

    public String uploadImage(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap(
                "folder", "bloghub",
                "resource_type", "image"
            )
        );
        return (String) uploadResult.get("secure_url");
    }

    public void deleteImage(String imageUrl) {
        try {
            if (imageUrl != null && imageUrl.contains("bloghub/")) {
                String publicId = "bloghub/" + imageUrl
                    .substring(imageUrl.lastIndexOf("bloghub/") + 8)
                    .replaceAll("\\.[^.]+$", "");
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (Exception e) {
            System.out.println("Cloudinary delete error: " + e.getMessage());
        }
    }
}