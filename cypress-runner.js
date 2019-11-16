/* eslint-disable no-console */
const ora = require("ora")
const Bluebird = require("bluebird")
const cypress = require("cypress")
const yargs = require("yargs")
const { merge } = require("mochawesome-merge")
const marge = require("mochawesome-report-generator")
const fse = require("fs-extra")
const argv = yargs.options({
  "mode":        { alias: "m", default: "open", choices: [ "open", "run" ] },
  "repeat":      { alias: "r", default: 1 },
  "browser":     { alias: "b", default: "chrome", choices: [ "chrome", "electron" ] },
  "spec":        { alias: "s", default: "cypress/integration/**/*.spec.js" },
  "record":      { default: false },
  "parallel":    { default: false },
  "group":       { },
  "ci-build-id": { },
}).argv

async function generateReport (options) {
  try {
    const merged = await merge(options)
    const report = await marge.create(merged, options)

    return report
  } catch (err) {
    console.log(err)
  }
}
async function promiseSpinnerWrapper (promise, message, cb) {
  const spinner = ora(`${message} started`).start()

  try {
    // Conditionally execute a callback function once our promise resolves
    // This is useful for handling status codes from HTTP requests
    let data = await promise.then(res => { if (cb) { cb(res) } })

    spinner.succeed(`${message} completed`)

    return data
  } catch (err) {
    spinner.fail(`${message} failed`)
    throw new Error(err)
  }
}
async function runTests () {
  try {
    // Always remove reports from previous runs
    await promiseSpinnerWrapper(fse.emptyDir("cypress/report/mochawesome-report"), "Remove existing report files")
    // Run or open Cypress based on mode
    // execute n number of times based on repeat
    let results = await Bluebird.each([...Array(argv.repeat)], async () => {
      return await cypress[argv.mode]({
        "browser":     argv.browser,
        "spec":        argv.spec,
        "record":      argv.record,
        "parallel":    argv.parallel,
        "group":       argv.group,
        "ci-build-id": argv["ci-build-id"]
      })
    })

    if (argv.mode === "run") {
      const { reporterOptions } = await fse.readJson("./cypress.json")

      await promiseSpinnerWrapper(generateReport({ reportDir: reporterOptions.reportDir }), "Generate new report")
    }
    if (results.totalFailed >= 1) {
      throw new Error(`${results.totalFailed} tests failed`)
    }
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
(async () => {
  await runTests()
})()
