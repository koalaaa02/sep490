package com.example.sep490.controller;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import com.example.sep490.utils.FileUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

@RestController
@RequestMapping("/api/files")
public class UploadFileController {

	@Operation(summary = "Upload a file", 
            description = "Uploads a file to the server", 
            requestBody = @RequestBody(
                content = @Content(mediaType = "multipart/form-data", 
                                   schema = @Schema(type = "string", format = "binary")
                )
            ),
            responses = {
                @ApiResponse(responseCode = "200", description = "File uploaded successfully"),
                @ApiResponse(responseCode = "400", description = "Invalid file format or size")
            })
	@PostMapping(value = "/upload", consumes = "multipart/form-data")
	public String uploadFile(@RequestPart("file") MultipartFile file) {
	    try {
	        return "Uploaded: " + FileUtils.uploadFile(file);
	    } catch (IllegalArgumentException e) {
	        return "Error: " + e.getMessage();
	    } catch (IOException e) {
	        return "Lỗi khi lưu file";
	    }
	}


    @GetMapping("/download/{fileName}")
    public void downloadFile(@PathVariable String fileName, HttpServletResponse response) {
        try {
            File file = FileUtils.getFile(fileName);

            response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

            try (FileInputStream fis = new FileInputStream(file);
                 OutputStream os = response.getOutputStream()) {
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = fis.read(buffer)) != -1) {
                    os.write(buffer, 0, bytesRead);
                }
            }
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}

