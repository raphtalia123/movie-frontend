import axios from 'axios'
import type { Movie, ApiResponse } from '@/types/movie'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
})

export const movieApi = {
  // 搜索电影
  searchMovies: async (query: string, topK: number = 20): Promise<ApiResponse<Movie[]>> => {
    const response = await api.post('/search', { query, top_k: topK })
    return response.data
  },

  // 获取所有电影
  getMovies: async (
    page: number = 1,
    pageSize: number = 20,
    sortBy: string = 'rating_score',
    order: string = 'desc'
  ): Promise<ApiResponse<Movie[]>> => {
    const response = await api.get('/movies', {
      params: { page, page_size: pageSize, sort_by: sortBy, order }
    })
    return response.data
  },

  // 获取随机推荐
  getRandomMovies: async (count: number = 12): Promise<ApiResponse<Movie[]>> => {
    const response = await api.get('/movies/random', { params: { count } })
    return response.data
  },

  // 获取电影详情
  getMovieDetail: async (movieId: number): Promise<ApiResponse<Movie>> => {
    const response = await api.get(`/movies/${movieId}`)
    return response.data
  },
}