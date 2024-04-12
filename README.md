# Blockchain CLI Wrapper GUI

## Important Note

**Due to the suspension of unshielding processes, I have not been able to test this feature thoroughly. As a result, unshielding capabilities are not included in the current version of the app. However, implementing unshielding in the future should be straightforward, as the approach remains unchanged.**

## Getting Started

### Download and Install the .deb File

To download the .deb file for the Namada Shielded App, follow the link below:

[Download .deb package](https://namadawallet.nodeworld.xyz/namada.zip)

After downloading, unzip the file and install the app using the following commands in your terminal:

```bash
unzip namada.zip
sudo dpkg -i electron-namada-gui_1.0.0_amd64.deb
```

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
