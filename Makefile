include .env
export

.PHONY: build

install:
	npm install

build:
	npm run build

# Recipes

reload: install build
