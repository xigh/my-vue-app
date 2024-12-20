import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import TauriInfo from "../views/TauriInfo.vue";
import About from "../views/About.vue";

const isTauri = Boolean(window.__TAURI__)

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/about",
        name: "About",
        component: About,
    },
    // Only add Tauri route if running in Tauri
    ...(isTauri ? [{
        path: "/tauri",
        name: "Tauri",
        component: TauriInfo
    }] : []),
    {
        path: '/document-window',
        component: () => import('../views/DocumentWindow.vue'),
        meta: { standalone: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
