SHELL := /bin/sh
PDFLATEX ?= pdflatex
export SOURCE_DATE_EPOCH := 1795651200
export FORCE_SOURCE_DATE := 1
export TZ := UTC
.PHONY: verify paper

verify:
	@sh verify.sh build

paper:
	@mkdir -p build/tex
	@$(PDFLATEX) -halt-on-error -interaction=batchmode -output-directory=build/tex paper/main.tex
	@$(PDFLATEX) -halt-on-error -interaction=batchmode -output-directory=build/tex paper/main.tex
	@! grep -E 'Overfull|undefined references|undefined citations|Warning:' build/tex/main.log
	@cp build/tex/main.pdf paper/main.pdf
