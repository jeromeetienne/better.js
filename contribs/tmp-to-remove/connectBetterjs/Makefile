watch: build
	# fswatch is available at https://github.com/emcrisostomo/fswatch
	fswatch example_js/ | xargs -n1 jsdoc2betterjs -s -p -d .betterjs

build:
	jsdoc2betterjs -s -p -d .betterjs example_js/*.js example_js/**/*.js

clean:
	rm -rf .betterjs