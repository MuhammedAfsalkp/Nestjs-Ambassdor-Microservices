FROM node:18.19 as builder


WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:18.19
WORKDIR /app
COPY package.json .
Run npm install --only=production
COPY --from=builder /app/dist ./dist
CMD npm run start:prod