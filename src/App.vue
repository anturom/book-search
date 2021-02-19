<template>
  <form class="search-controls">
    <input
      v-model="searchText"
      placeholder="Enter a search term"
      id="searchText"
      type="text"
    />
    <button v-on:click="renderBooks" id="searchButton" type="button">
      Search
    </button>
  </form>
  <div v-html="statusEl" id="search-status"></div>
  <!-- <form class="filter-controls">
            <select id="select-saleability">
                <option value="free">free</option>
                <option value="paid">paid</option>
            </select>
            <select id="select-lang">
                <option value="en">english</option>
                <option value="de">deutsch</option>
                <option value="ro">română</option>
            </select>
            <select id="select-sorting">
                <option value="relevance">relevance</option>
                <option value="newest">newest</option>
            </select>
        </form> -->
  <div v-bind="container" id="container">
    <article v-for="item in books" :key="item.volumeInfo.id" class="book">
      <a target="blank" v-bind:href="item.volumeInfo.canonicalVolumeLink"
        ><img
          v-bind:src="item.volumeInfo.imageLinks.thumbnail"
          v-bind:alt="item.volumeInfo.title"
      /></a>
      <h2>
        <a
          target="blank"
          v-bind:href="item.volumeInfo.canonicalVolumeLink"
          v-bind:title="item.volumeInfo.title"
          >{{ item.volumeInfo.title }}</a
        >
      </h2>
      <div class="authors">{{ renderAuthors(item.volumeInfo.authors) }}</div>
      <div class="price">{{ renderPrice(item.saleInfo) }}</div>
    </article>
  </div>
  <form class="nav-controls">
    <button
      id="prevButton"
      v-if="isPrevButtonVisible"
      v-on:click="showPreviousPage"
      type="button"
    >
      Previous
    </button>
    <button
      id="nextButton"
      v-if="isNextButtonVisible"
      v-on:click="showNextPage"
      type="button"
    >
      Next
    </button>
  </form>
</template>

<script>
export default {
  data() {
    return {
      apiKey: "AIzaSyDNapzMf6XaGZxZfBjub4zvjVFAzmghm-w",
      startIndex: 0,
      pageSize: 6,
      totalItems: 0,
      searchText: "",
      statusEl: "",
      container: "",
      books: [],
    };
  },
  computed: {
    isPrevButtonVisible() {
      // Don't show a previous button if we are on the first page
      return this.startIndex == 0 ? false : true;
    },
    isNextButtonVisible() {
      // NOTE: Google Books API has a strange quirk in that it may return the total items incorrectly
      // E.g. it may report 51 total items but the array of returned books contains actually 3 records (which essentially means we are on the last page).
      if (this.totalItems > this.pageSize) {
        if (
          typeof this.books != "undefined" &&
          this.books.length == this.pageSize
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },
  methods: {
    async getBooks() {
      let baseUrl = "https://www.googleapis.com/books/v1/volumes";
      let url = `${baseUrl}?q=${encodeURI(this.searchText)}&startIndex=${
        this.startIndex
      }&maxResults=${this.pageSize}&filter=ebooks&key=${this.apiKey}`;
      let response = await fetch(url);
      if (response.status === 200) {
        return await response.json();
      } else {
        this.statusEl = `<span class="error-message">An error has occurred calling the Google Books API. HTTP status code: ${response.status}</span>`;
      }
    },
    async renderBooks() {
      // Clear any previous messages and content
      this.books = "";
      this.statusEl = "";

      // Get data
      if (this.searchText.length > 0) {
        let data = await this.getBooks();
        if (typeof data != "undefined") {
          if (data.totalItems > 0) {
            this.totalItems = data.totalItems;
            this.books = data.items;
          } else {
            this.statusEl = `<span class="info-message">The search returned no results. Please enter a different text.</span>`;
          }
        }
      } else {
        this.statusEl = `<span class="error-message">Please enter a search term.</span>`;
      }
    },
    renderAuthors(authors) {
      if (typeof authors != "undefined") {
        let htmlSegment = ``;
        authors.forEach((author) => {
          htmlSegment += `${author}, `;
        });
        // strip the last comma and space
        return htmlSegment.slice(0, htmlSegment.length - 2);
      } else {
        return "";
      }
    },
    renderPrice(saleInfo) {
      if (saleInfo.saleability === "FREE") {
        return `FREE`;
      } else if (saleInfo.saleability === "FOR_SALE") {
        return `${saleInfo.retailPrice.amount} ${saleInfo.retailPrice.currencyCode}`;
      } else if (saleInfo.saleability === "FOR_PREORDER") {
        return `FOR PREORDER`;
      } else {
        return `NOT FOR SALE`;
      }
    },
    showPreviousPage() {
      if (this.startIndex >= this.pageSize) {
        this.startIndex -= this.pageSize;
        this.renderBooks();
      }
    },
    showNextPage() {
      this.startIndex += this.pageSize;
      this.renderBooks();
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}

#container {
  margin: 20px 5%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  justify-content: center;
}

@media (max-width: 70rem) {
  #container {
    margin: 20px 10%;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 40rem) {
  #container {
    margin: 10px;
    grid-template-columns: 100%;
    gap: 1rem;
  }
}

.search-controls,
.nav-controls,
.filter-controls,
#search-status {
  margin: 10px auto;
  text-align: center;
}

header {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1.5rem;
  background-color: rgba(8, 19, 116, 0.76);
  color: white;
  text-align: center;
  margin-bottom: 1rem;
  font-size: xx-large;
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
}

.book {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0.5rem;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-auto-rows: minmax(auto, 1.8rem) minmax(auto, 1fr) minmax(auto, 1.5rem);
  gap: 0.2rem 0.5rem;
}

.book a {
  grid-row: span 3;
}

.book > .authors {
  font-size: small;
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  color: cadetblue;
}

.book h2 {
  margin: 0.3rem 0;
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  white-space: nowrap;
  overflow: hidden;
}

.book > h2 > a {
  text-decoration: none;
  color: black;
}

.book > .price {
  text-align: end;
  color: brown;
  font-size: 0.8rem;
  font-weight: bold;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.info-message {
  color: gray;
}

.error-message {
  color: red;
}

.success-message {
  color: green;
}

button {
  font: inherit;
  border: 1px solid #88005b;
  background-color: #88005b;
  color: white;
  padding: 0.5rem;
  margin: 0 0.5rem;
  border-radius: 12px;
  width: 5rem;
  cursor: pointer;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.26);
}

button:focus {
  outline: none;
}

button:hover,
button:active {
  background-color: #af0a78;
  border-color: #af0a78;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.26);
}

input {
  font: inherit;
  border: 1px solid #88005b;
  background-color: antiquewhite;
  padding: 0.5rem;
  /* border-radius: 12px; */
  width: 10rem;
  /* box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.26); */
}
</style>
