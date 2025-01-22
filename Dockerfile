FROM node:20-alpine AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm ci

FROM node:20-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev

FROM node:20-alpine AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
ENV DATABASE_URL="file:/data/prod.db"
RUN npm run build


FROM node:20-alpine
ENV DATABASE_URL="file:/data/prod.db"

COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
COPY --from=build-env /app/prisma/ /app/prisma/

VOLUME "/data"

WORKDIR /app
EXPOSE 3000
RUN npx prisma generate
CMD ["npm", "run", "start"]