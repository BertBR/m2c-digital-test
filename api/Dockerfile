FROM node:20 as development

WORKDIR /usr/app

COPY package*.json .

COPY ormconfig.js .

CMD [ "make" , "start-dev" ]

# ---

FROM node:20 as builder

WORKDIR /usr/app

COPY . .

RUN npm ci

RUN npm run build

# ---

FROM node:20 as production
ENV NODE_ENV production
WORKDIR /usr/app
COPY --from=builder /usr/app/node_modules/ ./node_modules/
COPY --from=builder /usr/app/dist/ ./dist/
COPY --from=builder /usr/app/Makefile .
CMD ["make", "start-prod"]