<script setup lang="ts">
import { Heart, Sparkles, Gem } from 'lucide-vue-next'
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
const isPlaying = ref(false)

// Icon based on mode
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

// Theme classes based on mode
const themeClasses = computed(() => {
  switch (selectedMode.value) {
    case 'romantic':
      return {
        bg: 'from-rose-950 via-purple-950/50 to-rose-900',
        accent: 'text-rose-300',
        border: 'border-rose-300/30',
        bgButton: 'bg-rose-500/30 hover:bg-rose-500/40 border-rose-300/40',
        textShadow: 'drop-shadow-lg'
      }
    case 'modern':
      return {
        bg: 'from-slate-900 via-slate-800 to-slate-900',
        accent: 'text-white',
        border: 'border-white/30',
        bgButton: 'bg-white/20 hover:bg-white/30 border-white/40',
        textShadow: 'drop-shadow-lg'
      }
    case 'golden':
      return {
        bg: 'from-amber-950 via-yellow-950/50 to-amber-900',
        accent: 'text-amber-100',
        border: 'border-amber-300/50',
        bgButton: 'bg-amber-400/40 hover:bg-amber-400/60 border-amber-300/60'
      }
  }
})
</script>
<template>
  <main>
    <AnimatePresence>
      <Motion v-if="!isOpened" key="overlay" :initial="{ opacity: 1 }" :exit="{ opacity: 0, y: -1000 }"
        :transition="{ duration: 1, ease: 'easeInOut' }"
        class="fixed inset-0 z-50 flex flex-col text-white text-center px-4 overflow-hidden">
        <!-- Mode Selector -->
        <div class="absolute top-4 left-0 right-0 z-20 flex justify-center gap-2">
          <button @click="setMode('romantic')" :class="[
            'p-2 rounded-full transition-all duration-300',
            selectedMode === 'romantic' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
          ]" title="Romantic Mode">
            <Heart :size="18" :class="selectedMode === 'romantic' ? 'text-rose-300' : 'text-white/50'" />
          </button>
          <button @click="setMode('modern')" :class="[
            'p-2 rounded-full transition-all duration-300',
            selectedMode === 'modern' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
          ]" title="Modern Mode">
            <Sparkles :size="18" :class="selectedMode === 'modern' ? 'text-white' : 'text-white/50'" />
          </button>
          <button @click="setMode('golden')" :class="[
            'p-2 rounded-full transition-all duration-300',
            selectedMode === 'golden' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
          ]" title="Golden Mode">
            <Gem :size="18" :class="selectedMode === 'golden' ? 'text-amber-300' : 'text-white/50'" />
          </button>
        </div>
        <div class="absolute inset-0 z-0">
          <!-- Romantic Mode -->
          <template v-if="selectedMode === 'romantic'">
            <div class="absolute inset-0 bg-gradient-to-b from-rose-950 via-purple-950/50 to-rose-900"></div>
            <div
              class="absolute top-[10%] left-[10%] w-32 h-32 md:w-64 md:h-64 bg-rose-500/20 rounded-full blur-3xl animate-pulse">
            </div>
            <div
              class="absolute bottom-[10%] right-[10%] w-40 h-40 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
              style="animation-delay: 1s;"></div>
          </template>
          <template v-else-if="selectedMode === 'modern'">
            <!-- Couple Photo Background -->
            <div class="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80" alt="Couple"
                class="w-full h-full object-cover brightness-[0.4]" />
            </div>
            <!-- Overlay gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/40"></div>
          </template>

          <!-- Golden Mode - WITH COUPLE PHOTO -->
          <template v-else>
            <!-- Couple Photo Background -->
            <div class="absolute inset-0">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80" alt="Couple"
                class="w-full h-full object-cover brightness-[0.3]" />
            </div>
            <!-- Golden gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-amber-950 via-amber-900/60 to-amber-800/40"></div>
            <!-- Golden blur orbs for glow effect -->
            <div
              class="absolute top-[15%] left-[15%] w-40 h-40 md:w-72 md:h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse">
            </div>
            <div
              class="absolute bottom-[15%] right-[15%] w-48 h-48 md:w-96 md:h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"
              style="animation-delay: 0.5s;"></div>
            <!-- Sparkle particles for golden -->
            <div class="absolute inset-0 overflow-hidden pointer-events-none">
              <div v-for="i in 30" :key="i" class="absolute animate-ping"
                :style="{ left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', animationDelay: Math.random() * 2 + 's' }">
                <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor" class="text-amber-200 opacity-70">
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </div>
            </div>
            <!-- Golden decorative corners -->
            <div class="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-amber-300/30"></div>
            <div class="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-amber-300/30"></div>
            <div class="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-amber-300/30"></div>
            <div class="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-amber-300/30"></div>
          </template>

          <!-- Floating Hearts for Romantic -->
          <div v-if="selectedMode === 'romantic'" class="absolute inset-0 overflow-hidden pointer-events-none">
            <div v-for="i in 15" :key="i" class="absolute animate-float-heart" :style="{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              opacity: Math.random() * 0.5 + 0.2
            }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="text-rose-300">
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Main Content - Centered -->
        <div class="flex-1 flex flex-col items-center justify-center min-h-0 py-4 md:py-8 px-2">
          <div class="w-full max-w-lg">
            <!-- Heart Icon (Hidden in Golden Mode) -->
            <Motion v-if="selectedMode !== 'golden'" :initial="{ scale: 0, opacity: 0 }"
              :animate="{ scale: 1, opacity: 1 }" :transition="{ delay: 0.2, duration: 0.6 }" class="mb-4 md:mb-6">
              <component :is="getIcon" :class="['mx-auto', themeClasses.accent]" :size="48"
                :fill="selectedMode !== 'modern' ? 'currentColor' : 'none'" />
            </Motion>

            <!-- Title -->
            <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.3, duration: 0.6 }" class="mb-2 md:mb-3">
              <p
                :class="['text-xs md:text-sm tracking-[0.3em] md:tracking-[0.4em] uppercase drop-shadow-lg', themeClasses.accent]">
                Wedding Invitation
              </p>
            </Motion>

            <!-- Couple Names - Different layout for golden mode -->
            <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.4, duration: 0.6 }" class="mb-2 md:mb-3">
              <!-- Golden Mode: One line -->
              <h1 v-if="selectedMode === 'golden'"
                :class="['font-serif text-2xl sm:text-3xl md:text-4xl leading-tight drop-shadow-lg']">
                <span :class="['inline-block', themeClasses.accent]">Anindita</span>
                <span class="mx-2 md:mx-3 text-amber-100">&</span>
                <span :class="['inline-block', themeClasses.accent]">Rizky</span>
              </h1>
              <!-- Modern & Romantic Mode: Two lines -->
              <h1 v-else class="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-lg">
                <span class="block font-light">Anindita</span>
                <span :class="['inline-block mx-2 md:mx-3', themeClasses.accent]">&</span>
                <span class="block font-light">Rizky</span>
              </h1>
            </Motion>

            <!-- Couple Photo - Golden Mode (After Names) -->
            <Motion v-if="selectedMode === 'golden'" :initial="{ scale: 0.8, opacity: 0 }"
              :animate="{ scale: 1, opacity: 1 }" :transition="{ delay: 0.5, duration: 0.8 }"
              class="mb-3 md:mb-4 relative">
              <div class="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                <!-- Golden frame -->
                <div class="absolute inset-0 rounded-full border-3 border-amber-300/40 shadow-xl shadow-amber-500/20">
                </div>
                <div class="absolute inset-1 rounded-full border border-amber-200/30"></div>
                <!-- Photo -->
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80" alt="Couple"
                  class="w-full h-full object-cover rounded-full" />
              </div>
            </Motion>

            <!-- Decorative Line (Hidden in Golden Mode) -->
            <Motion v-if="selectedMode !== 'golden'" :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.5, duration: 0.6 }" class="my-3 md:my-4">
              <div class="flex items-center justify-center gap-2 md:gap-4">
                <div class="w-10 md:w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                <div :class="['w-1.5 h-1.5 rotate-45', themeClasses.accent.replace('text-', 'bg-')]"></div>
                <div class="w-10 md:w-16 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
              </div>
            </Motion>

            <!-- Guest Name -->
            <Motion v-if="guestName" :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.6, duration: 0.6 }" class="mb-3 md:mb-4">
              <p :class="['text-[10px] md:text-xs tracking-widest uppercase mb-1 text-white/60 drop-shadow-sm']">Kepada
                Bapak/Ibu/Saudara/i</p>
              <p
                :class="['text-base md:text-lg font-serif italic drop-shadow-md', selectedMode === 'golden' ? 'text-amber-100' : '']">
                {{ guestName }}</p>
            </Motion>

            <!-- Date -->
            <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.7, duration: 0.6 }" class="mb-4 md:mb-6">
              <p :class="['text-sm md:text-base font-serif tracking-widest drop-shadow-md', themeClasses.accent]">{{
                formattedWeddingDate }}</p>
            </Motion>

            <!-- Open Button - Responsive -->
            <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.8, duration: 0.6 }">
              <button @click="emitOpen" :class="[
                'group relative px-6 py-3 sm:px-8 sm:py-3 md:px-10 md:py-4 backdrop-blur-md rounded-full text-white font-light tracking-widest uppercase text-xs sm:text-sm transition-all duration-300 hover:scale-105 mx-auto flex items-center justify-center gap-2',
                themeClasses.bgButton
              ]" style="max-width: 280px;">
                <component :is="getIcon" :size="16" class="group-hover:fill-white transition-colors" />
                <span class="whitespace-nowrap">Buka Undangan</span>
              </button>
            </Motion>
          </div>
        </div>

        <!-- Bottom Controls -->
        <div class="absolute bottom-4 left-0 right-0 flex justify-center items-end px-6">
          <!-- Swipe Up - Center -->
          <div class="flex flex-col items-center gap-1 text-white/50">
            <span class="text-[10px] tracking-widest">Swipe Up</span>
            <div class="w-px h-6 bg-gradient-to-b from-white/50 to-transparent animate-bounce"></div>
          </div>
        </div>
      </Motion>
    </AnimatePresence>
  </main>
</template>