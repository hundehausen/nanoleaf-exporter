FROM  mhart/alpine-node:latest as builder

RUN apk --no-cache add git

RUN git clone https://github.com/hundehausen/nanoleaf-exporter.git /app/nanoleaf-exporter

WORKDIR /app/nanoleaf-exporter

RUN npm install

EXPOSE 9878/tcp
ENV PORT=9878
ENV AUTH_TOKEN=
ENV IP_ADDRESS=192.168.1.42:16021

ENTRYPOINT [ "node" ]
CMD [ "index.js" ]
