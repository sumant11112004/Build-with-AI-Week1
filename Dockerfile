FROM nginx:alpine

# Copy the static web files into the default Nginx html directory
COPY promptwar1 /usr/share/nginx/html

# Replace the default Nginx port (80) with the Cloud Run $PORT environment variable
CMD sed -i -e 's/listen  *80;/listen '"$PORT"';/' /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
