import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import AllMoviesPage from '@/views/AllMoviesPage.vue'
import MovieDetailPage from '@/views/MovieDetailPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/movies',
      name: 'all-movies',
      component: AllMoviesPage
    },
    {
      path: '/movie/:id',
      name: 'movie-detail',
      component: MovieDetailPage
    }
  ]
})

export default router