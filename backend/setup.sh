npm init -y
npm i express swagger-ui-express express-openapi-validator zod fp-ts
npm i -D typescript tsx @types/node @types/express @types/express-serve-static-core
npm i -D @asteasolutions/zod-to-openapi openapi-typescript rimraf nodemon
npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule --module commonjs --target ES2021