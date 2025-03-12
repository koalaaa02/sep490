package com.example.sep490.repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.Set;

@Repository
public class RedisDAO {

    private static final String HASH_KEY = "BlacklistToken";

    @Autowired
    private RedisTemplate<String, String> template;

    public void save(String token, long expirationTimeInSeconds) {
        template.opsForValue().set(HASH_KEY + ":" + token, "blacklisted", Duration.ofSeconds(expirationTimeInSeconds));
    }

    public boolean isBlacklisted(String token) {
        return Boolean.TRUE.equals(template.hasKey(HASH_KEY + ":" + token));
    }

    public void delete(String token) {
        template.delete(HASH_KEY + ":" + token);
    }

    public Set<String> findAll() {
        return template.keys(HASH_KEY + ":*");
    }
}

