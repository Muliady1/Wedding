<script setup lang="ts">
import { Heart, Sparkles, Gem, Flower2, Star, MapPin, Calendar } from 'lucide-vue-next'
import { Motion, AnimatePresence } from 'motion-v'
import { ref, computed } from 'vue'
import { COUPLE } from '~/composables/useData'

defineProps<{
  isOpened: boolean;
  groom: string;
  bride: string;
  guestName: string;
}>();

const emit = defineEmits(['open', 'toggle-music', 'update:mode'])

// Mode selection
const selectedMode = ref<'romantic' | 'modern' | 'golden'>('romantic')

const getIcon = computed(() => {
  if (selectedMode.value === 'modern') return Sparkles
  if (selectedMode.value === 'golden') return Gem
  return Heart
})

const emitOpen = () => {
  emit('open')
}

const setMode = (mode: 'romantic' | 'modern' | 'golden') => {
  selectedMode.value = mode
  emit('update:mode', mode)
}

// Format date from COUPLE data
const formattedWeddingDate = computed(() => {
  const d = new Date(COUPLE.date)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})


const themeClasses = computed(() => {
  switch (selectedMode.value) {
    case 'romantic':
      return {
        bg: 'from-rose-950 via-purple-950/50 to-rose-900',
        accent: 'text-rose-300',
        accentLight: 'text-rose-200',
        border: 'border-rose-300/30',
        bgButton: 'bg-rose-500/30 hover:bg-rose-500/50 border-rose-300/40',
        gradient: 'from-rose-500/30 via-purple-500/20 to-rose-500/30',
        glow: 'shadow-rose-500/30',
        decor: 'text-rose-300/40'
      }
    case 'modern':
      return {
        bg: 'from-slate-900 via-slate-800 to-slate-900',
        accent: 'text-white',
        accentLight: 'text-white/80',
        border: 'border-white/30',
        bgButton: 'bg-white/20 hover:bg-white/35 border-white/40',
        gradient: 'from-white/10 via-white/5 to-white/10',
        glow: 'shadow-white/20',
        decor: 'text-white/30'
      }
    case 'golden':
      return {
        bg: 'from-amber-950 via-yellow-950/50 to-amber-900',
        accent: 'text-amber-100',
        accentLight: 'text-amber-200',
        border: 'border-amber-300/50',
        bgButton: 'bg-amber-400/40 hover:bg-amber-400/60 border-amber-300/60',
        gradient: 'from-amber-500/20 via-yellow-500/10 to-amber-500/20',
        glow: 'shadow-amber-500/30',
        decor: 'text-amber-300/50'
      }
  }
})
</script>

