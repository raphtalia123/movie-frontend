<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <!-- 电影背景模糊效果 -->
        <div v-if="movie" class="absolute top-0 left-0 w-full h-96 overflow-hidden">
            <div class="relative w-full h-full">
                <el-image :src="getProxyImageUrl(movie.image_large)"
                    class="w-full h-full object-cover scale-110 blur-xl opacity-30" fit="cover" />
                <div class="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900"></div>
            </div>
        </div>

        <div v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)" class="relative z-10">
            <div v-if="movie" class="container mx-auto px-4 py-8">
                <!-- 主要内容卡片 -->
                <div class="movie-detail-container">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <!-- 电影海报区域 -->
                        <div class="lg:col-span-1">
                            <div class="poster-container">
                                <el-image :src="getProxyImageUrl(movie.image_large)" :alt="movie.title"
                                    class="w-full rounded-2xl shadow-2xl poster-image" fit="cover">
                                    <template #error>
                                        <div
                                            class="w-full h-96 flex items-center justify-center bg-gray-700 rounded-2xl">
                                            <el-icon size="80" color="#9CA3AF">
                                                <Picture />
                                            </el-icon>
                                        </div>
                                    </template>
                                </el-image>
                            </div>
                        </div>

                        <!-- 电影信息区域 -->
                        <div class="lg:col-span-2 space-y-8">
                            <!-- 标题和评分 -->
                            <div class="title-section">
                                <h1 class="movie-title">{{ movie.title }}</h1>
                                <h2 v-show="movie.original_title && movie.original_title !== movie.title"
                                    class="text-2xl text-gray-300 mb-3 font-light">
                                    {{ movie.original_title }}
                                </h2>
                                <div v-show="movie.aka" class="text-lg text-gray-400 mb-6">
                                    又名: {{ movie.aka?.replace(/\|/g, ' / ') }}
                                </div>

                                <!-- 评分区域 -->
                                <div class="rating-section">
                                    <div class="flex items-center space-x-6">
                                        <div class="rating-display">
                                            <span class="rating-score">{{ formatRating(movie.rating_score) }}</span>
                                            <span class="rating-label">评分</span>
                                        </div>
                                        <el-rate :model-value="movie.rating_score / 2" disabled
                                            :colors="['#ffd04b', '#ffd04b', '#ffd04b']" size="large" />
                                    </div>
                                </div>
                            </div>

                            <!-- 基本信息网格 -->
                            <div class="info-grid">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="space-y-4">
                                        <div v-if="movie.year" class="info-item">
                                            <span class="info-label">上映年份:</span>
                                            <span class="info-value">{{ movie.year }}年</span>
                                        </div>
                                        <div v-if="movie.countries" class="info-item">
                                            <span class="info-label">国家:</span>
                                            <span class="info-value">{{ movie.countries?.replace(/\|/g, ' / ') || '未知'
                                                }}</span>
                                        </div>
                                        <div v-if="movie.languages" class="info-item">
                                            <span class="info-label">语言:</span>
                                            <span class="info-value">{{ movie.languages?.replace(/\|/g, ' / ') }}</span>
                                        </div>
                                        <div v-if="movie.durations" class="info-item">
                                            <span class="info-label">片长:</span>
                                            <span class="info-value">{{ movie.durations }}</span>
                                        </div>
                                    </div>
                                    <div class="space-y-4">
                                        <div v-if="movie.directors" class="info-item">
                                            <span class="info-label">导演:</span>
                                            <span class="info-value">{{ movie.directors?.replace(/\|/g, ' / ') }}</span>
                                        </div>
                                        <div v-if="movie.genres" class="info-item">
                                            <span class="info-label">类型:</span>
                                            <div class="mt-2 flex flex-wrap gap-2">
                                                <el-tag v-for="genre in movie.genres?.split('|') || []" :key="genre"
                                                    class="genre-tag">
                                                    {{ genre }}
                                                </el-tag>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 主演 -->
                            <div v-show="movie.actors" class="actors-section">
                                <h3 class="section-title">主要演员</h3>
                                <div class="flex flex-wrap gap-3">
                                    <el-tag v-for="actor in movie.actors?.split('|').slice(0, 10) || []" :key="actor"
                                        size="large" class="actor-tag">
                                        {{ actor }}
                                    </el-tag>
                                </div>
                            </div>

                            <!-- 标签 -->
                            <div v-show="movie.tags" class="tags-section">
                                <h3 class="section-title">标签</h3>
                                <div class="flex flex-wrap gap-3">
                                    <el-tag v-for="tag in movie.tags?.split('|').slice(0, 8) || []" :key="tag"
                                        class="movie-tag">
                                        {{ tag }}
                                    </el-tag>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 剧情简介 -->
                    <div v-show="movie.summary" class="summary-section">
                        <h3 class="section-title">剧情简介</h3>
                        <div class="summary-content">
                            <p class="summary-text">{{ movie.summary }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 返回按钮 -->
        <el-affix :offset="20">
            <el-button type="primary" :icon="ArrowLeft" @click="$router.go(-1)" class="return-button">
                返回
            </el-button>
        </el-affix>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Picture, ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { movieApi } from '@/api/movieApi'
import type { Movie } from '@/types/movie'

// 添加图片代理URL函数
const getProxyImageUrl = (imageUrl: string) => {
    if (!imageUrl) return '/placeholder-movie.jpg'
    if (imageUrl.includes('doubanio.com')) {
        return `http://localhost:5000/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    }
    return imageUrl
}

const route = useRoute()
const movie = ref<Movie | null>(null)
const loading = ref(true)

const formatRating = (rating: number) => {
    return rating.toFixed(1)
}

const loadMovieDetail = async () => {
    try {
        loading.value = true
        const movieId = Number(route.params.id)
        const response = await movieApi.getMovieDetail(movieId)

        if (response.success) {
            movie.value = response.data
        } else {
            ElMessage.error('电影不存在')
        }
    } catch (error) {
        console.error('加载电影详情失败:', error)
        ElMessage.error('加载电影详情失败')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadMovieDetail()
})
</script>

<style scoped>
.container {
    max-width: 1400px;
}

/* 主要内容容器 */
.movie-detail-container {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 2rem;
    padding: 3rem;
    margin-top: 2rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

/* 海报样式 */
.poster-container {
    position: relative;
}

.poster-image {
    aspect-ratio: 2/3;
    transition: transform 0.3s ease;
}

.poster-container:hover .poster-image {
    transform: scale(1.02);
}

/* 标题区域 */
.movie-title {
    font-size: 4rem;
    font-weight: bold;
    color: white;
    margin-bottom: 1rem;
    background: linear-gradient(45deg, #ffffff, #e5e7eb);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.1;
}

/* 评分显示 */
.rating-section {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    backdrop-filter: blur(10px);
}

.rating-display {
    text-align: center;
}

.rating-score {
    display: block;
    font-size: 3rem;
    font-weight: bold;
    color: #ffd04b;
    line-height: 1;
}

.rating-label {
    display: block;
    font-size: 0.875rem;
    color: #9CA3AF;
    margin-top: 0.25rem;
}

/* 信息网格 */
.info-grid {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.info-label {
    font-weight: 600;
    color: #9CA3AF;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.info-value {
    color: white;
    font-size: 1.125rem;
    font-weight: 500;
}

/* 区域标题 */
.section-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgba(59, 130, 246, 0.5);
    display: inline-block;
}

/* 演员和标签区域 */
.actors-section,
.tags-section {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 标签样式 */
.genre-tag {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 0.5rem;
    font-weight: 500;
}

.actor-tag {
    background: rgba(16, 185, 129, 0.2);
    color: #6ee7b7;
    border: 1px solid rgba(16, 185, 129, 0.3);
    border-radius: 0.5rem;
    font-weight: 500;
}

.movie-tag {
    background: rgba(245, 158, 11, 0.2);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.3);
    border-radius: 0.5rem;
    font-weight: 500;
}

/* 剧情简介 */
.summary-section {
    margin-top: 3rem;
    padding-top: 3rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-content {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-text {
    color: #e5e7eb;
    line-height: 1.8;
    font-size: 1.125rem;
    text-align: justify;
}

/* 返回按钮 */
.return-button {
    background: rgba(59, 130, 246, 0.9);
    border: none;
    backdrop-filter: blur(10px);
    border-radius: 2rem;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
}

.return-button:hover {
    background: rgba(59, 130, 246, 1);
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
}

/* 评分组件样式覆盖 */
:deep(.el-rate__icon) {
    font-size: 1.5rem;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .movie-detail-container {
        padding: 2rem;
        margin-top: 1rem;
    }

    .movie-title {
        font-size: 2.5rem;
    }
}

@media (max-width: 768px) {
    .movie-detail-container {
        padding: 1.5rem;
        border-radius: 1rem;
    }

    .movie-title {
        font-size: 2rem;
    }

    .rating-score {
        font-size: 2rem;
    }

    .info-grid,
    .actors-section,
    .tags-section,
    .summary-content {
        padding: 1.5rem;
    }
}
</style>