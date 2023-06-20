import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import vue from '@astrojs/vue'
import svelte from '@astrojs/svelte'

import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), vue(), svelte()],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
})
