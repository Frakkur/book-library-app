import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index.js';

const app = createApp(App);

app.use(createPinia()); // Pinia debe ir antes que el router
app.use(router);
app.mount('#app');