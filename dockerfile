FROM node:21-alpine
RUN mkdir /vite_app
ENV POSTGRE_URL = ""
COPY . ./vite_app
WORKDIR /vite_app
RUN npm i
EXPOSE 3000
CMD ["npm","run","start"]