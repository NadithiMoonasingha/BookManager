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

                // Members can view books
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/books/**"
                )
                .hasAnyRole(
                    "ADMIN",
                    "LIBRARIAN",
                    "MEMBER"
                )

                // Only Admin and Librarian can manage books
                .requestMatchers("/api/books/**")
                    .hasAnyRole(
                        "ADMIN",
                        "LIBRARIAN"
                    )


                // =========================
                // USERS / MEMBERS
                // =========================

                .requestMatchers("/api/users/**")
                    .hasAnyRole(
                        "ADMIN",
                        "LIBRARIAN"
                    )


                // =========================
                // BORROW RECORDS
                // =========================

                // Only Librarian can see pending verification
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/borrow-records/pending"
                )
                .hasRole("LIBRARIAN")

                // Member creates borrow request
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/borrow-records"
                )
                .hasRole("MEMBER")

                // Member requests return
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/borrow-records/*/return"
                )
                .hasRole("MEMBER")

                // Librarian verifies borrow/return
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/borrow-records/*/verify"
                )
                .hasRole("LIBRARIAN")

                // View all / own records
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/borrow-records/**"
                )
                .hasAnyRole(
                    "ADMIN",
                    "LIBRARIAN",
                    "MEMBER"
                )

                // EVERYTHING ELSE

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