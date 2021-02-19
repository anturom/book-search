# Book Search

This app is my first Vue project. It provides an integration with Google Books API, and enables you to search for Google books from a custom GUI.

## How to run

To run the app locally, make sure that the following prerequisites are installed on your computer:

- [node.js](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/)
- [Vue CLI](https://cli.vuejs.org/)

Once you have installed npm and node.js:

1. Open a terminal and change the current directory to the one where you cloned this repository for example:

    ```cmd
    cd C:\projects\book-search
    ```

2. Run the following command:

    ```cmd
    npm run serve
    ```

## How to build

To build the app for production, run:

```cmd
npm run build
```

> NOTE: You may need to edit the **vue.config.js** file in the root directory to specify a different public path for the app. Currently, the default public path is `/book-search/`.
