FROM nginx:stable-alpine
COPY dist/mdc-light-client /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
ENTRYPOINT ["nginx","-g","daemon off;"]
