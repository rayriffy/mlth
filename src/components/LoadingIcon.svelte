<script lang="ts">
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  export let icon: string

  let jumping = false

  const jumpHeight = tweened(0, {
    duration: 100,
    easing: cubicOut,
  })

  const jump = () => {
    jumping = true
    jumpHeight.set(-20)
    setTimeout(() => {
      jumpHeight.set(0)
      jumping = false
    }, 100)
  }

  $: console.log(jumpHeight)
</script>

<div class="relative aspect-square">
  <button on:click={jump} disabled={jumping} class="absolute aspect-square" style={`top:${$jumpHeight}px;`}>
    <img
      src={icon}
      alt="loading icon"
      width="200"
      height="200"
    /></button>
</div>
