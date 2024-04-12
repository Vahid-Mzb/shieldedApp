const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  sendTransferInfo: (transferData) =>
    ipcRenderer.send("transfer-info", transferData),
  onTransferResult: (callback) => {
    const handler = (event, ...args) => callback(...args);
    ipcRenderer.on("transfer-execution-result", handler);
    return () =>
      ipcRenderer.removeListener("transfer-execution-result", handler);
  },
  fetchWalletBalance: (walletAddress) => {
    ipcRenderer.send("fetch-wallet-balance", walletAddress);
  },
  onWalletBalanceOutput: (callback) => {
    ipcRenderer.on("wallet-balance-output", (event, output) => {
      callback(output);
    });

    // Return a function to remove this listener when the component unmounts
    return () => {
      ipcRenderer.removeListener("wallet-balance-output", callback);
    };
  },
  onWalletBalanceError: (callback) => {
    ipcRenderer.on("wallet-balance-error", (event, error) => {
      callback(error);
    });

    // Return a function to remove this listener when the component unmounts
    return () => {
      ipcRenderer.removeListener("wallet-balance-error", callback);
    };
  },
});

contextBridge.exposeInMainWorld("electron", {
  // Method to send data to generate a wallet, receiving name, password, and confirmPassword as arguments
  generateWallet: (name, password, confirmPassword) =>
    ipcRenderer.send("generate-wallet", { name, password, confirmPassword }),

  // Method to generate a payment address, receiving name and spendingKey as arguments
  generatePaymentAddress: (name, spendingKey) =>
    ipcRenderer.send("generate-payment-address", { name, spendingKey }),

  // Method to list spending keys, can receive additional arguments if necessary
  listSpendingKeys: (args) => ipcRenderer.send("list-spending-keys", args),

  // Method to receive process output, setting up a listener for 'process-output' events
  onProcessOutput: (callback) => {
    ipcRenderer.on("process-output", callback);
    return () => ipcRenderer.removeListener("process-output", callback);
  },

  // Method to generate spend, receiving name, password, and confirmPassword as arguments
  generateSpend: (name, password, confirmPassword) =>
    ipcRenderer.send("generate-spend", { name, password, confirmPassword }),

  // Method to derive a wallet, receiving name, password, confirmPassword, and mnemonic as arguments
  deriveWallet: (name, password, confirmPassword, mnemonic) =>
    ipcRenderer.send("derive-wallet", {
      name,
      password,
      confirmPassword,
      mnemonic,
    }),

  // Method to execute the epoch script, sending the blockNumber to the main process
  executeEpochScript: (blockNumber) =>
    ipcRenderer.send("execute-epoch-script", blockNumber),

  removeProcessOutputListener: () =>
    ipcRenderer.removeAllListeners("process-output"),

  // Method to receive continuous output from the epoch script execution
  onEpochScriptOutput: (callback) => {
    ipcRenderer.on("epoch-script-output", callback);

    // Provide a method to clean up the listener to prevent memory leaks
    return () => ipcRenderer.removeListener("epoch-script-output", callback);
  },
  createAndSaveWallet: (password) =>
    ipcRenderer.send("create-and-save-wallet", password),
  onWalletCreationOutput: (callback) => {
    ipcRenderer.on("wallet-creation-output", callback);
    return () => ipcRenderer.removeListener("wallet-creation-output", callback);
  }, // Remove a specific listener
  removeOnWalletCreationOutput: (callback) => {
    ipcRenderer.removeListener("wallet-creation-output", callback);
  },
  fetchBalance: (address) => ipcRenderer.send("fetch-balance", address),
  onBalanceFetched: (callback) => {
    ipcRenderer.on("balance-fetched", callback);
    return () => ipcRenderer.removeListener("balance-fetched", callback);
  },
  executeWalletScript: (scriptName) => {
    ipcRenderer.send("execute-wallet-script", scriptName);
  },
  onScriptOutput: (callback) => {
    ipcRenderer.on("script-output", (_, message) => callback(message));
  },
  removeScriptOutputListener: () => {
    ipcRenderer.removeAllListeners("script-output");
  },
  executeMainFunction: (args) =>
    ipcRenderer.send("execute-main-function", args),
  onMainFunctionResult: (callback) => {
    ipcRenderer.on("main-function-result", (event, result) => callback(result));

    return () => {
      ipcRenderer.removeAllListeners("main-function-result");
    };
  },
  runWalletoutsScript: (alias) =>
    ipcRenderer.send("run-walletouts-script", alias),
  onWalletoutsScriptResult: (callback) => {
    ipcRenderer.on("walletouts-script-result", (_, message) =>
      callback(message)
    );

    return () => ipcRenderer.removeAllListeners("walletouts-script-result");
  },
  executeSwap: (amount) => ipcRenderer.send("execute-swap", amount),
  onSwapExecutionResult: (callback) => {
    ipcRenderer.on("swap-execution-result", (_, message) => callback(message));

    return () => ipcRenderer.removeAllListeners("swap-execution-result");
  },
  executeTransfer: (transferData) =>
    ipcRenderer.send("execute-transfer", transferData),
  onTransferExecutionResult: (callback) => {
    ipcRenderer.on("transfer-execution-result", (_, message) =>
      callback(message)
    );
    return () =>
      ipcRenderer.removeListener("transfer-execution-result", callback);
  },
  removeTransferExecutionResultListener: (callback) => {
    ipcRenderer.removeListener("transfer-execution-result", callback);
  },
  generateWallet: (name, password, confirmPassword) =>
    ipcRenderer.send("generate-wallet", { name, password, confirmPassword }),

  onGenerateWalletOutput: (callback) => {
    ipcRenderer.on("generate-wallet-output", (_, message) => callback(message));
    return () => {
      ipcRenderer.removeAllListeners("generate-wallet-output");
    };
  },

  deriveWallet: (name, password, confirmPassword, mnemonic) =>
    ipcRenderer.send("derive-wallet", {
      name,
      password,
      confirmPassword,
      mnemonic,
    }),

  onDeriveWalletOutput: (callback) => {
    ipcRenderer.on("derive-wallet-output", (_, message) => callback(message));
    return () => {
      ipcRenderer.removeAllListeners("derive-wallet-output");
    };
  },
});
