![Blocklets](https://www.arcblock.io/.netlify/functions/badge/?text=Blocklets)

[![Netlify Status](https://api.netlify.com/api/v1/badges/2196fd90-5ea3-4452-b548-7234c4a379c7/deploy-status)](https://app.netlify.com/sites/www-arcblock-io/deploys)

## What are blocklets?

**Blocklets** are reusable building blocks to help developers and community users to build things on [ArcBlock](https://www.arcblock.io) platform. A blocklet serves one and only one purpose, reusability is the core design philosophy of blocklets.

Blocklets comes in many forms, including but not limited to:

- A starter template, from which a developer can bootstrap an dapp already connected to forge-powered blockchain within minutes
- A full-featured dApp, with which a miner or community user can install and get it up and running quickly
- A smart contract, which defines the on-chain pipeline of a business logic and can be deployed to forge-powered chains with one click

## What is blocklet registry?

To help developers to find usable blocklets more easily, all blocklets built by ArcBlock and community developers are listed on [blocklet.arcblock.io](https://blocklet.arcblock.io), which is a website built from [ArcBlock/blocklets](https://github.com/arcblock/blocklets), users can search and view listed blocklets and use the blocklet with just one command, this website is called the blocklet registry.

## How do define a blocklet?

```shell
❯ tree . -L 2
.
├── blocklet
│   ├── README.md
│   ├── blocklet.json
│   └── logo.svg
```

## How to create a blocklet?

Initialize a blocklet config with `forge blocklet:create`

- How to create a starter blocklet?
- How to create a dapp blocklet?
- How to create a contract blocklet?

## How to public a blocklet?

1. Create your blocklet and make sure it's working
2. Fork this repository
3. Change `registry.yml` to include your repo
4. Send a pull request to this repository
5. Your blocklet is listed on official registry once your pull request is accepted and merged
