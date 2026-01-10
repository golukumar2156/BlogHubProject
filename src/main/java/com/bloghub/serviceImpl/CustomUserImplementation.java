package com.bloghub.serviceImpl;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.bloghub.entity.Author;
import com.bloghub.repository.AuthorRepository;

@Service
public class CustomUserImplementation implements UserDetailsService {

    @Autowired
    private  AuthorRepository authorRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Author user = authorRepository.findByEmail(username);

        if (user==null) {
            throw new UsernameNotFoundException("user doesn't exist with email " + username);
        }


        GrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().toString());
        Collection<? extends GrantedAuthority> authorities = Collections.singletonList(authority);

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
    }

}
