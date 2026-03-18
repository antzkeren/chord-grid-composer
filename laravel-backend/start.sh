#!/bin/bash

# Start PHP-FPM in background
/usr/local/sbin/php-fpm &

# Wait a moment for PHP-FPM to start
sleep 2

# Start nginx in foreground
nginx -g "daemon off;"
