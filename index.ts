import inquirer from "inquirer";
import chalk from 'chalk';
import chalkAnimation from "chalk-animation";

async function welcome() {
    let title = chalkAnimation.rainbow("\t\t\t\tWelcome to Interactive Bank Manager!");
    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });
    title.stop();
}

await welcome();

// Bank account interface
interface BankAccount {
    accountNumber: number;
    balance: number;
    withdraw(amount: number): void;
    deposit(amount: number): void;
    checkBalance(): void;
}

// Bank account class
class BankAccount implements BankAccount {
    accountNumber: number;
    balance: number;

    constructor(accountNumber: number, balance: number) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    // Debit money
    withdraw(amount: number): void {
        if (this.balance >= amount) {
            this.balance -= amount;
            console.log(chalk.green(`Withdrawal of $${amount} successful. Remaining balance: $${this.balance}`));
        } else {
            console.log(chalk.red("Insufficient balance."));
        }
    }

    // Credit money
    deposit(amount: number): void {
        if (amount > 100) {
            amount -= 1; // $1 fee charged if more than $100 is deposited
        }
        this.balance += amount;
        console.log(chalk.green(`Deposit of $${amount} successful. Remaining balance: $${this.balance}`));
    }

    // Check balance
    checkBalance(): void {
        console.log(chalk.blue(`Current balance: $${this.balance}`));
    }
}

// Customer class
class Customer {
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    mobileNumber: number;
    account: BankAccount;

    constructor(firstName: string, lastName: string, gender: string, age: number, mobileNumber: number, account: BankAccount) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
        this.account = account;
    }
}

// Create bank accounts
const accounts: BankAccount[] = [
    new BankAccount(1001, 500),
    new BankAccount(1002, 1000),
    new BankAccount(1003, 2000),
];

// Create customers
const customers: Customer[] = [
    new Customer("Areesha", "Kamran", "Female", 15, 123456789, accounts[0]),
    new Customer("Hamzah", "Syed", "Male", 24, 1112223334, accounts[1]),
    new Customer("Humaira", "Kamran", "Female", 43, 4443332221, accounts[2])
];

// Function to interact with bank account
async function service() {
    do {
        const accountNumberInput = await inquirer.prompt([
            {
                name: "accountNumber",
                type: "number",
                message: chalk.yellow("Enter your account number:")
            }
        ]);

        const customer = customers.find(customer => customer.account.accountNumber === accountNumberInput.accountNumber);
        if (customer) {
            console.log(chalk.yellow(`Welcome, ${customer.firstName} ${customer.lastName}!\n`));
            const ans = await inquirer.prompt([
                {
                    name: "select",
                    type: "list",
                    message: chalk.yellow("Select an operation:"),
                    choices: ["Deposit", "Withdraw", 'Check Balance', "Exit"]
                }
            ]);
            switch (ans.select) {
                case "Deposit":
                    const depositAmount = await inquirer.prompt([
                        {
                            name: "amount",
                            type: "number",
                            message: chalk.yellow("Enter the amount to deposit:")
                        }
                    ]);
                    customer.account.deposit(depositAmount.amount);
                    break;
                case "Withdraw":
                    const withdrawAmount = await inquirer.prompt([
                        {
                            name: "amount",
                            type: "number",
                            message: chalk.yellow("Enter the amount to withdraw:")
                        }
                    ]);
                    customer.account.withdraw(withdrawAmount.amount);
                    break;
                case "Check Balance":
                    customer.account.checkBalance();
                    break;
                case "Exit":
                    console.log(chalk.cyan("Exiting bank program..."));
                    console.log(chalk.green("Thank you for using our bank services. Have a great day!"));
                    return;
            }
        } else {
            console.log(chalk.red("Invalid account number. Please try again."));
        }
    } while (true);
}

service();
