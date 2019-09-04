# WWW

[![Netlify Status](https://api.netlify.com/api/v1/badges/2196fd90-5ea3-4452-b548-7234c4a379c7/deploy-status)](https://app.netlify.com/sites/www-arcblock-io/deploys)

www.arcblock.io refined, designed can be found: https://app.zeplin.io/project/5c130f7114f82eaf4c8bde47

## Contribute

```bash
git clone git@github.com:ArcBlock/www.git
cd www
```

Install it and run:

```bash
make init
make run
```

## Built With

- [Gatsby](https://github.com/gatsbyjs/gatsby) is a static site generator for React.
- React
- Material UI
- Material UI Icons
- Styled Components
- React-Intl

## Notes

### `withRoot` usage

We are using the `withRoot` higher-order component to accommodate Material-UI's styling solution with Gatsby.

⚠️ You should only use a single `withRoot` for rendering one page.

## Plugins

- https://codebushi.com/gatsby-featured-images/

## Links

- [Crafting Complex Pages with Markdown](http://bootcamp.arcblock.io/bbl/bbl33-draft-pages-with-markdown.html)

## Preview Markdown Pages

Follow contribute section to setup www repo.

```shell
git checkout master
git pull

make init
make run
```

### How Page Links Are Generated

```shell
src/pages/Miner-test2
├── images
│   ├── console.png
│   ├── pipeline.png
│   └── platform.png
└── index.md
└── index.zh.md
```

If we have `path` defined as `/learning/miner-test` in both `index.md` and `index.zh.md`, then we have 2 pages:

- http://localhost:8000/en/learning/miner-test
- http://localhost:8000/zh/learning/miner-test
