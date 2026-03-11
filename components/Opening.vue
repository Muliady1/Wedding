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
  <AnimatePresence>
    <div class="absolute inset-0">
      <Nuxtimg src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80" alt="Couple"
        class="w-full h-full object-cover brightness-[0.4]" />
    </div>
    <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/40">

    </div>
  </AnimatePresence>
</template>