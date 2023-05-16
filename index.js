const express = require("express");
const helpers = require("./helpers");

const isDev = process.env.NODE_ENV === "development";
const app = express();
const port = isDev ? 3000 : process.env.PORT || 80;

app.disable("x-powered-by");
app.use(express.json());

async function start() {
  // Message
  const envMsg = `Environment: ${process.env.NODE_ENV?.toUpperCase()}`;

  console.log(envMsg);
  console.log("-".repeat(envMsg.length));

  // Routes
  app.use("/", express.static("static"));
  app.post("/getPage", async (req, res) => {
    // Parse url
    let url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing url" });
    if (!url.match(/^https?/g)) url = "http://" + url;
    if (url.includes("localhost") && url.startsWith("https"))
      url = url.replace("https", "http");
    url = new URL(url);

    // Get data
    const root = await helpers.getHtml(url.href);
    const title = helpers.getTitle(root);
    const description = helpers.getDescription(root);
    const cover = await helpers.getCover(root, url.href);

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
