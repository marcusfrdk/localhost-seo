let button;
let form;
let input;
let url;

const REPLACE_LOCALHOST = "your-domain.com";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function disableInput() {
  button.disabled = true;
  input.disabled = true;
}

function enableInput() {
  button.disabled = false;
  input.disabled = false;
}

function getDefaultUrl() {
  const stored = localStorage.getItem("url");
  if (stored) return stored;
  return "https://marcusfredriksson.com";
}

function updateElements(elements, value, url) {
  for (let i = 0; i < elements.length; i++) {
    const element = elements.item(i);
    element.innerHTML = value;

    if (url && element.tagName === "A") element.setAttribute("href", url);
  }
}

function updateImages(images, url) {
  for (let i = 0; i < images.length; i++) {
    const image = images.item(i);
    image.setAttribute("src", url);
  }
}

function cleanUrl(value) {
  return value.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "");
}

function updateUrls(elements, url) {
  for (let i = 0; i < elements.length; i++) {
    const element = elements.item(i);
    let value = url;
    if (element.classList.contains("stripped")) {
      value = url.replace(/(^\w+:|^)\/\//, "");
    }
    value = value.replace(/\/$/, "");
    element.innerHTML = value;
    element.setAttribute("href", value);
  }
}

function updateLinks(url) {
  const anchors = document.getElementsByClassName("card");
  for (let i = 0; i < anchors.length; i++) {
    anchors.item(i).setAttribute("href", url);
  }
}

function setError() {
  input.classList.add("error");
  setTimeout(() => {
    input.classList.remove("error");
  }, 3000);
}

async function getUrl(u) {
  const response = await fetch(`/getPage?url=${u}`, { method: "POST" });
  const data = await response.json();

  if (!response.ok) {
    setError();
    return;
  }

  localStorage.setItem("url", data.url);

  if (data.url.includes("localhost")) {
    data.url = data.url.replace("localhost", REPLACE_LOCALHOST);
    if (data.url.startsWith("https"))
      data.url = data.url.replace("https", "http");
    if (data.url.includes(":")) data.url = data.url.replace(/:\d+/, "");
  }

  if (!data.title) {
    data.title = cleanUrl(data.url);
  }

  updateLinks(data.url);
  updateElements(document.getElementsByClassName("desc"), data.description);
  updateUrls(document.getElementsByClassName("url"), data.url);
  updateImages(document.getElementsByClassName("cover"), data.cover);
  updateElements(
    document.getElementsByClassName("title"),
    data.title,
    data.url
  );
}

async function handleClick(e) {
  e.preventDefault();
  disableInput();
  await getUrl(input.value);
  enableInput();
}

async function main() {
  url = getDefaultUrl();
  input = document.getElementsByTagName("input").item(0);
  input.value = cleanUrl(url);
  form = document.getElementsByTagName("form").item(0);
  button = document.getElementsByTagName("button").item(0);
  button.addEventListener("click", handleClick);
  await getUrl(url);
  document.body.classList.remove("loading");
}

function cleanup() {
  button.removeEventListener("click", handleClick);
}

window.onload = main;
window.onunload = cleanup;
