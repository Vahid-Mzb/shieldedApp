const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const { spawn, exec } = require("child_process");
const fs = require("fs");

const createAndSaveWallet = require(path.join(
  __dirname,
  "scripts",
  "wallet",
  "main"
));
const fetchBalance = require(path.join(
  __dirname,
  "scripts",
  "wallet",
  "balance"
));
const main = require(path.join(__dirname, "scripts", "swapibc", "main"));
const { swap } = require(path.join(__dirname, "scripts", "swapnew", "swap"));

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "namada GUI",
    width: isDev ? 1200 : 1000,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Point to the preload script
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // if (isDev) {
  // mainWindow.loadURL("http://localhost:3000");
  // mainWindow.webContents.openDevTools();
  // } else {
  const appUrl = `file://${path.join(
    __dirname,
    "./front-namada/build/index.html"
  )}`;
  mainWindow.loadURL(appUrl);
  // }

  mainWindow.on("closed", () => (mainWindow = null));
}

app.whenReady().then(() => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

ipcMain.on("generate-wallet", (event, { name, password, confirmPassword }) => {
  const scriptPath = path.join(__dirname, "scripts/generatingWallet.sh"); // Adjust the path to your script
  const child = spawn("bash", [scriptPath, name, password, confirmPassword]);

  child.stdout.on("data", (data) => {
    mainWindow.webContents.send("generate-wallet-output", data.toString());
  });

  child.stderr.on("data", (data) => {
    mainWindow.webContents.send("process-output", data.toString());
  });

  child.on("close", (code) => {
    mainWindow.webContents.send(
      "process-output",
      `Process exited with code ${code}`
    );
  });
});

ipcMain.on("generate-spend", (event, { name, password, confirmPassword }) => {
  const scriptPath = path.join(__dirname, "scripts/generatingSpend.sh"); // Adjust the path to your script
  const child = spawn("bash", [scriptPath, name, password, confirmPassword]);

  child.stdout.on("data", (data) => {
    mainWindow.webContents.send("process-output", data.toString());
  });

  child.stderr.on("data", (data) => {
    mainWindow.webContents.send("process-output", data.toString());
  });

  child.on("close", (code) => {
    mainWindow.webContents.send(
      "process-output",
      `Process exited with code ${code}`
    );
  });
});

ipcMain.on(
  "derive-wallet",
  (event, { name, password, confirmPassword, mnemonic }) => {
    const scriptPath = path.join(__dirname, "scripts/derivingWallet.sh"); // Make sure the script path is correct
    const child = spawn("bash", [
      scriptPath,
      name,
      password,
      confirmPassword,
      mnemonic,
    ]);

    child.stdout.on("data", (data) => {
      mainWindow.webContents.send("derive-wallet-output", data.toString());
    });

    child.stderr.on("data", (data) => {
      mainWindow.webContents.send("process-output", data.toString());
    });

    child.on("close", (code) => {
      mainWindow.webContents.send(
        "process-output",
        `Process exited with code ${code}`
      );
    });
  }
);

ipcMain.on("list-spending-keys", (event, args) => {
  const scriptPath = path.join(__dirname, "scripts/spendingKeyList.sh"); // Adjust the path to your script
  const child = spawn("bash", [scriptPath, ...args]); // Assuming args is an array of arguments if needed

  child.stdout.on("data", (data) => {
    mainWindow.webContents.send("process-output", data.toString());
  });

  child.stderr.on("data", (data) => {
    mainWindow.webContents.send("process-output", data.toString());
  });

  child.on("close", (code) => {
    mainWindow.webContents.send(
      "process-output",
      `Process exited with code ${code}`
    );
  });
});

ipcMain.on("generate-payment-address", (event, { spendingKey, name }) => {
  const scriptPath = path.join(
    __dirname,
    "scripts/generatingPaymentAddress.sh"
  );
  const child = spawn("bash", [scriptPath, spendingKey, name]);

  child.stdout.on("data", (data) => {
    mainWindow.webContents.send("process-output", data.toString());
  });

  child.stderr.on("data", (data) => {
    mainWindow.webContents.send("process-output", data.toString());
  });

  child.on("close", (code) => {
    mainWindow.webContents.send(
      "process-output",
      `Process exited with code ${code}`
    );
  });
});

ipcMain.on("execute-epoch-script", (event, blockNumber) => {
  const command = "namadac";
  const args = [
    "shielded-sync",
    "--from-height",
    blockNumber,
    "--node",
    "https://rpc-namada.kintsugi-nodes.com/",
  ];

  const child = spawn(command, args);

  child.stdout.on("data", (data) => {
    event.sender.send("epoch-script-output", data.toString());
  });

  child.stderr.on("data", (data) => {
    event.sender.send("epoch-script-output", `Error: ${data.toString()}`);
  });

  child.on("close", (code) => {
    event.sender.send(
      "epoch-script-output",
      `Process exited with code ${code}`
    );
  });
});

ipcMain.on("create-and-save-wallet", async (event, password) => {
  try {
    const address = await createAndSaveWallet(password);
    event.sender.send("wallet-creation-output", address);
  } catch (error) {
    console.error("Wallet creation failed:", error);
    event.sender.send("wallet-creation-output", "Error creating wallet");
  }
});

ipcMain.on("fetch-balance", async (event, address) => {
  try {
    const balance = await fetchBalance(address);
    event.sender.send("balance-fetched", balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    event.sender.send("balance-fetched", "Error fetching balance");
  }
});

ipcMain.on("execute-wallet-script", (event, scriptName) => {
  let scriptPath;
  switch (scriptName) {
    case "transparent-address":
      scriptPath = path.join(__dirname, "/scripts/transparentAddress.sh");
      break;
    case "spending-keys":
      scriptPath = path.join(__dirname, "/scripts/spendingKeyList.sh");
      break;
    case "payment-address":
      scriptPath = path.join(__dirname, "/scripts/paymentAddress.sh");
      break;
    default:
      console.error("Invalid script name");
      event.reply("script-output", "Invalid script name");
      return;
  }

  const child = spawn("bash", [scriptPath]);

  child.stdout.on("data", (data) => {
    event.reply("script-output", data.toString().trim());
  });

  child.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    event.reply("script-output", `Error: ${data.toString().trim()}`);
  });

  child.on("close", (code) => {
    console.log(`Script executed with code: ${code}`);
  });
});

