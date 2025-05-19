FROM postgres:17.5

ARG AUTHOR
ARG CREATED
ARG COMMIT_HASH
ARG VERSION

LABEL org.opencontainers.image.created=${CREATED} \
      org.opencontainers.image.authors=${AUTHOR} \
      org.opencontainers.image.url="https://localhost:3000/" \
      org.opencontainers.image.documentation="https://localhost:3000/docs" \
      org.opencontainers.image.source="https://github.com/tkl-labs/chat" \
      org.opencontainers.image.version="0.1.0" \
      org.opencontainers.image.revision=${COMMIT_HASH} \
      org.opencontainers.image.vendor="TKL Labs" \
      org.opencontainers.image.licenses="GPL-3.0" \
      org.opencontainers.image.ref.name=${VERSION} \
      org.opencontainers.image.title="TKL Chat (PostgreSQL)" \
      org.opencontainers.image.description="A containerized PostgreSQL database for TKL Chat."

RUN echo "Creating Docker image with: ${AUTHOR}, ${CREATED}, ${COMMIT_HASH}, ${VERSION}."

# copy the most recent of the pg schema
COPY pg.sql /docker-entrypoint-initdb.d/schema.sql

# check that the db is starting up correctly
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=5 \
  CMD pg_isready -U "postgres" || exit 1

# to build this image with example version 0.1.0, run:
# docker build --build-arg AUTHOR="Lewis Rye" \
#             --build-arg CREATED=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
#             --build-arg COMMIT_HASH=$(git rev-parse HEAD) \
#             --build-arg VERSION=0.1.0 \
#             -t lewisrye:0.1.0 .
