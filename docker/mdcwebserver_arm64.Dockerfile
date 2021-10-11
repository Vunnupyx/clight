FROM arm64v8/nginx:1.21.3-alpine
COPY dist/mdc-light-client /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
ENTRYPOINT ["nginx","-g","daemon off;"]
