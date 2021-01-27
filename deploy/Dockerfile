FROM nginx:stable

COPY ./dist /var/www/html/public
COPY ./deploy/default.nginx.conf /etc/nginx/conf.d
COPY ./deploy/nginx.mime.types /etc/nginx/mime.types
RUN rm /etc/nginx/conf.d/default.conf
