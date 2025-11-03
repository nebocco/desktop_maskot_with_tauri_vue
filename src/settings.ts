import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import SettingsWindow from "./SettingsWindow.vue";

const app = createApp(SettingsWindow);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.mount("#app");
