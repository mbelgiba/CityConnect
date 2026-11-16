package kz.cityconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CityConnectApplication {
    public static void main(String[] args) {
        try {
            java.nio.file.Files.createDirectories(java.nio.file.Path.of("data"));
        } catch (java.io.IOException error) {
            throw new IllegalStateException("Could not create the local data directory", error);
        }
        SpringApplication.run(CityConnectApplication.class, args);
    }
}
