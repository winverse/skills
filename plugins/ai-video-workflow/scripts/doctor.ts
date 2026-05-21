#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import net from "node:net";
import process from "node:process";

type Check = {
  name: string;
  ok: boolean;
  detail: string;
  required: boolean;
};

const args = process.argv.slice(2);
const json = args.includes("--json");
const requireVoicebox = args.includes("--require-voicebox");
const voiceboxPort = Number(valueFor("--voicebox-port") ?? "17493");

function valueFor(flag: string): string | undefined {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
}

function commandVersion(command: string, versionArgs: string[] = ["--version"]): Check {
  const result = spawnSync(command, versionArgs, {
    encoding: "utf8",
    shell: false,
    timeout: 5000,
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim().split(/\r?\n/)[0] ?? "";
  return {
    name: command,
    ok: result.status === 0,
    detail: result.status === 0 ? output : `${command} not available`,
    required: true,
  };
}

function checkNode(): Check {
  const major = Number(process.versions.node.split(".")[0] ?? "0");
  return {
    name: "node",
    ok: major >= 22,
    detail: `Node ${process.versions.node}`,
    required: true,
  };
}

function checkTcp(host: string, port: number, timeoutMs = 700): Promise<Check> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    let settled = false;

    const finish = (ok: boolean, detail: string): void => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve({
        name: "voicebox",
        ok,
        detail,
        required: requireVoicebox,
      });
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true, `Voicebox port open at ${host}:${port}`));
    socket.once("timeout", () => finish(false, `Voicebox port timed out at ${host}:${port}`));
    socket.once("error", () => finish(false, `Voicebox is not reachable at ${host}:${port}`));
  });
}

const checks: Check[] = [
  checkNode(),
  commandVersion("ffmpeg"),
  commandVersion("npx"),
  await checkTcp("127.0.0.1", voiceboxPort),
];

const failed = checks.filter((check) => check.required && !check.ok);

if (json) {
  console.log(JSON.stringify({ ok: failed.length === 0, checks }, null, 2));
} else {
  console.log("ai-video-workflow doctor");
  for (const check of checks) {
    const status = check.ok ? "ok" : check.required ? "fail" : "warn";
    console.log(`- ${status}: ${check.name} - ${check.detail}`);
  }
  if (!requireVoicebox && !checks.find((check) => check.name === "voicebox")?.ok) {
    console.log("- note: Voicebox is optional for scaffold, but required before speech generation.");
  }
}

if (failed.length) {
  process.exit(1);
}

