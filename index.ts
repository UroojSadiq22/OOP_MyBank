#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

interface BankAccount {
  accountNumber: number;
  balance: number;
  withdraw(amount: number): void;
  credit(amount: number): void;
  checkBalance(): void;
}

class BankAccount implements BankAccount {
  accountNumber: number;
  balance: number;

  constructor(accNum: number, bal: number) {
    this.accountNumber = accNum;
    this.balance = bal;
  }

  withdraw(amount: number): void {
    if (amount <= this.balance) {
      this.balance -= amount;
      console.log(
        chalk.green(`\n$${amount} is successfully withdrawl from your account.`)
      );
      console.log(
        chalk.magenta(`Your remaining balance is $${this.balance}\n`)
      );
    } else {
      console.log(chalk.red("\nSorry! insufficient Balance.\n"));
    }
  }

  credit(amount: number): void {
    if (amount > 100) {
      amount -= 1;
    }
    this.balance += amount;
    console.log(
      chalk.green(`\n$${amount} is successfully credit to your account.`)
    );
    console.log(chalk.magenta(`Your current balance is $${this.balance}\n`));
  }

  checkBalance(): void {
    console.log(chalk.magenta(`\nYour current balance is $${this.balance}\n`));
  }
}

class Customers {
  firstName: string;
  lastName: string;
  age: number;
  mobileNumber: number;
  accountNumber: BankAccount;

  constructor(
    fName: string,
    lName: string,
    age: number,
    mobNum: number,
    accNumber: BankAccount
  ) {
    this.firstName = fName;
    this.lastName = lName;
    this.age = age;
    this.mobileNumber = mobNum;
    this.accountNumber = accNumber;
  }
}

let accounts: BankAccount[] = [
  new BankAccount(10001, 1000),
  new BankAccount(10002, 5000),
  new BankAccount(10003, 3000),
];

let customers: Customers[] = [
  new Customers("Urooj", "Sadiq", 20, 7652318908, accounts[0]),
  new Customers("Amber", "Hasnain", 22, 1298312109, accounts[1]),
  new Customers("Aliyah", "Iqbal", 21, 5221893084, accounts[2]),
];

async function start() {
  console.log(chalk.bold.cyan("\n Welcome to our BANKING APP \n"));

  await new Promise((resolve) => setTimeout(resolve, 2000));

  let accNumberInput = await inquirer.prompt({
    name: "accNumber",
    type: "number",
    message: chalk.yellow("Enter Your Account Number"),
  });

  let customerCheck = customers.find(
    (i) => i.accountNumber.accountNumber === accNumberInput.accNumber
  );

  if (customerCheck) {
    console.log(
      "\nWelcome",
      chalk.greenBright.italic(
        `${customerCheck.firstName} ${customerCheck.lastName}\n`
      )
    );
    let docontinue = false;
    do {
      let select = await inquirer.prompt({
        name: "selectOption",
        type: "list",
        message: chalk.yellow("Select the option"),
        choices: ["Withdraw", "Credit", "Check Balance", "Exit"],
      });

      switch (select.selectOption) {
        case "Withdraw":
          let withdrawAmount = await inquirer.prompt({
            name: "value",
            type: "number",
            message: chalk.yellow(
              "Enter the amount you wish to withdarw from your account"
            ),
          });
          customerCheck.accountNumber.withdraw(withdrawAmount.value);
          break;

        case "Credit":
          let creditAmount = await inquirer.prompt({
            name: "value",
            type: "number",
            message: chalk.yellow(
              "Enter the amount you wish to credit in your account.\n",
              chalk.italic.blackBright(
                "Service charges of $1 will be deduct if your credit amount is greater than 100."
              )
            ),
          });
          customerCheck.accountNumber.credit(creditAmount.value);
          break;

        case "Check Balance":
          customerCheck.accountNumber.checkBalance();
          break;

        case "Exit":
          console.log(
            chalk.red(
              "\nYou are leaving.. Thank You for using our banking services.\n"
            )
          );
          return;
      }
      let again = await inquirer.prompt({
        name: "answer",
        type: "confirm",
        message: chalk.yellow("Do you want to continue?"),
      });
      docontinue = again.answer;
    } while (docontinue);
  } else {
    console.log(chalk.red("Invalid Account Number. Try Again!"));
  }
}

start();
