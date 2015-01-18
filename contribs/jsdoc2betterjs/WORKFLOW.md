## Possible Workflow with better.js cache directory

A better.js cache directory is just a directory which
cache your betterjs files.
It is the base of a possible workflow
to handle your [better.js](http://betterjs.org) files.
This workflow is made to easily test your code with your jsdoc.
It is all based on [jsdoc2betterjs](http://betterjs.org/docs/betterjs-jsdoc2betterjs.html).
This extracts the jsdoc and produces the files to test it.

It has been designed to be non obstrusive, thus you can integrate it easily in your workflow.
We will describe how to easily generate better.js code from your jsdoc.
We will describe how to run the produced code in your own software environment.
Thus you can painlessly test your code using your jsdoc.

It is just an possible workflow to show how to smoothly integrate better.js
in your software. Just one which works well for me, feel free to use the one that fit you.
Now let's see where we can go from this simple concept of better.js cache directory.

# Description
It is a simple directory named ```.betterjs```. It contains the better.js of your javascript files, and mirror your folders hierarchy. Here is an example:

```
myproject/file.js           # your javascript files
myproject/.betterjs/file.js # the associated better.js
```

And here is another example showing how it mirror your folders hierarchy.

```
myproject/foo/bar.js           # your javascript files
myproject/.betterjs/foo/bar.js # the associated better.js
```

# Designed to be non obstrusive

This is the main purpose by this workflow. i want it to be easy to integrate
in your project thus you can test with your jsdoc. And i wanted
to be easy to remove thus you can run without all those
checks in production.
Here is what i mean by non-obstrusive.

**non obstrusive in your source** : You keep editing your javascript as usual. Your source stay the same.

**non obstrusive in your files** : All the better.js files are in
a single place. You can easily delete them when you dont need them anymore. You can ignore them put it in .gitignore.

**non obstrusive in your workflow** : It is easy to switch between
the plain js version and better.js one. It is easy to add it or
remove it at will.


# FAQ

## How to automatically generate the .betterjs for a whole folder ?

If you want, you can scan your whole directory and generate all the associated better.js with this command.

```
jsdoc2betterjs -d .betterjs *.js **/*.js
```

## How to remove a .betterjs directory ?

Just remove the directory

```
rm -rf .betterjs
```

It will do.

## How can i ignore the .betterjs cache directory ?

Sometime, it may be useful to ignore the .betterjs cache directory.
As it is automatically generated, you may want to put it in
your [.gitignore](http://git-scm.com/docs/gitignore) or similars.
Like in [npm package.json](https://www.npmjs.org/doc/files/package.json.html) or [bower.json](http://bower.io/docs/creating-packages/).

## How can i integrate this workflow into a Makefile ?

Here is a possible Makefile.

```
###################################################
# Support betterjs cache dir - http://betterjs.org
buildBetterjs:
    jsdoc2betterjs -s -p -d .betterjs js/*.js js/**/*.js

watchBetterjs: buildBetterjs
    # fswatch is available at https://github.com/emcrisostomo/fswatch
    fswatch js/ | xargs -n1 jsdoc2betterjs -s -p -d .betterjs

cleanBetterjs:
    rm -rf .betterjs

serverBetterjs: buildBetterjs
    jsdoc2betterjs servecachedir .betterjs

###################################################
```


About fswatch, [fswatch](https://github.com/emcrisostomo/fswatch) is a simple tool i use to detect change in the filesystem. You can use another if you see fit. fswatch works well here as it output the filename of the changed file. Thus it is all incremental. When you change one file, only this file is regenerated.


## How to integrate it if i use express routing ?

There is a [connect middleware](http://senchalabs.github.com/connect)
that you can use in your express. It is highjack the delivery of javascript static files.
Before deliverying the static file, it checks your ```.betterjs``` folder.
If it contains a matching better.js file, it deliver this one instead.
Thus you load the better.js version without having to modify your
browser code.
Check out the [connect middleware for better.js](https://github.com/jeromeetienne/better.js/tree/master/contribs/connectBetterjs)

## How to integrate it if you load your javascript via script tag ?

Simply change the path of your javascript files.
It is only pointing to the ```.betterjs``` folder.
You can likely do that with a simple search/replace

## How to integrate it with a node.js project ?

You can simply change change the name in the require.js.
Another possibility would be to use
[require.extensions](http://nodejs.org/api/globals.html#globals_require_extensions) to highjack the require loading.
It would act as the url rewrite "if there is a .better.js for this file.js ? if so return this one instead".

## Can i change the name of the better.js cache directory ?

Definitly! ```.betterjs``` name is just a convention.

## Is this workflow mandatory ?

better.js cache directory is just an example of a workflow.
Use it, derive it and build your own, it is all up to you
It isn't a requirement at all. Feel free to use your own.
