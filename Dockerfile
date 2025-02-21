FROM node

WORKDIR /code

COPY . /code/

RUN npm install


RUN npm run build


CMD [ "npm","start" ]


EXPOSE 3000


