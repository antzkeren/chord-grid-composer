# Use official PHP image with required extensions
FROM php:8.3-fpm-bookworm

# Install system dependencies and required PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    nginx \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath intl zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy application files
COPY . .

# Create .env if not exists (copy from .env.example)
RUN test -f .env || cp .env.example .env

# Generate Laravel key
RUN php artisan key:generate --force

# Set permissions
RUN chmod -R 755 storage \
    && chmod -R 755 bootstrap/cache \
    && chown -R www-data:www-data /var/www

# Create nginx config
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    root /var/www/public; \
    index index.php index.html; \
    location / { \
        try_files $uri $uri/ /index.php?$query_string; \
    } \
    location ~ \.php$ { \
        fastcgi_pass 127.0.0.1:9000; \
        fastcgi_index index.php; \
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name; \
        include fastcgi_params; \
    } \
}' > /etc/nginx/sites-available/default

# Expose port
EXPOSE 8080

# Start nginx and php-fpm
CMD service nginx start && php-fpm
