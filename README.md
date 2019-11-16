# cypress-runner
A boilerplate for using the Cypress module API to perform actions before, during, and after test runs. Includes some extra goodies such as path aliasing and eslint configuration.

## Installation
Clone the repository and run `yarn` to install all dependencies (yes, it's that easy)

## Usage
To run Cypress, open your preferred terminal, navigate to the project root, and run:</br>

`yarn cy:open` - to open Cypress in interactive mode</br>
`yarn cy:run` - to run Cypress in the terminal
[Why running Cypress in CLI mode still opens the browser](#why-running-cypress-in-cli-mode-still-opens-the-browser).

The cypress-runner script supports the following parameters:
- `--mode` or `-m`: Specify whether to `run` or `open` Cypress
- `--repeat` or `-r`: Runs Cypress `n` number of times
- `--browser` or `-b`: Run tests using `electron` or `chrome`.
- `--spec` or `-s`: Runs a specific spec file or glob of spec files.
- `--record`: Records the run if `true`.
- `--parallel`: Runs Cypress in parallel if `true`
- `--group`: Groups recorded tests together under a single run.
- `--ci-build-id`: Specifies a uniq id for grouping or parallelizing a run.

Defaults:
- `--mode open`
- `--repeat 1`
- `--browser chrome`
- `--spec "cypress/integration/**/*.spec.js"`
- `--record false`
- `--parallel false`

It is recommended that you **DO NOT** forcefully interrupt Cypress from the command line (Ctrl+C) while running tests as this will immediately exit the test runner _without_ executing any of your post-test cleanup.
[How we use the Cypress Module API](#how-we-use-the-cypress-module-api).

## Notes
### How we use the Cypress Module API
Our boilerplate makes use of the [Cypress Module API](https://docs.cypress.io/guides/guides/module-api.html) to open and run Cypress. This allows us more granular control of Cypress before, during, and after our test suite runs. We use this additional control to backup and restore our database, clean up residual test reports, and generate new test reports.

### Why running Cypress in CLI mode still opens the browser
Since we use Chrome as our default browser and Cypress does not yet support running Chrome headlessly, even running through the CLI will cause the Chrome browser to launch.
