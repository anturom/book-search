<template>
  <form class="search-controls">
    <input
      v-model.lazy="searchText"
      placeholder="Enter a search term"
      id="searchText"
      type="text"
    />
    <button v-on:click="renderBooks" id="searchButton" type="button">
      Search
    </button>
  </form>
  <div v-if="isLoading" style="text-align: center">
    <img src="./assets/spinner.jpg" alt="Loading..." />
  </div>
  <keep-alive>
    <search-filters
      v-if="!isLoading && books && books.length > 0"
      @on-price-select="filterPrice"
      @on-lang-select="filterLanguage"
      @on-order-select="changeOrder"
    ></search-filters>
  </keep-alive>
  <div v-html="statusEl" id="search-status"></div>
  <div id="container">
    <book-info
      v-for="item in books"
      :key="item.id"
      :title="item.volumeInfo.title"
      :link="item.volumeInfo.canonicalVolumeLink"
      :image-links="item.volumeInfo.imageLinks"
      :authors="item.volumeInfo.authors"
      :sale-info="item.saleInfo"
    ></book-info>
  </div>
  <form v-if="!isLoading" class="nav-controls">
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
      pageSize: 24,
      totalItems: 0,
      searchText: "",
      statusEl: "",
      books: [],
      filter: "ebooks",
      langRestrict: "",
      orderBy: "relevance",
      isLoading: false,
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
  watch: {
    // Whenever user searches for a new term, reset the start index to 0
    searchText() {
      this.startIndex = 0;
    },
  },
  methods: {
    async getBooks() {
      let baseUrl = "https://www.googleapis.com/books/v1/volumes";
      let url = `${baseUrl}?q=${encodeURI(this.searchText)}&startIndex=${
        this.startIndex
      }&maxResults=${this.pageSize}&filter=${this.filter}&langRestrict=${
        this.langRestrict
      }&orderBy=${this.orderBy}&key=${this.apiKey}`;
      this.isLoading = true;
      let response = await fetch(url).catch((error) => {
        this.isLoading = false;
        this.statusEl = `<span class="error-message">${error}</span>`;
      });
      if (response.status === 200) {
        this.isLoading = false;
        return await response.json();
      } else {
        this.isLoading = false;
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
            this.statusEl = `<span class="info-message">The search returned no results. Please change the search criteria.</span>`;
          }
        }
      } else {
        this.statusEl = `<span class="error-message">Please enter a search term.</span>`;
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
    filterPrice(price) {
      this.filter = price;
      this.startIndex = 0;
      this.renderBooks();
    },
    filterLanguage(lang) {
      this.langRestrict = lang;
      this.startIndex = 0;
      this.renderBooks();
    },
    changeOrder(order) {
      this.orderBy = order;
      this.startIndex = 0;
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
  border: solid 1px rgb(212, 203, 203);
  border-radius: 8px;
  padding: 0.2rem;
  padding: 0.5rem;
}
</style>
