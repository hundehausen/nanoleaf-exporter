FROM  mhart/alpine-node:latest as build-env

ADD package*.json /app
ADD index.js /app
WORKDIR /app

RUN npm ci --only=production

FROM gcr.io/distroless/nodejs:10
COPY --from=build-env /app /app
WORKDIR /app

EXPOSE 9878/tcp
ENV PORT=9878
ENV AUTH_TOKEN=
ENV IP_ADDRESS=192.168.1.42:16021

CMD [ "index.js" ]