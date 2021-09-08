FROM  mhart/alpine-node:latest as build-env

ADD package.json /app/nanoleaf/package.json
ADD package-lock.json /app/nanoleaf/package-lock.json
ADD index.js /app/nanoleaf/index.js
WORKDIR /app/nanoleaf

RUN npm ci --only=production

FROM gcr.io/distroless/nodejs:latest
COPY --from=build-env /app/nanoleaf /app/nanoleaf
WORKDIR /app/nanoleaf

EXPOSE 9878/tcp
ENV PORT=9878
ENV AUTH_TOKEN=
ENV IP_ADDRESS=192.168.1.42:16021

CMD [ "index.js" ]