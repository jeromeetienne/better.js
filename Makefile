# makefile to automatize simple operations

server:
	python -m SimpleHTTPServer

deploy:
	# assume there is something to commit
	# use "git diff --exit-code HEAD" to know if there is something to commit
	# so two lines: one if no commit, one if something to commit 
	git commit -a -m "New deploy" && git push -f origin HEAD:gh-pages && git reset HEAD~

test:
	@./node_modules/.bin/mocha --harmony -R list tests

build:
	echo		 				>  build/better.js
	cat examples-betterjs/better-buildprefix.js	>> build/better.js
	cat src/qgettersetter.js			>> build/better.js
	cat src/stacktrace.js				>> build/better.js
	cat src/assertwhichstop.js			>> build/better.js
	cat src/consolelogger.js			>> build/better.js
	cat src/gcmonitor.js				>> build/better.js
	cat src/globaldetector.js			>> build/better.js
	cat src/privateforjs.js				>> build/better.js
	cat src/typecheck.js				>> build/better.js
	cat src/objecticer.js				>> build/better.js
	cat src/helpers/functionattr.js			>> build/better.js
	cat src/helpers/propertyattr.js			>> build/better.js
	cat src/helpers/classattr.js			>> build/better.js
	cat src/helpers/classattr.js			>> build/better.js
	cat examples-betterjs/better.js			>> build/better.js
	cat examples-betterjs/better-buildsuffix.js	>> build/better.js
	
	#cat vendor/long-stack-traces/lib/long-stack-traces.js	>> build/debug.js

minify: build
	uglifyjs build/debug.js > build/debug.min.js
	@echo size minified + gzip is `gzip -c build/debug.min.js | wc -c` byte

buildBundle: build
	cat build/debug.js		>  build/debug-bundle.js
	cat examples/helpers/*.js	>> build/debug-bundle.js

minifyBundle: buildBundle
	uglifyjs build/debug-bundle.js > build/debug-bundle.min.js
	@echo size minified + gzip is `gzip -c build/debug-bundle.min.js | wc -c` byte



JSDOC_ROOT	= $(HOME)/opt/jsdoc_toolkit-2.4.0/jsdoc-toolkit
docs:
	java -jar ${JSDOC_ROOT}/jsrun.jar ${JSDOC_ROOT}/app/run.js	\
			-D="noGlobal:true"				\
			-D="title:debug.js library"			\
			-t=${JSDOC_ROOT}/templates/Codeview/		\
			-d=docs/jsdocs/					\
			src/*.js examples/helpers/*.js

.PHONY: docs build minify


