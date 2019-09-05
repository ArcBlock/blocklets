TOP_DIR=.
README=$(TOP_DIR)/README.md

VERSION=$(strip $(shell cat version))

build: pre-build
	@echo "Building the software..."
	@DEBUG=@arcblock/* yarn build
	@rm public/*.js.map

init: install dep
	@echo "Initializing the repo..."

travis-init: install dep
	@echo "Initialize software required for travis (normally ubuntu software)"

install:
	@echo "Install software required for this repo..."
	@git submodule update --init
	@npm install -g gatsby-cli netlify-cli yarn

dep:
	@echo "Install npm dependencies required for this repo..."
	@yarn

pre-build: install dep clean prepare
	@echo "Running scripts before the build..."

post-build:
	@echo "Running scripts after the build is done..."

all: pre-build build post-build

test:
	@echo "Running test suites..."

lint:
	@echo "Linting the software..."
	@yarn lint

doc:
	@echo "Building the documenation..."

precommit: dep lint doc build test

travis: precommit

travis-deploy:
	@echo "Deploy the software by travis"
	@.makefiles/build.sh

clean:
	@echo "Cleaning the build..."
	@rm -rf .cache public

run:
	@echo "Running the software..."
	@yarn start

deploy:
	@echo "Deploying the software..."
	@netlify deploy

include .makefiles/*.mk

.PHONY: build init travis-init install dep pre-build post-build all test doc precommit travis clean watch run bump-version create-pr
