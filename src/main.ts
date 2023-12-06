// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import vuetify from "./plugins/vuetify";

const app = createApp(App);
app.use(vuetify);
app.mount("#app");
