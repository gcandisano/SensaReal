<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>Monitorea en tiempo real la temperatura y humedad con nuestra plataforma.</h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  line-height: 1.2;
}

h3 {
  font-size: 1.2rem;
  color: var(--color-text);
  max-width: 600px;
  line-height: 1.4;
}

.greetings {
  padding-left: 1rem;
}

.greetings h1,
.greetings h3 {
  text-align: left;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
