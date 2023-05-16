const { parse } = require("node-html-parser");

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

async function getCover(root, baseUrl) {
  const meta = root.querySelector("meta[property='og:image']");
  if (!meta || !meta.hasAttribute("content")) return "";
  let url = meta.getAttribute("content");
  if (url.startsWith("/")) url = baseUrl + url;

  // Check if image exists
  const res = await fetch(url);
  if (!res.ok) return "";

  return url;
}

async function getHtml(url) {
  const response = await fetch(url);
  const html = await response.text();
  const root = parse(html);
  return root;
}

module.exports = {
  getTitle,
  getDescription,
  getCover,
  getHtml,
};
