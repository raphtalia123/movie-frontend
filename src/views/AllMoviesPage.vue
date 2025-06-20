<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <!-- 页面头部区域 -->
        <div class="relative bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm">
            <div class="absolute inset-0 bg-black/20"></div>
            <div class="container mx-auto px-4 py-12 relative z-10">
                <div class="text-center mb-8">
                    <h1 class="text-5xl md:text-6xl font-bold text-white mb-4 hero-title">
                        🎥 全部电影
                    </h1>
                    <p class="text-xl text-gray-300">探索我们的完整电影收藏</p>
                </div>

                <!-- 控制面板 -->
                <div class="flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
                    <!-- 统计信息 -->
                    <div class="text-white">
                        <span class="text-2xl font-bold text-blue-400">{{ pagination.total }}</span>
                        <span class="text-gray-300 ml-2">部精彩电影等你发现</span>
                    </div>

                    <!-- 排序控制器 -->
                    <div class="flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-xl px-6 py-3">
                        <span class="text-white font-medium">排序:</span>
                        <el-select v-model="sortBy" @change="loadMovies" class="sort-select" style="width: 140px">
                            <el-option label="评分高到低" value="rating_score" />
                            <el-option label="年份新到旧" value="year" />
                            <el-option label="标题A-Z" value="title" />
                        </el-select>
                        <el-select v-model="order" @change="loadMovies" class="sort-select" style="width: 100px">
                            <el-option label="降序" value="desc" />
                            <el-option label="升序" value="asc" />
                        </el-select>
                    </div>
                </div>
            </div>
        </div>

        <!-- 电影列表区域 -->
        <div class="py-16">
            <div class="container mx-auto px-4">
                <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)" class="min-h-96">
                    <!-- 电影网格 -->
                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 mb-8">
                        <div v-for="movie in movies" :key="movie.movie_id" class="movie-item"
                            @click="handleMovieClick(movie)">
                            <MovieCard :movie="movie" />
                        </div>
                    </div>

                    <!-- 空状态 -->
                    <div v-if="!movies.length && !loading" class="text-center py-20">
                        <div class="text-6xl mb-4">🎬</div>
                        <h3 class="text-2xl font-bold text-white mb-2">暂无电影数据</h3>
                        <p class="text-gray-400">请稍后再试或调整筛选条件</p>
                    </div>
                </div>

                <!-- 分页组件 -->
                <div v-if="pagination.total > 0" class="flex justify-center mt-12">
                    <div class="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                            :page-sizes="[12, 24, 36, 48]" :total="pagination.total"
                            layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                            @current-change="handleCurrentChange" class="custom-pagination" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import MovieCard from '@/components/MovieCard.vue'
import { movieApi } from '@/api/movieApi'
import type { Movie } from '@/types/movie'

const router = useRouter()
const movies = ref<Movie[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(24)
const sortBy = ref('rating_score')
const order = ref('desc')
const pagination = ref({
    total: 0,
    total_pages: 0
})

const loadMovies = async () => {
    try {
        loading.value = true
        const response = await movieApi.getMovies(
            currentPage.value,
            pageSize.value,
            sortBy.value,
            order.value
        )
        if (response.success) {
            movies.value = response.data
            if (response.pagination) {
                pagination.value = response.pagination
            }
        }
    } catch (error) {
        console.error('加载电影列表失败:', error)
        ElMessage.error('加载电影列表失败')
    } finally {
        loading.value = false
    }
}

const handleSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
    loadMovies()
}

const handleCurrentChange = (page: number) => {
    currentPage.value = page
    loadMovies()
    // 平滑滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleMovieClick = (movie: Movie) => {
    router.push(`/movie/${movie.movie_id}`)
}

onMounted(() => {
    loadMovies()
})
</script>

<style scoped>
/* 标题动画效果 */
.hero-title {
    background: linear-gradient(45deg, #ffffff, #e5e7eb, #ffffff);
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: titleShine 3s ease-in-out infinite;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

@keyframes titleShine {

    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}

/* 电影项目动画 */
.movie-item {
    cursor: pointer;
    transform: translateY(0);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.movie-item:hover {
    transform: translateY(-10px);
}

/* 排序选择器样式 */
:deep(.sort-select .el-input__wrapper) {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    color: white;
}

:deep(.sort-select .el-input__inner) {
    color: white;
}

:deep(.sort-select .el-input__wrapper:hover) {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(59, 130, 246, 0.5);
}

:deep(.sort-select .el-input__wrapper.is-focus) {
    background: rgba(255, 255, 255, 0.2);
    border-color: #3b82f6;
}

/* 分页器样式 */
:deep(.custom-pagination) {
    --el-pagination-bg-color: transparent;
    --el-pagination-text-color: white;
    --el-pagination-border-radius: 8px;
    --el-pagination-button-bg-color: rgba(255, 255, 255, 0.1);
    --el-pagination-button-color: white;
    --el-pagination-item-bg-color: rgba(255, 255, 255, 0.1);
    --el-pagination-hover-color: #3b82f6;
}

:deep(.custom-pagination .el-pagination__total) {
    color: white;
    font-weight: 500;
}

:deep(.custom-pagination .el-pagination__sizes .el-select .el-input__wrapper) {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
}

:deep(.custom-pagination .el-pagination__jump) {
    color: white;
}

:deep(.custom-pagination .el-pagination__jump .el-input__wrapper) {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(.custom-pagination .el-pagination__jump .el-input__inner) {
    color: white;
    text-align: center;
}

:deep(.custom-pagination .el-pager .number) {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    margin: 0 4px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

:deep(.custom-pagination .el-pager .number:hover) {
    background: rgba(59, 130, 246, 0.3);
    border-color: #3b82f6;
}

:deep(.custom-pagination .el-pager .number.is-active) {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
}

:deep(.custom-pagination .btn-prev),
:deep(.custom-pagination .btn-next) {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 8px;
    transition: all 0.3s ease;
}

:deep(.custom-pagination .btn-prev:hover),
:deep(.custom-pagination .btn-next:hover) {
    background: rgba(59, 130, 246, 0.3);
    border-color: #3b82f6;
}

/* 加载动画优化 */
:deep(.el-loading-mask) {
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
}

:deep(.el-loading-spinner .circular) {
    width: 50px;
    height: 50px;
}

/* 容器设置 */
.container {
    max-width: 1400px;
}

/* 响应式优化 */
@media (max-width: 768px) {
    .hero-title {
        font-size: 3rem;
    }

    .grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 2.5rem;
    }
}
</style>