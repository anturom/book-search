import { createApp } from 'vue';

import App from './App.vue';
import BookInfo from './components/BookInfo.vue';
import SearchFilters from './components/SearchFilters.vue';

const app = createApp(App);
app.component('book-info', BookInfo);
app.component('search-filters', SearchFilters);

app.mount('#app');