ipcMain.on("execute-main-function", async (event, args) => {
  const { password, tokenAmount, sourceChannel, recipientAddress } = args;
  try {
    // Assuming `main` is an async function that returns the output
    const result = await main(
      password,
      "367",
      "uosmo",
      tokenAmount,
      "ibc/DE6792CF9E521F6AD6E9A4BDF6225C9571A3B74ACC0A529F92BC5122A39D2E58",
      sourceChannel,
      recipientAddress
    );
    event.reply("main-function-result", JSON.stringify(result)); // Use JSON.stringify if result is an object
  } catch (error) {
    event.reply("main-function-result", `Error: ${error.message}`);
  }
});

let swapMnemonics = "";

ipcMain.on("run-walletouts-script", (event, alias) => {
  const scriptPath = path.join(__dirname, "scripts", "walletouts.sh");

  exec(`${scriptPath} ${alias}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      event.reply("walletouts-script-result", `Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }

    const mnemonic = stdout.trim().split("\n\n").pop();
    swapMnemonics = mnemonic;
    const userDataPath = app.getPath("userData");
    // console.log(userDataPath);
    const walletFilePath = path.join(userDataPath, "wallet.dat");
    fs.writeFileSync(walletFilePath, mnemonic);

    event.reply("walletouts-script-result", stdout);
  });
});

ipcMain.on("execute-swap", async (event, amount) => {
  try {
    console.log("swap1:", swapMnemonics);
    const output = await swap(
      "367",
      "uosmo",
      amount,
      "ibc/DE6792CF9E521F6AD6E9A4BDF6225C9571A3B74ACC0A529F92BC5122A39D2E58",
      swapMnemonics
    );
    event.reply("swap-execution-result", output);
  } catch (error) {
    console.error("Error executing swap:", error);
    event.reply("swap-execution-result", `Error: ${error.message}`);
  }
});

