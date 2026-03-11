<script setup lang="ts">
import { ref, computed } from 'vue';
import { Heart, Sparkles, Flower2, Gem, Mountain, TreePine, Palmtree, Crown, Flame, Star, ChevronDown } from 'lucide-vue-next';

const theme = useState<string>('theme');
const isOpened = useState<boolean>('isOpened');
const isOpen = ref(false);

const themes = [
  { id: 'classic', label: 'Classic', icon: Heart, color: '#d4af37' },
  { id: 'elegant', label: 'Elegant', icon: Sparkles, color: '#6b7280' },
  { id: 'soft-pastel', label: 'Soft Pastel', icon: Flower2, color: '#FFB6C1' },
  { id: 'modern-geometric', label: 'Modern Geometric', icon: Gem, color: '#3b82f6' },
  { id: 'modern-minimalist', label: 'Modern Minimalist', icon: Mountain, color: '#64748b' },
  { id: 'romantic-garden', label: 'Romantic Garden', icon: Flower2, color: '#10b981' },
  { id: 'tropical-paradise', label: 'Tropical Paradise', icon: Palmtree, color: '#14b8a6' },
  { id: 'vintage-bohemian', label: 'Vintage Bohemian', icon: Star, color: '#f59e0b' },
  { id: 'rustic-chic', label: 'Rustic Chic', icon: TreePine, color: '#92400e' },
  { id: 'luxe-gold', label: 'Luxe Gold', icon: Crown, color: '#fbbf24' },
  { id: 'fairy-tale', label: 'Fairy Tale', icon: Sparkles, color: '#a855f7' },
  { id: 'dark-romance', label: 'Dark Romance', icon: Flame, color: '#dc2626' },
];

const currentTheme = computed(() => themes.find(t => t.id === theme.value) || themes[1]);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectTheme = (themeId: string) => {
  theme.value = themeId;
  isOpen.value = false;
};
</script>

<template>
  <div v-if="isOpened" class="fixed top-6 right-6 z-[90]">
    <div class="relative">
      <!-- Trigger Button -->
      <button
        @click="toggleDropdown"
        class="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all"
        :class="isOpen ? 'ring-2 ring-primary/50' : ''"
      >
        <component :is="currentTheme.icon" :size="18" :style="{ color: currentTheme.color }" />
        <span class="text-sm font-medium text-slate-700">{{ currentTheme.label }}</span>
        <ChevronDown 
          :size="16" 
          class="text-slate-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>

      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div 
          v-if="isOpen" 
          class="absolute top-full mt-2 right-0 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 p-2"
        >
          <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-3 py-2">Pilih Tema</p>
          <div class="grid grid-cols-2 gap-1">
            <button
              v-for="t in themes"
              :key="t.id"
              @click="selectTheme(t.id)"
              class="flex flex-col items-center gap-1 p-3 rounded-xl transition-all"
              :class="theme === t.id ? 'bg-slate-100' : 'hover:bg-slate-50'"
            >
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="theme === t.id ? 'bg-slate-800 text-white' : 'bg-slate-100'"
                :style="{ backgroundColor: theme === t.id ? '' : t.color + '20' }"
              >
                <component :is="t.icon" :size="16" :style="{ color: theme === t.id ? 'white' : t.color }" />
              </div>
              <span 
                class="text-[10px] text-center"
                :class="theme === t.id ? 'text-slate-800 font-medium' : 'text-slate-500'"
              >
                {{ t.label }}
              </span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
