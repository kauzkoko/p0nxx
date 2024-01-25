<template>
  <div bg-white>
    <div v-for="route in routes">
      <a class="text-20px" :href="route.path" v-if="route.name !== 'index'">
        <span
          :class="route.name.split('-')[0] === 'finals' ? 'bg-yellow' : ''"
          >{{
            route.name.split("-")[0] +
            "/" +
            route.name.split("-")[1] +
            "/" +
            (route.name.split("-")[2] ? route.name.split("-")[2] : "")
          }}</span
        ></a
      >
    </div>
  </div>
</template>

<script setup>
const routes = useRouter().getRoutes();
</script>
