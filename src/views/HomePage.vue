<template>
    <div class="min-h-screen">
        <!-- 全屏动态视频背景区域 - 增强沉浸感 -->
        <div class="video-background">
            <video v-if="currentVideoUrl" autoplay muted loop class="video-element" @error="handleVideoError">
                <source :src="currentVideoUrl" type="video/mp4" />
            </video>
            <div class="video-overlay"></div>
        </div>

        <!-- 主搜索区域 -->
        <div class="hero-section">
            <div class="text-center text-white space-y-8 px-4 max-w-5xl z-10">
                <!-- 标题区域 - 添加动画效果 -->
                <div class="hero-title-container">
                    <h1 class="text-6xl md:text-7xl font-bold mb-6 hero-title">
                        🎬 智能电影推荐系统
                    </h1>
                    <p class="text-2xl md:text-3xl mb-12 text-gray-200 hero-subtitle">发现你的下一部最爱电影</p>
                </div>

                <!-- 搜索框 - 修复样式 -->
                <div class="search-container">
                    <div class="search-wrapper">
                        <el-input v-model="searchQuery" placeholder="输入电影名称、导演、演员或类型..." size="large"
                            class="search-input" @keyup.enter="handleSearch" :disabled="searchLoading">
                        </el-input>
                        <el-button class="search-button" :icon="Search" @click="handleSearch" :loading="searchLoading"
                            type="primary">
                            搜索
                        </el-button>
                    </div>
                </div>

                <!-- 快速标签 -->
                <div class="flex flex-wrap justify-center gap-3 mt-8">
                    <el-tag v-for="tag in quickTags" :key="tag" class="quick-tag cursor-pointer"
                        @click="quickSearch(tag)">
                        {{ tag }}
                    </el-tag>
                </div>
            </div>
        </div>

        <!-- 向下滚动提示 -->
        <div class="scroll-hint">
            <div class="scroll-indicator">
                <p class="text-sm mb-2 opacity-80">向下滚动查看更多</p>
                <div class="scroll-arrow animate-bounce">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16L8 12H16L12 16Z" fill="currentColor" />
                        <path d="M12 12L8 8H16L12 12Z" fill="currentColor" opacity="0.5" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- 轮播推荐区域 - 优化布局 -->
        <div v-if="!searchResults.length && randomMovies.length"
            class="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl font-bold text-center mb-12 text-white">
                    🔥 热门推荐
                    <span class="block text-lg text-gray-400 mt-2">精选优质电影为你推荐</span>
                </h2>
                <el-carousel :interval="6000" arrow="hover" indicator-position="outside"
                    class="recommendation-carousel">
                    <el-carousel-item v-for="(chunk, index) in movieChunks" :key="index">
                        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 px-4">
                            <div v-for="movie in chunk" :key="movie.movie_id" class="movie-card-hover cursor-pointer"
                                @click="handleMovieClick(movie)">
                                <div class="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                                    <el-image :src="getProxyImageUrl(movie.image_large)" :alt="movie.title"
                                        class="w-full h-full object-cover transition-all duration-500" fit="cover">
                                        <template #error>
                                            <div class="w-full h-full flex items-center justify-center bg-gray-700">
                                                <el-icon size="40" color="#9CA3AF">
                                                    <Picture />
                                                </el-icon>
                                            </div>
                                        </template>
                                    </el-image>
                                </div>
                                <div class="movie-card-overlay">
                                    <h3 class="movie-card-title">{{ movie.title }}</h3>
                                    <div class="flex items-center justify-between text-sm">
                                        <span class="text-gray-200">{{ movie.year }}年</span>
                                        <div class="rating-badge">
                                            <el-icon size="14" class="mr-1 text-yellow-400">
                                                <StarFilled />
                                            </el-icon>
                                            <span class="text-white font-medium">{{ formatRating(movie.rating_score)
                                            }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>

        <!-- 搜索结果或随机推荐区域 - 优化背景 -->
        <div class="py-16 bg-gradient-to-b from-gray-800 to-gray-900">
            <div class="container mx-auto px-4">
                <h2 class="text-4xl font-bold mb-12 text-white text-center">
                    {{ searchResults.length ? '🎯 搜索结果' : '🎲 为你推荐' }}
                    <span v-if="searchResults.length" class="block text-lg text-gray-400 mt-2">
                        找到 {{ searchResults.length }} 部电影
                    </span>
                </h2>
                <div v-loading="initialLoading" class="min-h-32">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        <MovieCard v-for="movie in displayMovies" :key="movie.movie_id" :movie="movie"
                            @click="handleMovieClick" />
                    </div>
                    <el-empty v-if="!displayMovies.length && !initialLoading" description="暂无电影数据"
                        class="text-gray-400" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElLoading } from 'element-plus'
