<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import HelloWorld from './components/HelloWorld.vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCloudSunRain, faUser, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons'
import { computed } from 'vue'

library.add(faCloudSunRain, faUser, faSignOutAlt, faCog)

const route = useRoute()
const showHeader = computed(() => route.path !== '/login' && route.path !== '/register')
</script>

<template>
  <div class="app-container">
    <TheHeader v-if="showHeader" />

    <div v-if="!showHeader" class="login-page">
      <div class="left-section">
        <div class="welcome-content">
          <font-awesome-icon :icon="faCloudSunRain" size="8x" class="weather-icon" />
          <HelloWorld msg="Bienvenido a Sensareal!" />
        </div>
      </div>
      <div class="right-section">
        <RouterView />
      </div>
    </div>

    <main v-else :class="{ 'with-header': showHeader }">
      <RouterView />
    </main>
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
}

.with-header {
  padding-top: 60px;
}

.login-page {
  display: flex;
  min-height: 100vh;
}

.left-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 100px;
}

.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.weather-icon {
  color: #4a90e2;
}
</style>
