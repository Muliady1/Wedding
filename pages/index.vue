<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { COUPLE } from '~/composables/useData';

const router = useRouter()
const guestName = ref(COUPLE.guestName);
const isOpened = ref(false);

onMounted(() => {
  const params = new URLSearchParams(globalThis.location.search);
  const to = params.get('to');
  if (to) guestName.value = to;
});

const emitOpen = () => {
  isOpened.value = true;
  // Navigate to elegant template with animation
  setTimeout(() => {
    router.push('/templates/elegant');
  }, 600);
}
</script>
<template>
  <main>
    <Opening 
      :is-opened="isOpened" 
      :groom="COUPLE.groom" 
      :bride="COUPLE.bride" 
      :guest-name="guestName"
      @open="emitOpen" />
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
