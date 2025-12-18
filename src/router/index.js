import { createRouter, createWebHistory } from "vue-router";
import Homepage from "../components/Homepage.vue";
import Tournaments from "../components/pages/Tournaments.vue";
import TournamentDetail from "../components/pages/TournamentDetail.vue";
import MatchDetail from "../components/pages/MatchDetail.vue";
import Registration from "../components/pages/Registration.vue";
import Players from "../components/pages/Players.vue";
import PlayerProfile from "../components/pages/PlayerProfile.vue";
import Fixtures from "../components/pages/Fixtures.vue";
import Contact from "../components/pages/Contact.vue";

const routes = [
  { path: "/", component: Homepage },
  { path: "/registration", component: Registration },
  { path: "/tournaments", component: Tournaments },
  { path: "/tournaments/:slug", component: TournamentDetail },
  { path: "/match/detail/:id", component: MatchDetail },
  { path: "/fixtures", component: Fixtures },
  { path: "/players", component: Players },
  { path: "/players/:slug", component: PlayerProfile},
  { path: "/contact-us", component: Contact},
  { path: "/:pathMatch(.*)*", redirect: "/", },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
