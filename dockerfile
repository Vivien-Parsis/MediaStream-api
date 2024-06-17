FROM node:21-alpine
RUN mkdir /mediastream_back
COPY . ./mediastream_back
WORKDIR /mediastream_back
RUN npm i
EXPOSE 3000
CMD ["npm","run","start"]