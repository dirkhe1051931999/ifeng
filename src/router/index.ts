import Router from 'vue-router';
import { constantRoutes } from './routes';
import Vue from 'vue';

Vue.use(Router);
const createRouter = () =>
  new Router({
    mode: 'hash',
    base: process.env.NODE_ENV === 'production' ? '/ifeng-app' : '/',
    routes: constantRoutes,
  });

const router = createRouter();
router.beforeEach((to: any, from, next) => {
  next(to.meta.default);
});

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher; // reset router
}

export default router;