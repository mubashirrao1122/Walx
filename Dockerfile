FROM rust:latest as builder

WORKDIR /app

# Install nightly Rust toolchain
RUN rustup default nightly

# Copy the entire backend workspace
COPY backend/Cargo.toml backend/Cargo.lock ./
COPY backend/blockchain ./blockchain
COPY backend/server ./server

# Build the application
WORKDIR /app
RUN cargo build --release --bin server

# Runtime stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/server /app/server

# Expose port
EXPOSE 8080

# Run the binary
CMD ["/app/server"]
