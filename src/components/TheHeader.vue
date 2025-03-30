<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="brand">
      <h1>SensaReal</h1>
    </RouterLink>

    <RouterLink to="/config" class="profile-icon">
      <FontAwesomeIcon :icon="faUser" />
    </RouterLink>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--color-background-soft);
  display: flex;
  align-items: center;
  padding: 0 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.brand {
  text-decoration: none;
}

.brand h1 {
  color: var(--color-heading);
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
}

.profile-icon {
  color: var(--color-heading);
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.profile-icon:hover {
  color: var(--color-text);
}
</style>
