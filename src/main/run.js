import { spawn } from "child_process";
import shellescape from "any-shell-escape";
import Config from "./Config";

export default function run(args) {
  args = shellescape(
    args
      .replace(/(?:\r\n|\r|\n)/g, " ")
      .trim()
      .split(" ")
  );
  const cmd = `${Config.config.binPath} --pretty=none -v --ignore-stdin ${args}`;
  return new Promise((resolve, reject) => {
    let out = "",
      err = "";
    const proc = spawn(cmd, {
      cwd: __dirname,
      shell: true,
      maxBuffer: 16 * 1024 * 1024,
      timeout: 5000
    });
    proc.stdout.on("data", data => {
      out += data.toString();
    });

    proc.stderr.on("data", data => {
      err += data.toString();
    });

    proc.on("close", code => {
      resolve({ code, cmd, out, err });
    });
  });
}
