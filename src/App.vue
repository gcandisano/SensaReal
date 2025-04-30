<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import { computed } from 'vue'

const route = useRoute()
const showHeader = computed(() => route.path !== '/login' && route.path !== '/register' && route.path !== '/verify-email')
</script>

<template>
  <div class="app-container">
    <Header v-if="showHeader" />
    <RouterView />
  </div>
</template>

<style scoped></style>
