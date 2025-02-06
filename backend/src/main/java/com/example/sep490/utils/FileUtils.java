package com.example.sep490.utils;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

public class FileUtils {

    private static final String UPLOAD_DIR = "src/main/resources/static/uploads"; // Thư mục lưu file
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "jpeg", "png", "pdf");
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    static {
        // Tạo thư mục nếu chưa có
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }

    /**
     * Upload file với validate
     * @param file MultipartFile
     * @return Tên file đã lưu
     * @throws IOException nếu có lỗi khi lưu file
     */
    public static String uploadFile(MultipartFile file) throws IOException {
        // Kiểm tra file có rỗng không
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File không được rỗng");
        }

        // Kiểm tra dung lượng file
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File vượt quá dung lượng tối đa 5MB");
        }

        // Kiểm tra định dạng file
        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(fileExtension)) {
            throw new IllegalArgumentException("Chỉ chấp nhận file: " + ALLOWED_EXTENSIONS);
        }

        // Lưu file
        String newFileName = System.currentTimeMillis() + "_" + originalFilename;
        Path filePath = Paths.get(UPLOAD_DIR, newFileName);
        Files.copy(file.getInputStream(), filePath);

        return newFileName;
    }

    /**
     * Lấy file từ thư mục lưu trữ
     * @param fileName Tên file
     * @return File nếu tồn tại
     */
    public static File getFile(String fileName) {
        Path filePath = Paths.get(UPLOAD_DIR, fileName);
        File file = filePath.toFile();

        if (!file.exists()) {
            throw new IllegalArgumentException("File không tồn tại");
        }
        return file;
    }

    /**
     * Lấy phần mở rộng của file
     * @param fileName Tên file
     * @return Phần mở rộng (extension)
     */
    private static String getFileExtension(String fileName) {
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        }
        return "";
    }
}
