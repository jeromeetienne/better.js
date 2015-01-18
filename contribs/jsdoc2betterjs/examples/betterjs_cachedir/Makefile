
# Put your stuff here

server:
	http-server -p 8000 .

###################################################
# Support live reload

livereload:
	livereload

reload:
	curl -X POST http://localhost:35729/reload

###################################################
# Support betterjs cache dir - http://betterjs.org
buildBetterjs:
	jsdoc2betterjs -s -p -d .betterjs *.js

watchBetterjs: buildBetterjs
	# fswatch is available at https://github.com/emcrisostomo/fswatch
	fswatch *.js | xargs -n1 jsdoc2betterjs -s -p -d .betterjs

cleanBetterjs:
	rm -rf .betterjs

serverBetterjs: buildBetterjs
	jsdoc2betterjs servecachedir .betterjs

###################################################