// ipcMain.on(
//   "execute-transfer",
//   (
//     event,
//     {
//       recipientAddress,
//       amount,
//       senderAddress,
//       destinationChannel,
//       sourceChannel,
//       password,
//     }
//   ) => {
//     const scriptPath = path.join(__dirname, "scripts", "transfer.sh");
//     const child = spawn(
//       "bash",
//       [
//         scriptPath,
//         recipientAddress,
//         amount,
//         senderAddress,
//         destinationChannel,
//         sourceChannel,
//       ],
//       {
//         env: { ...process.env, PASSWORD: password }, // Pass password as an environment variable
//       }
//     );

//     let scriptOutput = "";
//     child.stdout.on("data", (data) => {
//       scriptOutput += data.toString();
//     });

//     child.stderr.on("data", (data) => {
//       console.error(`stderr: ${data}`);
//       event.reply("transfer-execution-result", `Error: ${data.toString()}`);
//     });

//     child.on("close", (code) => {
//       if (code === 0) {
//         event.reply("transfer-execution-result", scriptOutput.trim());
//       } else {
//         console.log(`Script executed with code: ${code}`);
//         event.reply(
//           "transfer-execution-result",
//           `Execution failed with code: ${code}`
//         );
//       }
//     });
//   }
// );

ipcMain.on(
  "execute-transfer",
  (
    event,
    {
      recipientAddress,
      amount,
      senderAddress,
      destinationChannel,
      sourceChannel,
      token,
      password,
    }
  ) => {
    const scriptPath = path.join(__dirname, "scripts", "ibcTransfer.sh");
    const child = spawn(
      "bash",
      [
        scriptPath,
        senderAddress,
        amount,
        token,
        sourceChannel,
        recipientAddress,
        password,
      ],
      { env: { ...process.env, PASSWORD: password } }
    );

    let scriptOutput = "";
    child.stdout.on("data", (data) => {
      scriptOutput += data.toString();
    });

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      scriptOutput += `Error: ${data.toString()}`;
    });

    child.on("close", (code) => {
      if (code === 0) {
        event.reply("transfer-execution-result", scriptOutput.trim());
      } else {
        console.log(`Script executed with code: ${code}`);
        event.reply(
          "transfer-execution-result",
          `Execution failed with code: ${code}, Output: ${scriptOutput.trim()}`
        );
      }
    });
  }
);

ipcMain.on("transfer-info", (event, transferData) => {
  const {
    recipientAddress,
    amount,
    senderAddress,
    destinationChannel,
    sourceChannel,
    password,
  } = transferData;

  // Use path.join to ensure the path is correctly formatted across different OS
  const scriptPath = path.join(__dirname, "scripts", "transfer.sh");

  // Use template literals and the scriptPath variable
  const scriptCommand = `"${scriptPath}" "${recipientAddress}" "${amount}" "${senderAddress}" "${destinationChannel}" "${sourceChannel}" "${password}"`;

  exec(scriptCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      event.reply("transfer-execution-result", `Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      event.reply("transfer-execution-result", `Error: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    event.reply("transfer-execution-result", stdout); // Send stdout back to renderer process if needed
  });
});

ipcMain.on("fetch-wallet-balance", (event, walletAddress) => {
  const command = "namadac";
  const args = [
    "balance",
    "--owner",
    walletAddress,
    "--node",
    "https://rpc-namada.kintsugi-nodes.com/",
  ];

  // Using spawn to run the command asynchronously
  const child = spawn(command, args);

  // Gathering data from stdout
  let output = "";
  child.stdout.on("data", (data) => {
    output += data.toString();
  });

  // Handling error output
  child.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    event.sender.send("wallet-balance-error", `Error: ${data.toString()}`);
  });

  // When the command is done, send the result back to the renderer process
  child.on("close", (code) => {
    if (code === 0) {
      // If the command executed successfully
      event.sender.send("wallet-balance-output", output);
    } else {
      // If the command failed
      console.log(`Command failed with code ${code}`);
      event.sender.send(
        "wallet-balance-error",
        `Command failed with code ${code}`
      );
    }
  });
});

const menuTemplate = [
  ...(isMac ? [{ label: app.name, submenu: [{ label: "About" }] }] : []),
  { role: "fileMenu" },
  ...(!isMac ? [{ label: "Help", submenu: [{ label: "About" }] }] : []),
];
