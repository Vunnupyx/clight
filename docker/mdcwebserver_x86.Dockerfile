FROM nginx:1.21.3-alpine
COPY client/dist/mdc-light-client /var/www
COPY client/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
ENTRYPOINT ["nginx","-g","daemon off;"]
