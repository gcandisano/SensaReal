<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCloudSunRain } from '@fortawesome/free-solid-svg-icons'
import { computed } from 'vue'

library.add(faCloudSunRain)

const route = useRoute()
const showHeader = computed(() => route.path == '/login')
</script>

<template>
  <div class="app-container">
    <header v-if="showHeader">
      <font-awesome-icon :icon="['fad', 'cloud-sun-rain']" size="10x" class="weather-icon" />
      <div class="wrapper">
        <HelloWorld msg="Bienvenido a Sensareal!" />
      </div>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
}

header {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
  margin-left: 100px;
}

.weather-icon {
  color: #4a90e2;
  font-size: 8rem;
}

.wrapper {
  flex: 1;
}
</style>
