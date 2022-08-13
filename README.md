# Wheaton College Web (TERMINALFOUR)

## Hi there, we're Bravery.

This web design uses [Eleventy](https://11ty.dev) and [Rollup](https://rollupjs.org/guide/en/) to build a static site and package up all the CSS and Javascript used to make it work. This README will help get you up and running. Make sure to check out both the 11ty and Rollup documentation for more info on changing configurations and adding features.

## Get setup:

1. Install version 17 of [Node JS](https://nodejs.org/en/blog/release/v17/) — we recommend using [Node Version Manager](https://npm.github.io/installation-setup-docs/installing/using-a-node-version-manager.html) for your projects. _In fact, we have an NVM config file included in this repo, just in case._

2. Next install the latest version of [NPM](https://www.npmjs.com/package/npm). As of now this commit, we're using v8.17.0.

3. After installing NPM make sure that it is in your path so you can use it in the command line. It usually works out of the bag on *Nix systems (MacOS, Linux, Unix), but sometimes the path needs to be added [manually in Windows](http://stackoverflow.com/questions/27864040/fixing-npm-path-in-windows-8/32159233).

4. Open this directory in Terminal or you CLI equivalent app.

5. Run `npm install` to install all the dependencies for the project. This can take several minutes.

6. Once you have the dependencies installed, run `npm start`. This will create a dev build and start watching for changes you make in the project folder and refresh your browser window.

7. When you're ready to do a production build, hit `CTL + C` to stop the watch process, then run `npm run build` to build production files.

11ty builds everything out to a new `_site` directory.