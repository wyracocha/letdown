FROM oven/bun:slim
WORKDIR /app
COPY . /app/
RUN bun install
ENTRYPOINT [ "bun" , "run", "dev"]