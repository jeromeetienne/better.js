# makefile to automatize simple operations

server:
	python -m SimpleHTTPServer

deploy:
	# assume there is something to commit
	# use "git diff --exit-code HEAD" to know if there is something to commit
	# so two lines: one if no commit, one if something to commit 
	git commit -a -m "New deploy" && git push -f origin HEAD:gh-pages && git reset HEAD~

test:
	@./node_modules/.bin/mocha --harmony-proxies -R list tests

watch: build
	# fswatch is available at https://github.com/emcrisostomo/fswatch
	fswatch -o src/ betterjs/ | xargs -n1 -I{} make build

build:
	echo		 			>  build/better.js
	cat betterjs/better-buildprefix.js	>> build/better.js
	cat src/qgettersetter.js		>> build/better.js
	cat src/stacktrace.js			>> build/better.js
	cat src/assertwhichstop.js		>> build/better.js
	cat src/consolelogger.js		>> build/better.js
	cat src/gcmonitor.js			>> build/better.js
	cat src/globaldetector.js		>> build/better.js
	cat src/privatize.js			>> build/better.js
	cat src/strongtyping.js			>> build/better.js
	cat src/objecticer.js			>> build/better.js
	cat src/helpers/functionattr.js		>> build/better.js
	cat src/helpers/propertyattr.js		>> build/better.js
	cat src/helpers/classattr.js		>> build/better.js
	cat betterjs/better.js			>> build/better.js
	cat betterjs/better-buildsuffix.js	>> build/better.js
	#cat vendor/long-stack-traces/lib/long-stack-traces.js	>> build/debug.js

minify: build
	uglifyjs build/better.js > build/better.min.js
	@echo size minified + gzip is `gzip -c build/better.min.js | wc -c` byte

publish: minify
	npm publish

JSDOC_ROOT	= $(HOME)/opt/jsdoc_toolkit-2.4.0/jsdoc-toolkit
docs:
	java -jar ${JSDOC_ROOT}/jsrun.jar ${JSDOC_ROOT}/app/run.js	\
			-D="noGlobal:true"				\
			-D="title:better.js library"			\
			-t=${JSDOC_ROOT}/templates/Codeview/		\
			-d=docs/jsdocs/					\
			src/*.js src/helpers/*.js examples/helpers/*.js

.PHONY: docs build minify
