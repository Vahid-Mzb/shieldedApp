# Blockchain CLI Wrapper GUI

## Important Note

**Due to the suspension of unshielding processes, I have not been able to test this feature thoroughly. As a result, unshielding capabilities are not included in the current version of the app. However, implementing unshielding in the future should be straightforward, as the approach remains unchanged.**

## Getting Started

## Step-by-Step Video Guide for Using the App

I have created a video guide that walks you through how to use the app step by step. The video is hosted on YouTube. You can watch it by following this link:

[Watch the video guide on YouTube](https://youtu.be/2ssZ01-6xzo)

I encourage you to watch this guide to enhance your understanding and ease of use of the application.

### Download and Install the .deb File

To download the .deb file for the Namada Shielded App, follow the link below:

[Download .deb package](https://namadawallet.nodeworld.xyz/namada.zip)

After downloading, unzip the file and install the app using the following commands in your terminal:

```bash
unzip namada.zip
sudo dpkg -i electron-namada-gui_1.0.0_amd64.deb
```

### Running Code Locally

To run code locally, follow these steps using the terminal:

1. Install the dependencies in each of the required directories by executing the following command in each directory:

   ```bash
   npm install
   ```

   Directories:
   - Main directory
   - `front-namada`
   - `/scripts/swapnew`
   - `/scripts/swapibc`
   - `/scripts/wallets`

2. Navigate to the `front-namada` directory, and build the user interface (UI) of the application by running:

   ```bash
   npm run build
   ```

   This command compiles the UI of the application.

3. Finally, in the main directory, start the application with the following command:

   ```bash
   npm start
   ```

   This will open a window where you can view the application locally.

   
### Modifying the UI or Backend

To make changes to the UI or Backend and see the changes live, follow these steps:

1. Open the `main.js` file located in the main directory.
2. Find and comment out the following lines (written in JavaScript):

   ```javascript
   const appUrl = `file://${path.join(__dirname, "./front-namada/build/index.html")}`;
   mainWindow.loadURL(appUrl);
   ```

3. Uncomment the following lines to enable live reloading and open developer tools:

   ```javascript
   // mainWindow.loadURL("http://localhost:3000");
   // mainWindow.webContents.openDevTools();
   ```

Now, you can modify the UI and observe the results live.


### Building the Application for Other Platforms

To build the application for other platforms, you can modify the `package.json` file in the main directory according to the format that Electron Forge requires. For more details, you can refer to the [Electron Forge documentation](https://www.electronforge.io/).

However, if you want to build the application specifically for Linux, execute the following command in the terminal in main directory:

```bash
npm run make
```

This command will build the application for Linux.



## Introduction

This application is designed to simplify the use of command-line interfaces (CLI) in the Namada space, making it more accessible for everyday users. It provides a graphical user interface (GUI) wrapper for interacting seamlessly with the Namada blockchain. Additionally, it supports shielded swaps on the Osmosis blockchain.

With our GUI, users can effortlessly perform various blockchain operations without the complexities of traditional CLI tools. Key features include:

- **Wallet Management**: Easily create and recover your wallet.
- **Shielded Actions**: Conduct transactions privately by transferring OSMO tokens from Namada to Osmosis, swapping them for USDC, and then moving the USDC to a shielded account on Namada.

The interface is designed to be user-friendly, allowing even those with minimal technical background to manage their blockchain transactions smoothly and securely.

## Shielded Actions Overview

Using this application, you can perform shielded transactions with ease. The process is designed to be straightforward and user-friendly, ensuring privacy in your blockchain interactions.

For a visual representation of how shielded actions are conducted within the app, see the schematic diagram linked below:

![Shielded Actions Schematic](/images/shematic.jpg)

This schematic provides a clear overview of the steps involved in initiating and completing a shielded transaction, making it easy for users to understand and follow.

## Usage

### Step 1: Create an Account on the Namada Blockchain

To begin using the app for shielded transactions, the first step involves creating a new account on the Namada blockchain. You can do this directly from the homepage of the application. Here’s how:

1. Navigate to **Wallet Management** on the homepage.
2. Select **Create Wallet**.
3. Choose an alias for your wallet and set a secure password.

![Wallet Management](/images/wallet-management.jpg)

You also have the option to recover your existing wallet and view your addresses through the same **Wallet Management** section. Follow similar steps and select **Recover Wallet** to regain access to an existing wallet.

## Shielded Accounts Menu

### Step 2: Create shiedlded Account on the Namada Blockchain

In the Shielded Accounts Menu of our application, you have the functionality to manage different types of keys and settings related to your shielded transactions:

- **Creating Spending Keys**: Generate new spending keys to authorize transactions.
- **Creating Payment Keys**: Generate new payment keys for receiving funds.
- **Syncing**: Below the interface, there is a toggle button which allows you to start syncing from a specified block height.

![Shielded Accounts](/images/shielded-accounts.jpg)

These features enhance the flexibility and security of managing your shielded accounts, making it straightforward to tailor the application to your needs.

## #IBC Transfer from Namada Menu

### Step 3: Performing a Shielded Transfer

Performing a shielded transfer using this app is a streamlined process. This functionality is part of the IBC (Inter-Blockchain Communication) transfer capabilities in the Namada menu. Here’s how you can use it:

1. **From Namada to Osmosis**: Easily transfer your OSMO from your Namada wallet to the Osmosis blockchain. This is particularly useful for shielded swapping purposes.
2. **Shielded Swapping**: After transferring your OSMO tokens to Osmosis, navigate to the Shielded Actions menu to perform a swap.
3. **Return to Namada**: Finally, transfer the swapped assets back to a shielded account on Namada.

Below is an image showing the menu where these actions are performed:

![Shielded Transfer](/images/shielded-transfer.jpg)

This streamlined process ensures your transactions remain private.

## Shielded Actions Menu

### Step 4: Performing a shielded action

The Shielded Actions Menu within this application is designed to facilitate various operations involving privacy. Here’s what you can do:

1. **Generate an Osmosis Wallet**: Create a new wallet for transactions on the Osmosis blockchain.
2. **Swapping on Osmosis**: Swap your tokens for USDC on the Osmosis blockchain.
3. **Return Funds to Namada**: After swapping, transfer your USDC back to a shielded account on Namada. The account created during this step acts as an intermediary to manage the swapping and shielding of your USDC tokens.

Below is an image showing the Shielded Actions Menu:

![Shielded Actions](/images/shielded-actions.jpg)

This menu provides all the tools necessary for secure transactions across Osmois and Namada, streamlining the process of swapping and shielding your assets.

```

```
