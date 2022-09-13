DIRNAME=$(notdir $(CURDIR))

ELMS=$(wildcard src/*.elm)

client/app.js: src/GuessWho.elm $(ELMS)
	-elm make $< --output=$@ 2> client/error.txt
	@cat client/error.txt
