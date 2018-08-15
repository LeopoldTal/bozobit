# Contribute to `bozobit` development

## Get

Requires [yarn](https://yarnpkg.com/lang/en/). 

Clone the repo, then install dependencies with

````
yarn
````

## Load the unpacked add-on into Firefox

Under [about:debugging](about:debugging), load the `src/` folder as a temporary add-on.

## "Build"

````
yarn build
````

zips the contents of `src` into `bozobit.xpi`.

## Test

### Regular

Requires [`karma-cli`](https://karma-runner.github.io/).

````
yarn test
````

runs the tests and generates a coverage report in `reports/coverage/`.

### Mutation testing

Requires [`stryker-cli`](https://stryker-mutator.io/).

````
stryker run
````

runs mutation testing and generates a report in `reports/mutation/`.
