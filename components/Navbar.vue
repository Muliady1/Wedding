<script setup lang="ts">
import { Home, Heart, Image, MapPin, MessageSquare, Gift } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

const isOpened = useState('isOpened');
const activeSection = ref('hero');

const navItems = [
  { id: 'hero', icon: Home, label: 'Home' },
  { id: 'story', icon: Heart, label: 'Cerita' },
  { id: 'gallery', icon: Image, label: 'Galeri' },
  { id: 'location', icon: MapPin, label: 'Lokasi' },
  { id: 'gift', icon: Gift, label: 'Hadiah' },
  { id: 'wishes', icon: MessageSquare, label: 'Ucapan' },
];

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

// Track active section on scroll
const handleScroll = () => {
  const sections = navItems.map(item => item.id);
  const scrollPosition = window.scrollY + 200;
  
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const offsetTop = rect.top + window.scrollY;
      if (scrollPosition >= offsetTop) {
        activeSection.value = id;
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <nav 
    class="fixed bottom-0 left-0 right-0 z-50 transition-all duration-500"
    :class="isOpened ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'"
  >
    <div class="flex justify-center px-2 pb-3 pt-2">
      <div class="flex items-center gap-1 px-3 py-2 bg-black/70 backdrop-blur-lg rounded-full shadow-lg">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="scrollToSection(item.id)"
          class="flex items-center justify-center p-2.5 rounded-full transition-all duration-300"
          :class="activeSection === item.id ? 'text-amber-400 bg-amber-400/20 scale-110' : 'text-white/70 hover:text-white hover:bg-white/10'"
          :aria-label="'Navigate to ' + item.label"
          :aria-current="activeSection === item.id ? 'page' : undefined"
        >
          <component :is="item.icon" :size="22" />
        </button>
      </div>
    </div>
  </nav>
</template>
