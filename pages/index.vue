<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { COUPLE } from '~/composables/useData';
import TemplatesElegant from './templates/elegant.vue';

const guestName = ref(COUPLE.guestName);
const theme = useState<string>('theme', () => 'elegant');
const isOpened = useState<boolean>('isOpened', () => false);

onMounted(() => {
  const params = new URLSearchParams(globalThis.location.search);
  const to = params.get('to');
  if (to) guestName.value = to;
});

const themeComponent = computed(() => {
  const themes: Record<string, any> = {
    elegant: TemplatesElegant,
   };
  return themes[theme.value] || TemplatesElegant;
});

</script>
<template>
  <main>
    <Opening :is-opened="isOpened" :groom="COUPLE.groom" :bride="COUPLE.bride" :guest-name="guestName"
       @open="isOpened = true"/>
       <MusicPlayer />
    <Navbar />
        <component 
      :is="themeComponent" 
      v-if="isOpened"
      :groom="COUPLE.groom" 
      :bride="COUPLE.bride" 
      :date="COUPLE.date"
      :location="COUPLE.location"
      :map-url="COUPLE.mapUrl"
    />
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
