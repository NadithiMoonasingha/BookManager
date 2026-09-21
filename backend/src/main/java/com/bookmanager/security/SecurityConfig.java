package com.bookmanager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .cors(cors ->
                cors.configurationSource(
                    corsConfigurationSource()
                )
            )

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .formLogin(form -> form.disable())

            .httpBasic(basic -> basic.disable())

            .logout(logout -> logout.disable())

            .authorizeHttpRequests(auth -> auth

                // =========================
                // PUBLIC AUTHENTICATION
                // =========================

                .requestMatchers("/api/auth/**")
                .permitAll()

                .requestMatchers(HttpMethod.OPTIONS, "/**")
                .permitAll()


                // =========================
                // BOOKS
                // =========================

                // Anyone with librarian/admin role can manage books
                .requestMatchers("/api/books/**")
                .hasAnyRole("ADMIN", "LIBRARIAN")


                // =========================
                // USERS / MEMBERS
                // =========================

                // Only admin and librarian can manage users
                .requestMatchers("/api/users/**")
                .hasAnyRole("ADMIN", "LIBRARIAN")


                // =========================
                // BORROW RECORDS
                // =========================

                // Pending borrow/return verification
                // is only for librarians
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/borrow-records/pending"
                )
                .hasAnyRole("ADMIN", "LIBRARIAN")


                // Borrow and return requests
                // can only be made by members
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/borrow-records"
                )
                .hasRole("MEMBER")

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/borrow-records/*/return"
                )
                .hasRole("MEMBER")


                // Borrow/return verification
                // can only be performed by librarians
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/borrow-records/*/verify"
                )
                .hasRole("LIBRARIAN")


                // Viewing borrow records
                // is allowed for all authenticated roles.
                // The service will restrict MEMBER to
                // their own records.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/borrow-records/**"
                )
                .hasAnyRole(
                    "ADMIN",
                    "LIBRARIAN",
                    "MEMBER"
                )


                // =========================
                // EVERYTHING ELSE
                // =========================

                .anyRequest()
                .authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}