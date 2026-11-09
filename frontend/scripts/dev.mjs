
import { spawn } from "node:child_process";

const port = 3000;
const url = `http://localhost:${port}`;
const nextCommand = process.platform === "win32" ? "next.cmd" : "next";

const nextProcess = spawn(nextCommand, ["dev", "--turbopack"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

let browserOpened = false;
let serverExited = false;

function openChrome() {
  if (browserOpened) return;

  browserOpened = true;

  let browserProcess;

  if (process.platform === "win32") {
    browserProcess = spawn("cmd", ["/c", "start", "", "chrome", url], {
      detached: true,
      stdio: "ignore",
    });
  } else if (process.platform === "darwin") {
    browserProcess = spawn("open", ["-a", "Google Chrome", url], {
      detached: true,
      stdio: "ignore",
    });
  } else {
    browserProcess = spawn("google-chrome", [url], {
      detached: true,
      stdio: "ignore",
    });
  }

  browserProcess.on("error", (error) => {
    console.error(`Could not open Chrome: ${error.message}`);
  });

  browserProcess.unref();
}

async function waitForServer() {
  if (serverExited || browserOpened) return;

  try {
    const response = await fetch(url);

    if (response.ok || response.status < 500) {
      openChrome();
      return;
    }
  } catch {
    // Next.js may still be starting up.
  }

  if (!serverExited && !browserOpened) {
    setTimeout(() => {
      void waitForServer();
    }, 500);
  }
}

nextProcess.once("error", (error) => {
  serverExited = true;
  console.error(`Could not start Next.js: ${error.message}`);
  process.exitCode = 1;
});

nextProcess.once("exit", (code, signal) => {
  serverExited = true;

  if (signal) {
    process.exitCode = 1;
  } else {
    process.exitCode = code ?? 0;
  }
});

void waitForServer();
