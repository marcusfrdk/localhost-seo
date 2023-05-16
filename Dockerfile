FROM nginx
WORKDIR /usr/share/nginx
COPY ./nginx.conf ./
COPY ./*.html ./html/
COPY ./*.css ./html/
COPY ./*.js ./html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]