<template>
  <form
    class="filter-controls"
    :style="{ display: areFiltersVisible === true ? '' : 'none' }"
  >
    <label for="select-price">Price</label>
    <select id="select-price" @change="selectPrice" v-model="selectedPrice">
      <option value="ebooks">Any</option>
      <option value="free-ebooks">Free</option>
      <option value="paid-ebooks">Paid</option>
    </select>
    <label for="select-lang">Language</label>
    <select
      id="select-lang"
      @change="selectLanguage"
      v-model="selectedLanguage"
    >
      <option value="">Any</option>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="it">Italiano</option>
      <option value="ro">Română</option>
      <option value="ru">Русский</option>
    </select>
    <label for="select-sorting">Sort by</label>
    <select id="select-sorting" @change="selectOrder" v-model="orderBy">
      <option value="relevance">relevance</option>
      <option value="newest">newest</option>
    </select>
  </form>
</template>

<script>
export default {
  data() {
    return {
      selectedPrice: "ebooks",
      selectedLanguage: "",
      orderBy: "relevance",
    };
  },
  props: {
    areFiltersVisible: {
      type: Boolean,
      required: true,
    },
  },
  emits: {
    "on-price-select": function (price) {
      if (
        price === "ebooks" ||
        price === "free-ebooks" ||
        price === "paid-ebooks"
      ) {
        return true;
      } else {
        console.warn("Invalid price selected");
        return false;
      }
    },
    "on-lang-select": function (lang) {
      if (lang === "" || lang.length === 2) {
        return true;
      } else {
        console.warn("Invalid language selected");
        return false;
      }
    },
    "on-order-select": function (order) {
      if (order === "relevance" || order === "newest") {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    selectPrice() {
      this.$emit("on-price-select", this.selectedPrice);
    },
    selectLanguage() {
      this.$emit("on-lang-select", this.selectedLanguage);
    },
    selectOrder() {
      this.$emit("on-order-select", this.orderBy);
    },
  },
};
</script>

<style scoped>
.filter-controls {
  margin: 1rem 30%;
  justify-content: center;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.2 rem;
}

.filter-controls > label {
  color: gray;
  text-align: right;
  width: 7rem;
  margin-right: 0.3rem;
  padding: 0.3rem;
}

.filter-controls > select {
  height: 2rem;
  width: 7rem;
  border: solid 1px rgb(212, 203, 203);
  border-radius: 8px;
  padding: 0.2rem;
  font: inherit;
}

@media (max-width: 40rem) {
  .filter-controls {
    margin: 1rem 20%;
    grid-template-columns: repeat(2, 1fr);
  }
  .filter-controls > label {
    width: auto;
  }
  .filter-controls > select {
    text-align: left;
  }
}
</style>