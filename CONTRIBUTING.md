# Contributing

This file details information necessary to technically support & maintain Resurface  
Additional technical information can be found in the [docs](docs) subdirectory

## Development commands

- `npm run store dev`
- `npm run xtn dev`

## Deploying the storefront

Commits to `main` branch are automatically published to [resurface.codecabana.com.au](https://resurface.codecabana.com.au) via [Vercel](https://vercel.com/codecabana)

## Publishing the browser extension

Browser extension `.zip` file is automatically created and added to the [Github releases](https://github.com/code-cabana/resurface/releases) when commits are added to the `main` branch

This `.zip` file must be manually uploaded and published via the [Chrome Web Store Developer dashboard](https://chrome.google.com/webstore/devconsole)