import MovieCard from '@/components/MovieCard.vue'
import { movieApi } from '@/api/movieApi'
import type { Movie } from '@/types/movie'
import { Picture, StarFilled } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')
const searchResults = ref<Movie[]>([])
const randomMovies = ref<Movie[]>([])
const searchLoading = ref(false)
const initialLoading = ref(true)

const videoUrls = [
    '/background-video1.mp4',
    '/background-video2.mp4',
    '/background-video3.mp4',
    '/background-video4.mp4',
]

const currentVideoUrl = ref('')

// 快速搜索标签
const quickTags = ref(['科幻', '动作', '爱情', '喜剧', '悬疑', '动画'])

// 检查电影是否有有效封面
const hasValidCover = (movie: Movie) => {
    return movie.image_large &&
        movie.image_large.trim() !== '' &&
        !movie.image_large.includes('placeholder') &&
        !movie.image_large.includes('default')
}

// 过滤有封面的电影
const moviesWithCovers = computed(() => {
    return randomMovies.value.filter(movie => hasValidCover(movie))
})

// 计算属性
const displayMovies = computed(() => {
    const movies = searchResults.value.length ? searchResults.value : randomMovies.value
    // 如果是搜索结果，显示所有结果；如果是推荐，只显示有封面的
    return searchResults.value.length ? movies : movies.filter(movie => hasValidCover(movie))
})

const movieChunks = computed(() => {
    const chunkSize = 6
    const chunks = []
    const validMovies = moviesWithCovers.value

    for (let i = 0; i < validMovies.length; i += chunkSize) {
        chunks.push(validMovies.slice(i, i + chunkSize))
    }
    return chunks
})

