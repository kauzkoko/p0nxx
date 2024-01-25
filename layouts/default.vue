<template>
  <div class="font-sans">
    <slot />
    <NuxtLink
      class="fixed left-10px bottom-10px w-20px h-20px bg-yellow rounded-full"
      to="/"
    ></NuxtLink>
  </div>
</template>
