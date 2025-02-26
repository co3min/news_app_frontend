import { createRouter, createWebHistory } from "vue-router";
import NewsList from "../views/NewsList.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: NewsList,
    },
  ],
});

export default router;
