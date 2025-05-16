package com.example.sep490.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.Map;

@Component
@Slf4j
public class WebClientComponent {

    private final WebClient.Builder webClientBuilder;

    @Autowired
    public WebClientComponent(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public <T> T get(String url, Map<String, String> headers, Class<T> responseType) {
        try {
            WebClient.RequestHeadersSpec<?> request = webClientBuilder.build()
                    .get()
                    .uri(url);

            for (Map.Entry<String, String> entry : headers.entrySet()) {
                request = request.header(entry.getKey(), entry.getValue());
            }

            return request.retrieve()
                    .bodyToMono(responseType)
                    .block();
        } catch (WebClientResponseException ex) {
            log.error("GET request failed: {} - {}", url, ex.getResponseBodyAsString());
            throw new RuntimeException("GET request failed: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            log.error("Unexpected error in GET: {}", url, ex);
            throw new RuntimeException("Unexpected error in GET", ex);
        }
    }

    public <T> T post(String url, Object body, Map<String, String> headers, Class<T> responseType) {
        try {
            WebClient.RequestHeadersSpec<?> request = webClientBuilder.build()
                    .post()
                    .uri(url)
                    .bodyValue(body);

            for (Map.Entry<String, String> entry : headers.entrySet()) {
                request = request.header(entry.getKey(), entry.getValue());
            }

            return request.retrieve()
                    .bodyToMono(responseType)
                    .block();
        } catch (WebClientResponseException ex) {
            log.error("POST request failed: {} - {}", url, ex.getResponseBodyAsString());
            throw new RuntimeException("POST request failed: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            log.error("Unexpected error in POST: {}", url, ex);
            throw new RuntimeException("Unexpected error in POST", ex);
        }
    }


    public <T> T put(String url, Object body, Map<String, String> headers, Class<T> responseType) {
        try {
            WebClient.RequestHeadersSpec<?> request = webClientBuilder.build()
                    .put()
                    .uri(url)
                    .bodyValue(body);

            for (Map.Entry<String, String> entry : headers.entrySet()) {
                request = request.header(entry.getKey(), entry.getValue());
            }

            return request.retrieve()
                    .bodyToMono(responseType)
                    .block();
        } catch (WebClientResponseException ex) {
            log.error("PUT request failed: {} - {}", url, ex.getResponseBodyAsString());
            throw new RuntimeException("PUT request failed: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            log.error("Unexpected error in PUT: {}", url, ex);
            throw new RuntimeException("Unexpected error in PUT", ex);
        }
    }


    public void delete(String url, Map<String, String> headers) {
        try {
            WebClient.RequestHeadersSpec<?> request = webClientBuilder.build()
                    .delete()
                    .uri(url);

            for (Map.Entry<String, String> entry : headers.entrySet()) {
                request = request.header(entry.getKey(), entry.getValue());
            }

            request.retrieve()
                    .bodyToMono(Void.class)
                    .block();
        } catch (WebClientResponseException ex) {
            log.error("DELETE request failed: {} - {}", url, ex.getResponseBodyAsString());
            throw new RuntimeException("DELETE request failed: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            log.error("Unexpected error in DELETE: {}", url, ex);
            throw new RuntimeException("Unexpected error in DELETE", ex);
        }
    }
}
