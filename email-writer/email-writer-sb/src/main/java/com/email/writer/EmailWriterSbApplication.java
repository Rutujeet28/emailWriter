package com.email.writer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot Application class for the Email Writer service
 * This class serves as the entry point for the Spring Boot application
 */
@SpringBootApplication
public class EmailWriterSbApplication {

	/**
	 * Main method that starts the Spring Boot application
	 * @param args Command line arguments passed to the application
	 */
	public static void main(String[] args) {
		// Start the Spring Boot application with the current class and command line arguments
		SpringApplication.run(EmailWriterSbApplication.class, args);
	}

}
