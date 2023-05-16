const express = require("express");
const { parse } = require("node-html-parser");

const app = express();
const port = process.env.PORT || 8053;

app.disable("x-powered-by");
app.use(express.json());

function getTitle(root) {
  const title = root.querySelector("title");
  if (!title) return "";
  return title.text || "";
}

function getDescription(root) {
  const meta = root.querySelector("meta[name='description']");
  if (!meta || !meta.hasAttribute("content")) return "";
  return meta.getAttribute("content");
}

function removeTrailingSlash(value) {
  return value.replace(/\/$/, "");
}

async function getCover(root, baseUrl) {
  const meta = root.querySelector("meta[property='og:image']");
  if (!meta || !meta.hasAttribute("content")) return "";
  let url = meta.getAttribute("content");
  if (url.startsWith("/")) url = removeTrailingSlash(baseUrl) + url;

  // Check if image exists
  const res = await fetch(url);
  if (!res.ok) return "";

  return url;
}

async function getHtml(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const root = parse(html);
    return root;
  } catch (err) {
    return null;
  }
}

async function start() {
  // Routes
  app.use("/", express.static("static"));
  app.post("/getPage", async (req, res) => {
    // Parse url
    let url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing url" });
    if (!url.match(/^https?/g)) url = "http://" + url;
    if (url.includes("localhost") && url.startsWith("https")) {
      url = url.replace("https", "http");
    }

    // Replace localhost with host.docker.internal
    // Due do Docker's networking, calling localhost from
    // inside a container. The host.docker.internal hostname
    // resolves to the internal IP address used by the host.
    if (
      process.env.NODE_ENV === "docker" &&
      url.startsWith("http://localhost")
    ) {
      url = url.replace("http://localhost", "http://host.docker.internal");
    }

    url = new URL(url);

    // Get data
    const root = await getHtml(url.href);
    if (!root)
      return res.status(403).json({ error: "Failed to fetch resource" });
    const title = getTitle(root);
    const description = getDescription(root);
    const cover = await getCover(root, url.href);

    res.json({ url: url.href, cover, title, description });
  });

  // Catch all route
  app.all("*", (req, res) => {
    res.status(404).json({
      status: 404,
    });
  });

  // Server
  const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });

  process.on("SIGINT", async () => {
    if (server.listening)
      server.close(async () => {
        console.log("Server closing, goodbye");
        process.exit(0);
      });
  });
}

start();
