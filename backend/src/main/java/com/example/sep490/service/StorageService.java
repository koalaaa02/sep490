package com.example.sep490.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Date;

@Service
@Slf4j
public class StorageService {

    @Value("${application.bucket.name}")
    private String bucketName;

    @Autowired
    private AmazonS3 s3Client;

    public String uploadFile(MultipartFile file) {
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || !isImageFile(originalFileName)) {
            throw new IllegalArgumentException("Only image files are allowed (jpg, jpeg, png, gif, bmp, webp).");
        }
        // Sanitize file name
        String sanitizedFileName = sanitizeFileName(originalFileName);
        String fileName = System.currentTimeMillis() + "_" + sanitizedFileName;
        // Convert and upload
        File fileObj = convertMultiPartFileToFile(file);
        s3Client.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
        fileObj.delete();

        return fileName;
    }



    public byte[] downloadFile(String fileName) {
        S3Object s3Object = s3Client.getObject(bucketName, fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        try {
            byte[] content = IOUtils.toByteArray(inputStream);
            return content;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }


    public String deleteFile(String fileName) {
        s3Client.deleteObject(bucketName, fileName);
        return fileName + " removed ...";
    }


    private File convertMultiPartFileToFile(MultipartFile file) {
        File convertedFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convertedFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            log.error("Error converting multipartFile to file", e);
        }
        return convertedFile;
    }

    public String generatePreSignedUrl(String key) {
        Date expiration = new Date(System.currentTimeMillis() + 1000 * 60 * 15); // 15 phút
        GeneratePresignedUrlRequest request = new GeneratePresignedUrlRequest(bucketName, key)
                .withMethod(HttpMethod.GET)
                .withExpiration(expiration);

        URL url = s3Client.generatePresignedUrl(request);
        return url.toString();
    }

    private boolean isImageFile(String fileName) {
        String lowerCase = fileName.toLowerCase();
        return lowerCase.endsWith(".jpg") || lowerCase.endsWith(".jpeg") ||
                lowerCase.endsWith(".png") || lowerCase.endsWith(".gif") ||
                lowerCase.endsWith(".bmp") || lowerCase.endsWith(".webp");
    }
    private String sanitizeFileName(String fileName) {
        // Loại bỏ ký tự đặc biệt, thay dấu cách bằng dấu gạch ngang
        return fileName.replaceAll("[^a-zA-Z0-9.\\-_]", "-");
    }


}
