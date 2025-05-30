import { createRouter, createWebHistory } from "vue-router";
import InteractiveView from "../views/Interactive/InteractiveView.vue";
import PresentationView from "../views/Presentation/PresentationView.vue";
import ContactView from "../views/LandingPages/ContactUs/ContactView.vue";
import AuthorView from "../views/LandingPages/Author/AuthorView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "presentation",
      component: PresentationView,
    },
    {
      path: "/contact-us",
      name: "contactus",
      component: ContactView,
    },
    {
      path: "/author",
      name: "author",
      component: AuthorView,
    },
    {
      path: "/interactive",
      name: "interactive",
      component: InteractiveView,
    },
  ],
});

export default router;
