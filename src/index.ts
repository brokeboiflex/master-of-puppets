import * as puppeteer from "puppeteer";
var colors = require("colors/safe");

function log(text: string, color?: string) {
  if (color) {
    console.log(colors[color](text));
  } else {
    console.log(text);
  }
}

interface Step {
  func: string;
  args: string[] | object[];
}

async function master(instructions: Step[]) {
  const errors = [];
  try {
    log("starting", "blue");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
      for (const { func, args } of instructions) {
        for (const arg of args) {
          log("executing: " + func + "(" + arg + ")", "green");
          await page[func](arg);
        }
      }
    } catch (error) {
      errors.push(error);
      log(error, "red");
    }
    browser.close();
    if (errors.length) {
      log("ending with errors", "magenta");
    } else log("ending", "blue");
  } catch (error) {
    log(error, "red");
  }
}

const inst = require("../instructions.json");

master(inst);
