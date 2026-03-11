<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { COUPLE } from '~/composables/useData';
import TemplatesElegant from './templates/elegant.vue';

const guestName = ref(COUPLE.guestName);
const theme = useState<string>('theme', () => 'elegant');
const isOpened = useState<boolean>('isOpened', () => false);
const isTransitioning = ref(false);

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

const handleOpen = () => {
  isTransitioning.value = true;
  // Add delay to allow exit animation to complete
  setTimeout(() => {
    isOpened.value = true;
    isTransitioning.value = false;
  }, 800);
};

</script>
<template>
  <main>
    <div :class="[
      'transition-all duration-700 ease-in-out',
      isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'
    ]">
      <Opening :is-opened="isOpened" :groom="COUPLE.groom" :bride="COUPLE.bride" :guest-name="guestName"
         @open="handleOpen"/>
    </div>
    <MusicPlayer />
    <Navbar />
    <Transition name="page-reveal" mode="out-in">
      <component 
        :is="themeComponent" 
        v-if="isOpened"
        :groom="COUPLE.groom" 
        :bride="COUPLE.bride" 
        :date="COUPLE.date"
        :location="COUPLE.location"
        :map-url="COUPLE.mapUrl"
        key="content"
      />
    </Transition>
    <Transition name="fade-up">
      <Footer v-if="isOpened" />
    </Transition>
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

/* Page reveal transition */
.page-reveal-enter-active {
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-reveal-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-reveal-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.98);
}

.page-reveal-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Fade up transition for Footer */
.fade-up-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-up-leave-active {
  transition: all 0.4s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
