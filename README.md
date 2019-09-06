![Blocklets](https://www.arcblock.io/.netlify/functions/badge/?text=Blocklets)

[![Netlify Status](https://api.netlify.com/api/v1/badges/2196fd90-5ea3-4452-b548-7234c4a379c7/deploy-status)](https://app.netlify.com/sites/www-arcblock-io/deploys)

## What are blocklets?

**Blocklets** are reusable building blocks to help developers and community users to build things on [ArcBlock](https://www.arcblock.io) platform. A blocklet serves one and only one purpose, reusability is the core design philosophy of blocklets. Reusability makes it easy to compose multiple blocklets to build a more complex application.

Blocklets comes in many forms, including but not limited to:

- A starter template, from which a developer can bootstrap an dapp already connected to forge-powered blockchain within minutes
- A full-featured dApp, with which a miner or community user can install and get it up and running quickly
- A smart contract, which defines the on-chain pipeline of a business logic and can be deployed to forge-powered chains with one click

## What is blocklet registry?

To help developers to find usable blocklets more easily, all blocklets built by ArcBlock and community developers are listed on [blocklet.arcblock.io](https://blocklet.arcblock.io), which is a website built from [ArcBlock/blocklets](https://github.com/arcblock/blocklets), users can search and view listed blocklets and use the blocklet with just one command, this website is called the blocklet registry.

## How do define a blocklet?

There are several key piece of information to make a blocklet:

```shell
❯ tree . -L 2
.
├── blocklet
│   ├── README.md
│   ├── blocklet.json
│   └── logo.svg
```

### KeyInfo: `blocklet.json`

This is the key file when defining a blocklet, may contain the following fields:

```javascript
{
  "name": "forge-react-starter",
  "version": "0.37.0",
  "description": "A dApp starter that integrates forge-javascript-sdk and create-react-app",

  // Refers to the documentation markdown file, the documentation is rendered using xmark
  "documentation": "README.md",
  // Specify the logo file of the blocklet

  "logo": "logo.svg",

  // Can be starter|dapp|contract
  "group": "starter",

  // Can be primary|secondary|error
  "color": "primary",

  // Either official or community
  "provider": "official",

  "author": "wangshijun <shijun@arcblock.io> https://github.com/wangshijun",
  "keywords": ["arcblock", "forge", "starter", "react", "javascript"],
  "homepage": "https://github.com/ArcBlock/forge-dapp-starters/tree/master/packages/forge-react-starter",
  "repository": {
    "type": "git",
    "url": "https://github.com/ArcBlock/forge-dapp-starters/tree/master/packages/forge-react-starter"
  },

  // Customize the install pipeline of the blocklet, TODO: more detail about this
  "hooks": {
    "pre-copy": "",
    "post-copy": "",
    "configure": "",
    "complete": ""
  }
}
```

### KeyInfo: `README.md`

A detailed introduction to the blocklet, should clearify the following questions for a potential user to the blocklet:

- What the blocklet can do after installation? Though can be inferred from it's group, but worth a few words of description
- What are the requirements to use this blocklet? Including hardware, software, developer experience and skills
- What problems may users encounter when use the blocklet? and how to resolve them?

### KeyInfo: `logo.png`

The logo of the blocklet, can be any valid image, png recommended, will be displayed on blocklet detail page, should be a 200\*200 transparent image.

### Other Info

Including scripts that run during the process.

### Meta Info Resolving

To avoid duplicate fields defined in `package.json`, some fields can be omitted from `blocklet.json`, and the build process is smart enough to merge those fields together.

## How to create a blocklet?

Initialize a blocklet config with `forge blocklet:create`

- How to create a starter blocklet?
- How to create a dapp blocklet?
- How to create a contract blocklet?

## How to publish a blocklet?

1. Create your blocklet and make sure it's working
2. Fork this repository
3. Change `registry.yml` to include your repo
4. Send a pull request to this repository
5. Your blocklet is listed on official registry once your pull request is accepted and merged
