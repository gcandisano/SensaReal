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
