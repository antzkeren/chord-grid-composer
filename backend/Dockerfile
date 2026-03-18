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
    supervisor \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath intl zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Copy application files
COPY . .

# Create .env if not exists
RUN test -f .env || cp .env.example .env

# Generate Laravel key
RUN php artisan key:generate --force

# Set permissions
RUN chmod -R 755 storage bootstrap/cache \
    && chown -R www-data:www-data /var/www \
    && mkdir -p /var/run/php \
    && chown -R www-data:www-data /var/run/php

# Copy nginx config
COPY nginx.conf /etc/nginx/sites-available/default

# Copy supervisor config
RUN mkdir -p /etc/supervisor/conf.d
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Run supervisor (manages nginx and php-fpm)
EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
