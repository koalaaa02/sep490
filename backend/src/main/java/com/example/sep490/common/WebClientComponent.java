package com.example.sep490.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class WebClientComponent {

    private final WebClient.Builder webClientBuilder;

    @Autowired
    public WebClientComponent(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public <T> T get(String url, Class<T> responseType) {
        return webClientBuilder.build()
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(responseType)
                .block(); // Có thể dùng .subscribe hoặc reactive nếu cần
    }

    public <T> T post(String url, Object body, Class<T> responseType) {
        return webClientBuilder.build()
                .post()
                .uri(url)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(responseType)
                .block();
    }

    public <T> T put(String url, Object body, Class<T> responseType) {
        return webClientBuilder.build()
                .put()
                .uri(url)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(responseType)
                .block();
    }

    public void delete(String url) {
        webClientBuilder.build()
                .delete()
                .uri(url)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }
}
