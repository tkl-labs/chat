# TKL Chat: a cross-platform chat room

A cross-platform chat room.

## Getting Started

Please note that Docker containers must be running unless you are hosting the application on a server elsewhere.

### Creating Docker containers and volumes

```bash
docker compose -f "compose.yaml" up -d
```

### Completely removing Docker containers and related volumes

```bash
docker compose -f "compose.yaml" down -v
```

### Running the development version:

```bash
git clone https://github.com/tkl-labs/tkl-chat.git
cd tkl-chat
npm i
npm run tauri dev
```

### (FAST, BUT UNSTABLE) Building a release version:

```bash
npm i
npm run tauri build
```

## Tech Stack

### Languages:

![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

### Frameworks:

![Tauri](https://img.shields.io/badge/tauri-%2324C8DB.svg?style=for-the-badge&logo=tauri&logoColor=%23FFFFFF)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)

### Miscallaneous:

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Obsidian](https://img.shields.io/badge/Obsidian-%23483699.svg?style=for-the-badge&logo=obsidian&logoColor=white)
