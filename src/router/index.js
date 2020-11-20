import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/map/:map/:region?/:location?',
      name: 'Map',
      component: () => import(/* webpackChunkName: "Map" */ '@/components/layouts/map/MapPage'),
    },
  ],
});
