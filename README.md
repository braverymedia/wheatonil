# Wheaton College Web (TERMINALFOUR)

## Hi there, welcome to Wheaton College's new site!
First and foremost, this branch `newMain`, is simply a collection of HTML, CSS, and JavaScript files that are being served via an express server (`/index.js`) which is aggregated in `/index.html`. 

## **PLEASE NOTE** 

The output files (HTML, CSS, JS) that are intended be copied from this repository to Wheaton's current site's CMS can be found in `src/components/`. The HTML from the `src/components` files are copied directly from the `index.html`. The respective component's HTML is designated by comments (example below). 

```html
index.html component comment example

<body>
    <!-- navbar component start  -->
    <header data-size="normal" class="main-header">
        <a href="/" title="Wheaton College homepage">
            <img id="nav-logo-main" src="/public/images/svg/logo-main.svg" />
        </a>
...

    <!--navbar component end -->

```

The CSS and JS files follow a similar pattern, where the actual/live files are added as dependencies to `index.html` (linked from `public/css` or `public/js`), and copies of those files can be found in `src/components`.

**When you make changes, ensure you are doing so in the `public` directory NOT the `src/components`**, otherwise your changes will not be shown or served in browser when you run this project locally

<br/>

## Let's get you setup!

1. Once you've cloned the repository, open up your terminal/Git UI of choice and ensure that you've checked out the `newMain` branch
```
git checkout newMain
```
2. Next, navigate to the root of the project (`/wheatonil`). You should see the following directory:

```
README.md	index.js	public
index.html	pages		src
```

3. Assuming you have Node installed (I'm running v16.15.0), go ahead and run the following in your terminal  

```
node index.js
```
4. You should then see the following in your terminal

```
now serving on PORT: 8080
```
5. Open up your browser of choice and go to the following address - or click the link below:

[http://localhost:8080/](http://localhost:8080/)