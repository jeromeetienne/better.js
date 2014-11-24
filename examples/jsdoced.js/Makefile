
watch: build
	# fswatch is available at https://github.com/emcrisostomo/fswatch
	fswatch -o js/ | xargs -n1 -I{} make build

build:
	echo		 		>  ../../build/jsdoced.js
	cat js/extractJsdoc.js		>> ../../build/jsdoced.js
	cat js/jsdocToBetterFunction.js	>> ../../build/jsdoced.js
	cat js/parseJsdoc.js		>> ../../build/jsdoced.js
	cat js/jsdocFunction.js		>> ../../build/jsdoced.js
	cat js/jsdocFunctionOverload.js	>> ../../build/jsdoced.js

minify: build
	uglifyjs ../../build/jsdoced.js > ../../build/jsdoced.min.js
	@echo size minified + gzip is `gzip -c ../../build/jsdoced.min.js | wc -c` byte

.PHONY: build minify