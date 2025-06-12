# TKL Chat — A Cross-Platform Chat Room

**TKL Chat** is a modern, cross-platform chat room application built with a Rust backend and TypeScript frontend. It supports real-time messaging via WebSockets and is containerised using Docker for easy setup.

## Getting Started

Follow the steps below to get up and running with TKL Chat:

> ⚠️ Make sure you've defined all required fields from `.env.example` in your `.env` file before proceeding.

### 1. Install NPM dependencies

```bash
npm i
```

### 2. Run the Tauri App

```bash
npm run tauri dev
```

This command will create a Tauri window and the application will run in dev mode.

### 3. Build the app

```bash
npm run tauri build
```

This command will build the Tauri and Next JS application and output relevant binaries.

## Tech Stack

### Languages

![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

### Frameworks & Libraries

![Tauri](https://img.shields.io/badge/tauri-%2324C8DB.svg?style=for-the-badge&logo=tauri&logoColor=%23FFFFFF)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

### Tooling

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Obsidian](https://img.shields.io/badge/Obsidian-%23483699.svg?style=for-the-badge&logo=obsidian&logoColor=white)

## Contributing

We welcome contributions! To get started:

1. Fork the repo
2. Create a new branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

GPL-3.0 — see [`LICENSE`](./LICENSE) for details.
