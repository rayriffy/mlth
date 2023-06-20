<script setup lang="ts">
/**
 * This component demos that Astro can accepts components
 * from multiple frameworks at the same time
 * https://docs.astro.build/en/guides/integrations-guide/vue/
 */

interface Props {
  name: string
  icon: string
}
const props = defineProps<Props>()
</script>

<template>
  <img
    :src="props.icon"
    :alt="props.name"
    class="object-cover object-left max-h-24 aspect-square max-w-[75px] shrink-0"
    width="96"
    height="96"
    loading="lazy"
  />
  <h1 class="text-2xl fond-medium">{{ props.name }}</h1>
</template>
