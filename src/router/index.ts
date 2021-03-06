import Router, { RouteConfig } from 'vue-router';
import { constantRoutes } from './routes';
import Vue from 'vue';
Vue.use(Router);
const createRouter = () =>
  new Router({
    mode: 'history',
    base: '/',
    routes: constantRoutes,
  });

const router = createRouter();
router.beforeEach((to, from, next) => {
  next(to.meta.default);
});
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher; // reset router
}

export default router;
