FROM oven/bun:1.0-debian
WORKDIR /app
COPY ./ .
RUN bun install 
CMD [ "bun", "run", "dev" ]