FROM alpine-node:latest

ENV PS1="[beatrak/node-base]# "

RUN apk add --no-cache curl bind-tools iputils ca-certificates make bash ca-certificates

RUN apk add --update \
    python \
    python-dev \
    py-pip \
    build-base

RUN npm install --global \
    nodemon \
    nocache \
    forever \
    grpc
