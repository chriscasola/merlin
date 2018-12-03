# Contributing

## Get the code

`git clone https://github.com/chriscasola/merlin.git`

## Building, Etc.

### Install Dependencies

`npm i`

### Run the Full Build

`npm run build`

### Auto-Fix Lint Errors

`npm run lint`

## Repository Organization

This repo is made up of a collection of npm packages. Each attempts to serve a specific isolated purpose. Some of them depend on each other, and ultimately the `@merl/cli` package depends on all of them, since it is the primary user-facing package that contains the command-line interface for Merlin.

Consult the `README.md` in each package for more details on what functionality each provides.

## Recommended Developer Workflow

First follow the steps under [Get the code](#get-the-code) and [Building, Etc.](#building,-etc.).

Next, make your changes.

Re-run the build script.

Run `npm run merl -- <arguments to merlin here>` to hit your local build.

You can run the tests in watch mode by running `npx lerna run --stream dev --scope @merl/<package-name>`

You can update the snapshots for snapshot testing by running `npm run update-snapshots`

## Contribution Guidlines

* Add tests for all changes.
* Add documentation for all changes. Use tsdoc or user-facing markdown docs as necessary.
* Follow the conventional commit standard.
