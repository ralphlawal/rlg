// Local stand-in for Formspree used in end-to-end tests. Records submissions; never sends email.
// Usage: node scripts/mock-formspree.mjs [port]   POST /f/<id> → 200 ok · GET /last → last submission · POST /mode/<ok|fail|invalid>
import { createServer } from "node:http";
const port = Number(process.argv[2] ?? 3199);
let last = null;
let mode = "ok";
createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    if (req.url === "/last") return res.end(JSON.stringify(last));
    if (req.url?.startsWith("/mode/")) { mode = req.url.slice(6); return res.end(mode); }
    if (req.method === "POST" && req.url?.startsWith("/f/")) {
      last = JSON.parse(body || "{}");
      if (mode === "fail") { res.statusCode = 503; return res.end("{}"); }
      if (mode === "invalid") { res.statusCode = 422; return res.end(JSON.stringify({ errors: [{ field: "email", message: "should be an email" }] })); }
      res.setHeader("content-type", "application/json");
      return res.end(JSON.stringify({ ok: true, next: "/thanks" }));
    }
    res.statusCode = 404; res.end();
  });
}).listen(port, () => console.log(`mock formspree on ${port}`));
