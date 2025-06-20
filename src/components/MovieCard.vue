<template>
    <div class="movie-card-wrapper cursor-pointer" @click="$emit('click', movie)" @mouseenter="isHovered = true"
        @mouseleave="isHovered = false">

        <div class="movie-card">
            <!-- 海报容器 -->
            <div class="poster-container">
                <el-image :src="getImageUrl(movie.image_large)" :alt="movie.title" class="poster-image" fit="cover"
                    :preview-disabled="true" :lazy="false" @error="handleImageError" @load="handleImageLoad">

                    <template #error>
                        <div class="image-error">
                            <el-icon size="60" color="#6B7280">
                                <Picture />
                            </el-icon>
                            <span class="error-text">暂无海报</span>
                        </div>
                    </template>

                    <template #placeholder>
                        <div class="image-loading">
                            <el-icon size="30" color="#9CA3AF" class="loading-icon">
                                <Loading />
                            </el-icon>
                            <span class="loading-text">加载中...</span>
                        </div>
                    </template>
                </el-image>

                <!-- 评分角标 -->
                <div class="rating-badge">
                    <el-icon size="14" class="star-icon">
                        <StarFilled />
                    </el-icon>
                    <span>{{ formatRating(movie.rating_score) }}</span>
                </div>

                <!-- 悬停遮罩 -->
                <div class="hover-overlay" :class="{ 'show': isHovered }">
                    <div class="overlay-content">
                        <h3 class="movie-title">{{ movie.title }}</h3>
                        <p class="movie-year">{{ movie.year }}年</p>
                        <div class="movie-info">
                            <span v-if="firstActor" class="actor-info">{{ firstActor }}</span>
                            <span class="country-info">{{ formatCountries(movie.countries) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 信息区域 -->
            <div class="card-content">
                <h3 class="title" :title="movie.title">
                    {{ movie.title }}
                </h3>

                <div class="meta-info">
                    <span class="year">{{ movie.year }}年</span>
                    <span class="separator">•</span>
                    <span class="country">{{ formatCountries(movie.countries) }}</span>
                </div>

                <!-- 主演信息 -->
                <div v-if="firstActor" class="actor-line">
                    <span class="label">主演:</span>
                    <span class="actor">{{ firstActor }}</span>
                </div>

                <!-- 类型标签 -->
                <div class="genres">
                    <el-tag v-for="(genre, index) in genres.slice(0, 3)" :key="index" class="genre-tag" size="small">
                        {{ genre }}
                    </el-tag>
                </div>

                <!-- 评分区域 -->
                <div class="rating-section">
                    <el-rate :model-value="movie.rating_score / 2" disabled size="small"
                        :colors="['#ffd04b', '#ffd04b', '#ffd04b']" />
                    <span class="rating-score">{{ formatRating(movie.rating_score) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Picture, Loading, StarFilled } from '@element-plus/icons-vue'
import type { Movie } from '@/types/movie'

interface Props {
    movie: Movie
}

const props = defineProps<Props>()
const emit = defineEmits<{
    click: [movie: Movie]
}>()

const isHovered = ref(false)
const imageLoaded = ref(false)
const imageError = ref(false)

const firstActor = computed(() => {
    return props.movie.actors?.split('|')[0] || ''
})

const genres = computed(() => {
    return props.movie.genres?.split('|').filter(Boolean) || []
})

const formatCountries = (countries: string) => {
    return countries?.replace(/\|/g, '/') || '未知'
}

const formatRating = (rating: number) => {
    return rating.toFixed(1)
}

const getImageUrl = (imageUrl: string) => {
    if (!imageUrl || imageUrl.trim() === '') {
        return '/placeholder-movie.jpg'
    }
    if (imageUrl.includes('doubanio.com')) {
        return `http://localhost:5000/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    }
    return imageUrl
}

const handleImageLoad = () => {
    imageLoaded.value = true
    imageError.value = false
}

const handleImageError = (error: Event) => {
    imageError.value = true
    imageLoaded.value = false
}
</script>

<style scoped>
.movie-card-wrapper {
    height: 100%;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.movie-card-wrapper:hover {
    transform: translateY(-8px);
}

.movie-card {
    height: 100%;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
}

.movie-card:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* 海报容器 */
.poster-container {
    position: relative;
    aspect-ratio: 2/3;
    overflow: hidden;
}

.poster-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.movie-card:hover .poster-image {
    transform: scale(1.05);
}

/* 评分角标 */
.rating-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    color: #ffd04b;
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.star-icon {
    color: #ffd04b;
}

/* 悬停遮罩 */
.hover-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top,
            rgba(0, 0, 0, 0.9) 0%,
            rgba(0, 0, 0, 0.6) 50%,
            transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: flex-end;
    padding: 1.5rem;
}

.hover-overlay.show {
    opacity: 1;
}

.overlay-content {
    width: 100%;
}

.movie-title {
    color: white;
    font-size: 1.125rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.movie-year {
    color: #e5e7eb;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
}

.movie-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.75rem;
    color: #d1d5db;
}

/* 错误和加载状态 */
.image-error,
.image-loading {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(55, 65, 81, 0.8);
    color: #9CA3AF;
}

.error-text,
.loading-text {
    font-size: 0.875rem;
    margin-top: 0.5rem;
}

.loading-icon {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* 卡片内容区域 */
.card-content {
    padding: 1.5rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.title {
    color: white;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.meta-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #9CA3AF;
    font-size: 0.875rem;
}

.separator {
    opacity: 0.5;
}

.actor-line {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
}

.label {
    color: #9CA3AF;
    font-weight: 500;
}

.actor {
    color: #e5e7eb;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 类型标签 */
.genres {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.genre-tag {
    background: rgba(59, 130, 246, 0.2);
    color: #93c5fd;
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
}

/* 评分区域 */
.rating-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
}

.rating-score {
    color: #ffd04b;
    font-size: 1rem;
    font-weight: bold;
}

/* 评分组件样式覆盖 */
:deep(.el-rate__icon) {
    margin-right: 2px;
}

:deep(.el-rate__icon .el-icon) {
    font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .card-content {
        padding: 1rem;
        gap: 0.5rem;
    }

    .title {
        font-size: 1rem;
    }

    .meta-info,
    .actor-line {
        font-size: 0.75rem;
    }

    .rating-badge {
        padding: 0.375rem 0.5rem;
        font-size: 0.75rem;
    }
}
</style>