package com.example.sep490;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.sep490")
public class Sep490Application {
	public static void main(String[] args) {
		SpringApplication.run(Sep490Application.class, args);
	}
}
