<template>
  <div>broadcast</div>
</template>

<script setup>
const { data, post } = useBroadcastChannel({ name: "strudelpong" });
watch(data, () => {
  console.log(data.value);
});
onMounted(() => {
  post("vom 1");
});
</script>
