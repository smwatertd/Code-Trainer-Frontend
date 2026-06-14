.PHONY: install dev build test test-unit test-e2e codegen

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

test-unit:
	npm run test:unit

test-e2e:
	npm run test:e2e

codegen:
	npm run codegen:api
