import httpMethods from "./httpMethods";

export default function parseHttPieOutput(_output) {
  const output = [];
  let current = {
    type: null
  };
  const close = () => {
    if (current.lines && current.lines.length) {
      current.content = current.lines.join("\n");
      try {
        current.content = JSON.parse(current.content);
      } catch (e) {}
      output.push(current);
    }
    current = { type: null };
  };
  const save = line => {
    if (current.lines && line.trim().length) current.lines.push(line);
  };
  _output.split("\n").forEach(line => {
    if (current.type == null || current.type == "body") {
      if (line.startsWith("HTTP/")) {
        close();
        current = {
          type: "header",
          lines: []
        };
      } else if (httpMethods.some(m => line.startsWith(m))) {
        close();
        current = {
          type: "request",
          lines: []
        };
      } else if (current.type == null) {
        close();
        current = {
          type: "body",
          lines: []
        };
      }
    } else if (!line.trim().length && current.type != "body") {
      close();
      current = {
        type: null
      };
    }
    save(line);
  });
  close();
  return output;
}
