import { createRouter, createWebHistory } from "vue-router";
import Homepage from "../components/Homepage.vue";
import Tournaments from "../components/pages/Tournaments.vue";
import TournamentDetail from "../components/pages/TournamentDetail.vue";
import MatchDetail from "../components/pages/MatchDetail.vue";
import Registration from "../components/pages/Registration.vue";
import Players from "../components/pages/Players.vue";
import PlayerProfile from "../components/pages/PlayerProfile.vue";
import PlayerLogin from "../components/pages/PlayerLogin.vue";
import PlayerDashboard from "../components/pages/PlayerDashboard.vue";
import Fixtures from "../components/pages/Fixtures.vue";
import Contact from "../components/pages/Contact.vue";
import RegistrationConfirmation from "../components/pages/RegistrationConfirmation.vue";
import { isPlayerAuthenticated } from "../components/api/playerAuth";

const routes = [
  { path: "/", component: Homepage },
  { path: "/registration", component: Registration },
  { path: "/tournaments", component: Tournaments },
  { path: "/tournaments/:slug", component: TournamentDetail },
  { path: "/match/detail/:id", component: MatchDetail },
  { path: "/fixtures", component: Fixtures },
  { path: "/players", component: Players },
  { path: "/players/:slug", component: PlayerProfile},
  { path: "/player-login", component: PlayerLogin },
  { path: "/login", component: PlayerLogin, beforeEnter: (to) => to.query.type === 'player' ? true : '/player-login' },
  { path: "/player-dashboard", component: PlayerDashboard, meta: { requiresPlayerAuth: true, tab: 'summary' } },
  { path: "/player-profile", component: PlayerDashboard, meta: { requiresPlayerAuth: true, tab: 'profile' } },
  { path: "/player-stats-summary", component: PlayerDashboard, meta: { requiresPlayerAuth: true, tab: 'summary' } },
  { path: "/player-stats-matches", component: PlayerDashboard, meta: { requiresPlayerAuth: true, tab: 'matches' } },
  { path: "/player-stats-tournaments", component: PlayerDashboard, meta: { requiresPlayerAuth: true, tab: 'tournaments' } },
  { path: "/contact-us", component: Contact},
  { path: "/registration-confirmation/:reg_uid", component: RegistrationConfirmation, props: true },
  { path: "/:pathMatch(.*)*", redirect: "/", },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to) => {
  if (to.meta.requiresPlayerAuth && !isPlayerAuthenticated()) {
    return { path: '/player-login', query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
