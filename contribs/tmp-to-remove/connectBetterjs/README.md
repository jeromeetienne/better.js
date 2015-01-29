# Example of workflow with better.js cache folder

See description of [this workflow](https://github.com/jeromeetienne/better.js/blob/master/contribs/jsdoc2betterjs/WORKFLOW.md).

## Steps by Steps

- to run the server
    + ```node apps.js```
- we read a normal javascript file. e.g. example_js/main.js
    - ```curl http://127.0.0.1:3000/example_js/main.js```
    - It delivers raw main.js as there is no better.js version
- we generate the .betterjs cache folder
    - ```make build```
- we read the same url of our javascript file
    - ```curl http://127.0.0.1:3000/example_js/main.js```
    - But now it deliver the better.js version as it is present
- if you clean the ```.betterjs``` folder, and try again
    + ```make clean```
    - ```curl http://127.0.0.1:3000/example_js/main.js```
    + it will deliver the original again

## To run the server

This is a simple express server which use ```connect-betterjs.js``` middleware

```
node app.js
```

## To watch ```/example_js``` folder and, when it changes, generate better.js cache folder

```
make watch
```

## To build the better.js cache folder

```
make build
```

## To clean the better.js cache folder

```
make clean
```
