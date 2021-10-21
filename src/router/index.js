import { createRouter, createWebHistory } from 'vue-router';
import RegisterUser from '../views/RegisterUser';
import MainBalance from '../views/MainBalance';
import LoginUser from '../views/LoginUser';

const routes = [
  {
    path: '/',
    name: 'MainBalance',
    component: MainBalance,
  },
  {
    path: '/register',
    name: 'RegisterUser',
    component: RegisterUser,
  },
  {
    path: '/login',
    name: 'LoginUser',
    component: LoginUser,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
