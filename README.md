# programming-portfolio

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Publish to GitHub Pages

After changing projects, highlights, certificates, resume, or app code, publish the live site:

```powershell
npm run deploy
```

On Windows, if Git fails with an SSL certificate error, run:

```powershell
$env:GIT_SSL_NO_VERIFY='true'; npm run deploy
```

This runs the project sync script, builds `dist/`, and pushes it to the `gh-pages` branch. The site is at:

https://junitchi.github.io/programming-portfolio/

GitHub Pages only needs to be configured once: repo **Settings → Pages → Branch: `gh-pages` / Folder: `/ (root)`**.

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
