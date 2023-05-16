![Banner](./assets/localhost-seo.gif)

# Localhost SEO

![top language](https://img.shields.io/github/languages/top/marcusfrdk/localhost-seo)
![code size](https://img.shields.io/github/languages/code-size/marcusfrdk/localhost-seo)
![last commit](https://img.shields.io/github/last-commit/marcusfrdk/localhost-seo)
![issues](https://img.shields.io/github/issues/marcusfrdk/localhost-seo)
![contributors](https://img.shields.io/github/contributors/marcusfrdk/localhost-seo)

A tool for debugging and visualizing static tags for a website or webapp hosted locally (localhost) or online.

## Install and Run

### Method 1: Docker (Recommended)

_This method requires [Docker](https://docs.docker.com/get-docker/) to be installed._

After installing docker, run the following command to start using the app:

```bash
docker run -d -p 8053:8053 --name localhost-seo marcusfrdk/localhost-seo:0.0.5
```

This will download the Docker container and run it in the background on [localhost:8053](http://localhost:8053).

#### Stopping

To stop and remove the container, run the following command:

```bash
docker rm -f localhost-seo
```

### Method 2: Local Installation

_This method required [NodeJS](https://nodejs.org) to be installed_

If Docker can not be used, you can also install the app locally by running the following commands:

```bash
git clone https://github.com/marcusfrdk/localhost-seo.git
cd localhost-seo
npm install
npm start
```

This will start the application on [localhost:8053](http://localhost:8053).

## Notes

- Only `static` html tags are supported. This means that tags that are generated by JavaScript will not be shown, such as `google.com` or `facebook.com`. These sites will not display as expected.

- Some sites like `twitter.com` block cross-origin requests, which means these sites can not be fetched and shows an error.
