# makefile to automatize simple operations

server:
	python -m SimpleHTTPServer

deploy:
	# assume there is something to commit
	# use "git diff --exit-code HEAD" to know if there is something to commit
	# so two lines: one if no commit, one if something to commit 
	git commit -a -m "New deploy" && git push -f origin HEAD:gh-pages && git reset HEAD~

test:
	@./node_modules/.bin/mocha -R list tests

build:
	cat src/*.js						>  build/debug.js
	cat vendor/long-stack-traces/long-stack-traces.js	>> build/debug.js

minify: build
	curl --data-urlencode "js_code@build/debug.js"	\
		-d "output_format=text&output_info=compiled_code&compilation_level=SIMPLE_OPTIMIZATIONS" \
		http://closure-compiler.appspot.com/compile		\
		> build/debug.min.js
	@echo size minified + gzip is `gzip -c debug.min.js | wc -c` byte


JSDOC_ROOT	= $(HOME)/opt/jsdoc_toolkit-2.4.0/jsdoc-toolkit
docs:
	java -jar ${JSDOC_ROOT}/jsrun.jar ${JSDOC_ROOT}/app/run.js	\
			-D="noGlobal:true"				\
			-D="title:debug.js library"			\
			-t=${JSDOC_ROOT}/templates/Codeview/		\
			-d=docs/jsdocs/					\
			src/*
.PHONY: docs build minify


