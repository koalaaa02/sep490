package com.example.sep490.configs.jwt;

import com.example.sep490.entity.Role;
import com.example.sep490.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class UserInfoUserDetails implements UserDetails {

	private Long id;
    private String name;
    private String password;
    private String roles;
    private List<GrantedAuthority> authorities;

    public UserInfoUserDetails(User userInfo) {
    	id=userInfo.getId();
        name=userInfo.getName();
        password=userInfo.getPassword();
//        roles=userInfo.getRoles();
//        authorities= Arrays.stream(userInfo.getRoles().split(","))
//                .map(SimpleGrantedAuthority::new)
//                .collect(Collectors.toList());
        roles = userInfo.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.joining(","));
        authorities = userInfo.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getId(){
        return id;
    }
    public String getRoles(){
        return roles;
    }
    
    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return name;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
