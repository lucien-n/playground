import chalk from "chalk";
import moment from "moment";
import { validate } from "uuid";

const log = console.log;

const getTime = () => `[${moment().format("YYYY-MM-DD HH:mm:ss")}]`;

const format = (...args: unknown[]) => {
  let text = "";

  for (const arg of args) {
    let styling = (text: unknown) => text;
    let coloring = (text: unknown) => text;

    if (typeof arg === "number" || parseFloat(`${arg}`))
      coloring = chalk.yellow;
    if (typeof arg === "boolean") coloring = chalk.magenta;

    if (typeof arg === "string") {
      if (arg.split(" ").length > 1) {
        text += format(...arg.split(" "));
        continue;
      }

      if (/[']/.test(arg))
        styling = arg.split("'").length % 2 === 1 ? chalk.bold : chalk.reset;

      if (validate(arg)) coloring = chalk.blue;
    }

    text += styling(coloring(arg)) + " ";
  }

  return text;
};

export const logger = {
  error: (...args: any[]) => {
    log(
      `${[chalk.bgRed(chalk.bold(" ERRO "))]} ${chalk.gray(getTime())}`,
      format(...args)
    );
  },

  warn: (...args: any[]) => {
    log(
      `${[chalk.bgYellow(chalk.bold(" WARN "))]} ${chalk.gray(getTime())}`,
      format(...args)
    );
  },

  info: (...args: any[]) => {
    log(
      `${[chalk.bgCyan(chalk.bold(" INFO "))]} ${chalk.gray(getTime())}`,
      format(...args)
    );
  },

  success: (...args: any[]) => {
    log(
      `${[chalk.bgGreenBright(chalk.bold(" SUCC "))]} ${chalk.gray(getTime())}`,
      format(...args)
    );
  },
};