<template>
  <main class="relative min-h-screen">
    <AnimatePresence>
      <Motion
      v-if="!isOpened"
      key="overlay"
      :initial="{ opacity: 1 }"
      :exit="{ opacity: 0, y: -1000 }"
      :transition="{ duration: 1, ease: 'easeInOut' }"
      class="fixed inset-0 z-50 flex flex-col text-white text-center px-4 overflow-hidden"
    >
        
        <!-- Mode Selector - Improved Design -->
        <div class="absolute top-4 md:top-6 left-0 right-0 z-30 flex justify-center px-2">
          <div class="flex items-center gap-1 px-2 py-2 md:py-2.5 bg-black/30 backdrop-blur-md rounded-full shadow-lg border border-white/10">
            <button @click="setMode('romantic')" :class="[
              'p-2 md:p-2.5 rounded-full transition-all duration-500 ease-out transform hover:scale-110',
              selectedMode === 'romantic' ? 'bg-white/25 shadow-lg' : 'bg-white/5 hover:bg-white/15'
            ]" title="Romantic Mode">
              <Flower2 :size="selectedMode === 'romantic' ? 18 : 16" :class="selectedMode === 'romantic' ? 'text-rose-300 animate-spin-slow' : 'text-white/50'" />
            </button>
            <button @click="setMode('modern')" :class="[
              'p-2 md:p-2.5 rounded-full transition-all duration-500 ease-out transform hover:scale-110',
              selectedMode === 'modern' ? 'bg-white/25 shadow-lg' : 'bg-white/5 hover:bg-white/15'
            ]" title="Modern Mode">
              <Sparkles :size="selectedMode === 'modern' ? 18 : 16" :class="selectedMode === 'modern' ? 'text-white animate-pulse' : 'text-white/50'" />
            </button>
            <button @click="setMode('golden')" :class="[
              'p-2 md:p-2.5 rounded-full transition-all duration-500 ease-out transform hover:scale-110',
              selectedMode === 'golden' ? 'bg-white/25 shadow-lg' : 'bg-white/5 hover:bg-white/15'
            ]" title="Golden Mode">
              <Gem :size="selectedMode === 'golden' ? 18 : 16" :class="selectedMode === 'golden' ? 'text-amber-300 animate-pulse' : 'text-white/50'" />
            </button>
          </div>
        </div>

        <!-- Background Effects -->
        <div class="absolute inset-0 z-0">
          <!-- Romantic Mode -->
          <template v-if="selectedMode === 'romantic'">
            <div class="absolute inset-0 bg-gradient-to-b from-rose-950 via-purple-950/50 to-rose-900"></div>
            <!-- Animated orbs -->
            <div class="absolute top-[5%] left-[5%] w-40 h-40 md:w-80 md:h-80 bg-rose-500/15 rounded-full blur-[80px] animate-pulse"></div>
            <div class="absolute bottom-[10%] right-[5%] w-48 h-48 md:w-[500px] md:h-[500px] bg-purple-500/15 rounded-full blur-[100px] animate-pulse" style="animation-delay: 1.5s;"></div>
            <div class="absolute top-[40%] right-[20%] w-32 h-32 md:w-64 md:h-64 bg-pink-500/10 rounded-full blur-[60px] animate-pulse" style="animation-delay: 0.8s;"></div>
          </template>

          <!-- Modern Mode -->
          <template v-else-if="selectedMode === 'modern'">
            <div class="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80" alt="Couple" class="w-full h-full object-cover brightness-[0.35]" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-slate-800/30"></div>
            <!-- Subtle grid pattern -->
            <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px); background-size: 50px 50px;"></div>
          </template>

          <!-- Golden Mode -->
          <template v-else>
            <div class="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80" alt="Couple" class="w-full h-full object-cover brightness-[0.25]" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-amber-950 via-amber-900/50 to-amber-800/30"></div>
            <!-- Golden orbs -->
            <div class="absolute top-[10%] left-[10%] w-40 h-40 md:w-72 md:h-72 bg-amber-500/20 rounded-full blur-[80px] animate-pulse"></div>
            <div class="absolute bottom-[15%] right-[10%] w-56 h-56 md:w-96 md:h-96 bg-yellow-500/15 rounded-full blur-[100px] animate-pulse" style="animation-delay: 0.7s;"></div>
            <div class="absolute top-[50%] left-[30%] w-24 h-24 md:w-48 md:h-48 bg-amber-400/10 rounded-full blur-[50px] animate-pulse" style="animation-delay: 1.2s;"></div>
            
            <!-- Sparkle particles -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
              <div v-for="i in 40" :key="i" class="absolute animate-ping" :style="{ left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', animationDelay: Math.random() * 3 + 's' }">
                <Star :size="Math.random() * 6 + 4" class="text-amber-200/60" fill="currentColor" />
              </div>
            </div>
            
            <!-- Decorative corners - Golden -->
            <div class="absolute top-6 left-6 w-20 h-20 border-l-2 border-t-2 border-amber-300/40"></div>
            <div class="absolute top-6 right-6 w-20 h-20 border-r-2 border-t-2 border-amber-300/40"></div>
            <div class="absolute bottom-6 left-6 w-20 h-20 border-l-2 border-b-2 border-amber-300/40"></div>
            <div class="absolute bottom-6 right-6 w-20 h-20 border-r-2 border-b-2 border-amber-300/40"></div>
          </template>

          <!-- Floating Hearts for Romantic -->
          <div v-if="selectedMode === 'romantic'" class="absolute inset-0 overflow-hidden pointer-events-none">
            <div v-for="i in 20" :key="i" class="absolute animate-float-heart" :style="{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 6 + 's',
              animationDuration: (Math.random() * 3 + 4) + 's',
              opacity: Math.random() * 0.4 + 0.15
            }">
              <Heart :size="Math.random() * 12 + 10" class="text-rose-300/60" fill="currentColor" />
            </div>
          </div>
        </div>

        <!-- Main Content - Responsive -->
        <div class="flex-1 flex flex-col items-center justify-center min-h-0 py-16 sm:py-20 md:py-24 lg:py-28 px-3 sm:px-4">
          <div class="w-full max-w-lg md:max-w-xl">
            
            <!-- Elegant Icon -->
            <Motion v-if="selectedMode !== 'golden'" :initial="{ scale: 0, opacity: 0, rotate: -180 }"
              :animate="{ scale: 1, opacity: 1, rotate: 0 }" :transition="{ delay: 0.15, duration: 0.8, type: 'spring' }" 
              class="mb-6 md:mb-8">
              <div class="relative inline-block">
                <component :is="getIcon" :class="['mx-auto', themeClasses.accent]" :size="selectedMode === 'modern' ? 56 : 48" :fill="selectedMode !== 'modern' ? 'currentColor' : 'none'" />
                <!-- Subtle glow -->
                <div class="absolute inset-0 rounded-full blur-xl -z-10 bg-white/10" style="transform: scale(1.5);"></div>
              </div>
            </Motion>

            <!-- Subtitle -->
            <Motion :initial="{ opacity: 0, y: 25 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.25, duration: 0.7 }" class="mb-3 md:mb-4">
              <p :class="['text-[11px] md:text-sm tracking-[0.35em] md:tracking-[0.5em] uppercase drop-shadow-xl', themeClasses.accent]">
                Wedding Invitation
              </p>
            </Motion>

            <!-- Couple Names - Golden Mode: Inline -->
            <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.35, duration: 0.7 }" class="mb-4 md:mb-6">
              
              <!-- Golden Mode: Centered inline -->
              <h1 v-if="selectedMode === 'golden'" class="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-relaxed drop-shadow-2xl">
                <span :class="['inline-block', themeClasses.accent, 'font-light']">{{ groom || 'Anindita' }}</span>
                <span class="mx-3 md:mx-4 text-amber-200/80">&</span>
                <span :class="['inline-block', themeClasses.accent, 'font-light']">{{ bride || 'Rizky' }}</span>
              </h1>

              <!-- Modern Mode: Clean stacked -->
              <h1 v-else-if="selectedMode === 'modern'" class="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight drop-shadow-2xl">
                <span class="block font-light tracking-tight">{{ groom || 'Anindita' }}</span>
                <span :class="['inline-block mx-3 md:mx-4 mt-1', themeClasses.accent, 'text-2xl md:text-3xl']">&</span>
                <span class="block font-light tracking-tight">{{ bride || 'Rizky' }}</span>
              </h1>

              <!-- Romantic Mode: Elegant stacked with accent -->
              <h1 v-else class="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-snug drop-shadow-2xl">
                <span :class="['block font-light', themeClasses.accentLight]">{{ groom || 'Anindita' }}</span>
                <div class="flex items-center justify-center my-2 md:my-3">
                  <div class="w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-rose-300/50 to-transparent"></div>
                  <Heart :size="selectedMode === 'romantic' ? 16 : 14" class="mx-3 md:mx-4 text-rose-300/70" fill="currentColor" />
                  <div class="w-12 md:w-16 h-px bg-gradient-to-r from-transparent via-rose-300/50 to-transparent"></div>
                </div>
                <span :class="['block font-light', themeClasses.accentLight]">{{ bride || 'Rizky' }}</span>
              </h1>
            </Motion>

            <!-- Couple Photo - Golden Mode (Circular with elegant frame) -->
            <Motion v-if="selectedMode === 'golden'" :initial="{ scale: 0.7, opacity: 0 }"
              :animate="{ scale: 1, opacity: 1 }" :transition="{ delay: 0.5, duration: 0.9, type: 'spring' }"
              class="mb-5 md:mb-6 relative">
              <div class="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52">
                <!-- Multiple rings for elegant frame -->
                <div class="absolute inset-0 rounded-full border-2 border-amber-300/30"></div>
                <div class="absolute inset-1 rounded-full border border-amber-200/40 shadow-2xl shadow-amber-500/20"></div>
                <div class="absolute inset-2 rounded-full border border-amber-100/20"></div>
                <!-- Photo -->
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80" alt="Couple"
                  class="w-full h-full object-cover rounded-full shadow-2xl" />
                <!-- Shine effect -->
                <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
              </div>
            </Motion>

            <!-- Venue, Date & Time Info - Enhanced Cards for All Modes -->
            <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.55, duration: 0.6 }" class="mb-4 md:mb-6">
              <div class="bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-white/10 shadow-xl">
                <!-- Date Section -->
                <div class="flex items-center justify-center gap-2 mb-2 md:mb-3" :class="themeClasses.accent">
                  <Calendar :size="14" class="opacity-80" />
                  <span class="text-xs md:text-sm font-medium tracking-wider uppercase">{{ formattedWeddingDate }}</span>
                </div>
                
                <!-- Divider -->
                <div class="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <div class="w-6 md:w-12 h-px bg-gradient-to-r from-transparent to-white/30"></div>
                  <Heart :size="10" class="text-rose-300/60" fill="currentColor" />
                  <div class="w-6 md:w-12 h-px bg-gradient-to-l from-transparent to-white/30"></div>
                </div>
                
                <!-- Venue Section -->
                <div class="flex flex-col items-center gap-1">
                  <div class="flex items-center gap-1.5 md:gap-2 text-center" :class="themeClasses.accent">
                    <MapPin :size="14" class="opacity-80 flex-shrink-0" />
                    <span class="text-sm md:text-base font-medium">{{ COUPLE.location || 'Grand Ballroom, Jakarta' }}</span>
                  </div>
                  <p class="text-[9px] md:text-xs text-white/50 mt-0.5 md:mt-1 px-2">
                    {{ COUPLE.location || 'Jl. Sudirman No. 1, Jakarta Pusat' }}
                  </p>
                </div>
                
                <!-- Time Badge -->
                <div class="mt-3 md:mt-4 flex justify-center">
                  <div :class="['inline-flex items-center gap-1.5 md:gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs', themeClasses.bgButton]">
                    <svg class="w-3 h-3 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="font-light">{{ formattedWeddingDate }} WIB</span>
                  </div>
                </div>
              </div>
            </Motion>

            <!-- Guest Name -->
            <Motion v-if="guestName" :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.65, duration: 0.6 }" class="mb-4 md:mb-5 px-2">
              <div class="inline-block w-full px-3 py-2 md:px-6 md:py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <p class="text-[9px] md:text-xs tracking-widest uppercase mb-0.5 md:mb-1 text-white/50 text-center">Kepada</p>
                <p :class="['text-base md:text-xl font-serif italic text-center', selectedMode === 'golden' ? 'text-amber-50' : 'text-white/90']">
                  {{ guestName }}
                </p>
              </div>
            </Motion>

            <!-- Open Button - Elegant Design -->
            <Motion :initial="{ opacity: 0, y: 25 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.8, duration: 0.7, type: 'spring' }">
              <button @click="emitOpen" :class="[
                'group relative px-6 py-3 md:px-12 md:py-4.5 backdrop-blur-md rounded-full text-white font-light tracking-[0.15em] md:tracking-[0.2em] uppercase text-[10px] md:text-xs transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 mx-auto flex items-center justify-center gap-2 md:gap-3 cursor-pointer',
                themeClasses.bgButton,
                themeClasses.glow
              ]" style="min-width: 180px;">
                <!-- Button shine effect -->
                <div class="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <component :is="getIcon" :size="14" class="group-hover:scale-110 group-hover:fill-white transition-all duration-300" />
                <span class="whitespace-nowrap">Buka Undangan</span>
                <!-- Arrow -->
                <svg class="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </Motion>
          </div>
        </div>
      </Motion>
    </AnimatePresence>
  </main>
</template>

<style scoped>

@keyframes float-heart {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) scale(0.5) rotate(20deg);
    opacity: 0;
  }
}

.animate-float-heart {
  animation: float-heart linear infinite;
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

/* Smooth mode transitions */
button, .bg-gradient-to-b, .bg-gradient-to-t {
  transition: all 0.5s ease;
}

/* Enhanced button hover */
button:active {
  transform: scale(0.95);
}
</style>
