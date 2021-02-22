<template>
  <article class="book">
    <div
      class="thumbnail"
      v-html="renderThumbnail(imageLinks, link, title)"
    ></div>
    <h2>
      <a target="blank" v-bind:href="link" v-bind:title="title">{{ title }}</a>
    </h2>
    <div class="authors">{{ renderAuthors(authors) }}</div>
    <div class="price">{{ renderPrice(saleInfo) }}</div>
  </article>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    imageLinks: {
      type: Object,
      required: true,
    },
    authors: {
      type: Array,
      required: true,
    },
    saleInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
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
    renderThumbnail(imageLinks, link, title) {
      if (typeof imageLinks != "undefined") {
        return `<a target="blank" href="${link}">
                <img src="${imageLinks.thumbnail}" alt="${title}" />
            </a>`;
      } else {
        return "";
      }
    },
  },
};
</script>

<style>
.book {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0.5rem;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-auto-rows: minmax(auto, 1.8rem) minmax(auto, 1fr) minmax(auto, 1.5rem);
  gap: 0.2rem 0.5rem;
}

.book > .thumbnail {
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
</style>