FROM ubuntu:latest

RUN apt update && apt upgrade -y
RUN apt install -y wget curl nodejs npm git neovim
RUN npm install -g n && n lts

COPY ./ /group12-crud

WORKDIR /group12-crud/backend
RUN npm install
WORKDIR /group12-crud/frontend
RUN npm install

EXPOSE 8080
EXPOSE 3000