// 其余函数保持不变...
const getProxyImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '/placeholder-movie.jpg'
    if (imageUrl.includes('doubanio.com')) {
        return `http://localhost:5000/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    }
    return imageUrl
}

const formatRating = (rating: number) => {
    return rating.toFixed(1)
}

// 方法
const loadRandomMovies = async () => {
    try {
        initialLoading.value = true
        // 增加加载数量，确保过滤后仍有足够的电影展示
        const response = await movieApi.getRandomMovies(36)
        if (response.success) {
            randomMovies.value = response.data
        }
    } catch (error) {
        console.error('加载推荐电影失败:', error)
        ElMessage.error('加载推荐电影失败')
    } finally {
        initialLoading.value = false
    }
}

// 其余方法保持不变...
const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
        ElMessage.warning('请输入搜索内容')
        return
    }

    const loadingInstance = ElLoading.service({
        lock: true,
        text: '搜索中，请耐心等待...',
        background: 'rgba(0, 0, 0, 0.7)',
    })

    try {
        searchLoading.value = true
        const response = await movieApi.searchMovies(searchQuery.value)

        if (response.success) {
            searchResults.value = response.data
            if (response.data.length === 0) {
                ElMessage.info('未找到相关电影，试试其他关键词吧')
            } else {
                ElMessage.success(`搜索成功！找到 ${response.data.length} 部相关电影`)
            }
        } else {
            ElMessage.error('搜索失败，请稍后重试')
        }
    } catch (error) {
        console.error('搜索失败:', error)
        ElMessage.error('搜索失败，请稍后重试')
    } finally {
        searchLoading.value = false
        loadingInstance.close()
    }
}

const quickSearch = (tag: string) => {
    searchQuery.value = tag
    handleSearch()
}

const handleMovieClick = (movie: Movie) => {
    router.push(`/movie/${movie.movie_id}`)
}

const handleVideoError = () => {
    console.warn('视频加载失败，尝试加载下一个视频')
}

// 生命周期
onMounted(() => {
    loadRandomMovies()
    if (videoUrls.length > 0) {
        const randomIndex = Math.floor(Math.random() * videoUrls.length)
        currentVideoUrl.value = videoUrls[randomIndex]
    }
})
</script>

<style scoped>
/* 视频背景固定 */
.video-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
}

.video-element {
    position: absolute;
    top: 50%;
    left: 50%;
    min-width: 100%;
    min-height: 100%;
    width: auto;
    height: auto;
    transform: translate(-50%, -50%) scale(1.1);
    filter: brightness(0.7) contrast(1.1);
    object-fit: cover;
}

.video-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.7) 100%);
}

/* 主搜索区域 */
.hero-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

/* 滚动提示 */
.scroll-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 1;
    color: white;
}

/* 标题动画 */
.hero-title {
    background: linear-gradient(45deg, #ffffff, #e5e7eb, #ffffff);
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: titleShine 3s ease-in-out infinite;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.hero-subtitle {
    animation: fadeInUp 1s ease-out 0.5s both;
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

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 搜索框优化 - 修复间隙问题 */
.search-container {
    max-width: 700px;
    margin: 0 auto;
}

.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 3rem;
    padding: 0.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
}

.search-wrapper:hover {
    background: rgba(255, 255, 255, 0.98);
    border-color: rgba(59, 130, 246, 0.5);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.search-wrapper:focus-within {
    background: rgba(255, 255, 255, 1);
    border-color: #3b82f6;
}

.search-input {
    flex: 1;
}

:deep(.search-input .el-input__wrapper) {
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0.5rem 1rem;
}

:deep(.search-input .el-input__inner) {
    font-size: 1rem;
    color: #374151;
}

:deep(.search-input .el-input__inner::placeholder) {
    color: #9ca3af;
}

.search-button {
    margin-left: 0.5rem;
    border-radius: 2rem;
    padding: 0.75rem 2rem;
    font-weight: 600;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border: none;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
}

.search-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* 快速标签 */
.quick-tag {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    color: white;
    transition: all 0.3s ease;
}

.quick-tag:hover {
    background: rgba(59, 130, 246, 0.6);
    border-color: #3b82f6;
    transform: translateY(-2px);
}

/* 滚动指示器 */
.scroll-indicator {
    animation: fadeIn 2s ease-out 1s both;
}

.scroll-arrow {
    opacity: 0.7;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* 电影卡片悬停效果 */
.movie-card-hover {
    position: relative;
    transform: translateY(0);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.movie-card-hover:hover {
    transform: translateY(-10px) scale(1.05);
}

.movie-card-hover:hover .el-image {
    filter: brightness(0.6);
}

.movie-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1rem;
    border-radius: 0.75rem;
}

.movie-card-hover:hover .movie-card-overlay {
    opacity: 1;
}

.movie-card-title {
    color: white;
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    line-height: 1.2;
}

.rating-badge {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    backdrop-filter: blur(10px);
}

/* 轮播图优化 */
.recommendation-carousel {
    padding: 0 2rem;
}

:deep(.recommendation-carousel .el-carousel__indicator) {
    background: rgba(255, 255, 255, 0.3);
}

:deep(.recommendation-carousel .el-carousel__indicator.is-active) {
    background: #3b82f6;
}

/* 容器 */
.container {
    max-width: 1400px;
}

/* 响应式优化 */
@media (max-width: 768px) {
    .hero-title {
        font-size: 3rem;
    }

    .hero-subtitle {
        font-size: 1.25rem;
    }

    .search-container {
        max-width: 90%;
    }

    .search-wrapper {
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
        border-radius: 1.5rem;
    }

    .search-button {
        margin-left: 0;
        width: 100%;
        justify-content: center;
    }

    .quick-tag {
        font-size: 0.875rem;
    }
}
</style>