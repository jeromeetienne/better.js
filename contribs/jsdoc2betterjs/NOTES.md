# Notes
* now it is easy to automatically generate the better.js
* how to be super non intrusive with all the better.js file you create
    - ultimatly you want easily switch between plain javascript and better js

# Misc
* the issue seems similar to the coffescript/typescript etc...
* i compile from one language to another like them
    - in my case it is just javascript in both cases
    - is that different ?

# Where to put the files
- i dont want them in the way
- i dont want them in .git
- what about a .betterjs-cache at the root of the project
    + it would be easy to put in .gitignore and co
    + easy to remove via Makefile
    + the inner folders will be the one relative to the root of the project
- how to make ```jsdoc2betterjs``` support this ?
    + support this mode of output file writing
    + remove the write in current directory

# How to include ```file.better.js``` files in browser
- change routing via url rewrite
    + good for threex.gameeditor browser part
    + it is super easy to switch
- just plain change the name in the script.src

# How to include ```file.better.js``` files in node.js
- just change the name in the require.js ?
- use require.extensions to highhack the require loading
    + http://nodejs.org/api/globals.html#globals_require_extensions
- see is require.extensions can be used
    + it would act as the url rewrite


