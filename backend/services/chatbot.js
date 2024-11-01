import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import chalk from "chalk";
import ora from "ora";
import prompt from "prompt-sync";

while (true) {
  const userInput = promptSync(chalk.green("You: "));
  if (userInput.toLowerCase() === "exit") {
    console.log(chalk.yellow("Goodbye!"));
    process.exit(0);
  }
  const result = await chat.sendMessage(userInput);

  if (result.error) {
    console.error(chalk.red("AI Error:"), result.error.message);
    continue;
  }
  const response = result.response.text();
  console.log(chalk.blue("AI:"), response);
}
