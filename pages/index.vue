<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { COUPLE } from '~/composables/useData';


const guestName = ref(COUPLE.guestName);
const theme = useState<string>('theme', () => 'classic');
const isOpened = useState<boolean>('isOpened', () => false);
onMounted(() => {
  const params = new URLSearchParams(globalThis.location.search);
  const to = params.get('to');
  if (to) guestName.value = to;
});
</script>
<template>
  <main>
    <Opening :is-opened="isOpened" :groom="COUPLE.groom"  :bride="COUPLE.bride"  :guest-name="guestName"
      @open="isOpened = true" />

      <Navbar v-if="isOpened" />
      <MusicPlayer v-if="isOpened" />

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
