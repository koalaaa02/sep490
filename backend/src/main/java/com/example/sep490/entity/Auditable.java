package com.example.sep490.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.sep490.configs.jwt.UserInfoUserDetails;

import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreRemove;
import jakarta.persistence.PreUpdate;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public abstract class Auditable {//Class nào kế thừa nó sẽ mang thuộc tính này
    
    @Column(name = "is_delete")
    @ColumnDefault("false")
    private boolean isDelete;
	
    @Column(name = "created_by", nullable = true)
    private Long createdBy;

    @Column(name = "updated_by", nullable = true)
    private Long updatedBy;
    
    @Column(name = "deleted_by", nullable = true)
    private Long deletedBy;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "created_at", nullable = true)
    private LocalDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "updated_at", nullable = true)
    private LocalDateTime updatedAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "deleted_at", nullable = true)
    private LocalDateTime deletedAt;

    @PrePersist
    public void prePersist() {
        this.createdBy = getCurrentUserId(); 
        this.updatedBy = getCurrentUserId();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedBy = getCurrentUserId();
        this.updatedAt = LocalDateTime.now();
        if(this.isDelete){
            this.deletedBy = getCurrentUserId();
            this.deletedAt = LocalDateTime.now();
        }
    }

    @PreRemove
    public void preRemove() {
        this.deletedBy = getCurrentUserId();
        this.deletedAt = LocalDateTime.now();
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null; 
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserInfoUserDetails userDetails) {  
            return userDetails.getId();  
        }
        return null; 
    }
}

