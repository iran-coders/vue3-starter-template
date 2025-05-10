import { createRouter, createWebHistory } from "vue-router";

import AuthenticateRoute from "./middleware/AuthenticateRoute";
import AuthorizeRoute from "./middleware/AuthorizeRoute";
import RedirectIfAuthenticated from "./middleware/RedirectIfAuthenticated";

import PanelView from "@/views/PanelView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Panel",
            component: PanelView,
            beforeEnter: [AuthenticateRoute],
            children: [
                {
                    path: "dashboard",
                    name: "Dashboard",
                    component: () => import("@/views/DashboardView.vue"),
                    beforeEnter: [AuthorizeRoute],
                    meta: {
                        permissions: ["dashboard"],
                    },
                },
                {
                    path: "users",
                    name: "Users",
                    component: () => import("@/views/UsersView.vue"),
                },
                {
                    path: "todos",
                    name: "Todos",
                    component: () => import("@/views/TodosView.vue"),
                },
                {
                    path:'comments',
                    name:"Comments",
                    component: () => import('@/views/CommentsView.vue'),
                },

            ],
        },
        {
            path: "/login",
            name: "Login",
            // route level code-splitting
            // this generates a separate chunk (Login.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("@/views/LoginView.vue"),
            beforeEnter: [RedirectIfAuthenticated],
        },
    ],
});

export default router;
