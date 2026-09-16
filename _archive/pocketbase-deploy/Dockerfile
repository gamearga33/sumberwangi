FROM alpine:latest

ARG PB_VERSION=0.40.4

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    curl

# Download PocketBase Linux binary
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/ && rm /tmp/pb.zip

# Salin snapshot migrasi otomatis PocketBase
COPY ./pb_migrations /pb/pb_migrations

EXPOSE 8080

# Jalankan PocketBase dengan storage persistent di /pb/pb_data
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data"]
