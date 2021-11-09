# Book Search

This app was written in Vue.js. It integrates with the [Google Books API](https://developers.google.com/books/), and enables searching for Google books from a custom GUI.

## Prerequisites

To run the app locally, make sure that the following prerequisites are installed on your computer:

- [node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)

## How to run the app locally

Once you have installed the prerequisites:

1. Open a terminal and change the current directory to the one where you cloned this repository, for example:

    ```cmd
    cd C:\projects\book-search
    ```

2. Install dependencies by running the following command in the project's directory:

    ```cmd
    npm install
    ```

    This command will create the **node_modules** directory which stores all of the project's depedencies.

3. You can now start the local development server with:

    ```cmd
    npm run serve
    ```

## How to build

To build the app for production, run:

```cmd
npm run build
```

> NOTE: You may need to edit the **vue.config.js** file in the root directory to specify a different public path for the app. Currently, the default public path is `/`.
