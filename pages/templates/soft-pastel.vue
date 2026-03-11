<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Heart, MessageSquare, Clock, MapPin, ChevronDown, Menu, X, Cloud } from 'lucide-vue-next'
import { softPastelData } from '~/composables/useData'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

const props = defineProps<{ groom: string; bride: string; date: string; location: string; mapUrl: string }>()
const stories = softPastelData.stories
const galleryImages = softPastelData.galleryImages
const eventLocations = { akad: { title: 'Akad Nikah', time: '08:00 - 10:00', location: 'Jakarta', address: 'Jakarta', mapUrl: props.mapUrl }, resepsi: { title: 'Resepsi', time: '10:00 - 14:00', location: 'Jakarta', address: 'Jakarta', mapUrl: props.mapUrl } }
const guestName = ref("Tamu Undangan"), showMenu = ref(false), selectedImage = ref(''), showLightbox = ref(false), copiedIndex = ref<number | null>(null), activeTab = ref<'bank' | 'digital'>('bank'), visibleSections = ref<Set<string>>(new Set())

onMounted(() => {
  const params = new URLSearchParams(globalThis.location.search)
  if (params.get('to')) guestName.value = params.get('to')!
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
  const observer = new IntersectionObserver(e => { e.forEach(entry => { if (entry.isIntersecting) visibleSections.value.add(entry.target.id) }) }, { threshold: 0.1 })
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
})

onUnmounted(() => { if (interval) clearInterval(interval) });

const coupleStories = computed(() => stories.map((s, i) => ({ ...s, number: String(i + 1).padStart(2, '0'), isLeft: i % 2 === 0 })))
const images = computed(() => galleryImages.map(i => i.src))
const formattedDate = computed(() => new Date(props.date || '2026-06-15T08:00:00').toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let interval: ReturnType<typeof setInterval> | null = null
const targetDate = computed(() => new Date(props.date || '2026-06-15T08:00:00').getTime())
const updateCountdown = () => {
  const n = Date.now()
  const d = targetDate.value - n
  if (d > 0) {
    timeLeft.value = {
      days: Math.floor(d / 86400000),
      hours: Math.floor((d % 86400000) / 3600000),
      minutes: Math.floor((d % 3600000) / 60000),
      seconds: Math.floor((d % 60000) / 1000)
    }
  } else {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
};
const formatNumber = (n: number) => n.toString().padStart(2, '0')
const openLightbox = (src: string) => { selectedImage.value = src; showLightbox.value = true }
const closeLightbox = () => { showLightbox.value = false }
const scrollToSection = (id: string) => { showMenu.value = false; document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
const isVisible = (id: string) => visibleSections.value.has(id)
</script>

<template>
<div class="min-h-screen bg-[#FFF5F5] text-[#8B7D7B] font-sans">
  <nav class="fixed top-0 left-0 right-0 z-50 bg-[#FFF5F5]/95 backdrop-blur-sm border-b border-[#FFB6C1]/20">
    <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <div class="text-lg font-light tracking-wider flex items-center gap-2"><Cloud class="w-5 h-5 text-[#FFB6C1]" /> {{ props.groom }} & {{ props.bride }}</div>
      <button @click="showMenu = !showMenu" class="p-2"><Menu v-if="!showMenu" class="w-6 h-6" /><X v-else class="w-6 h-6" /></button>
    </div>
    <div v-if="showMenu" class="px-6 pb-4 flex flex-col gap-3">
      <button v-for="s in ['home', 'couple', 'story', 'gallery', 'event', 'gift', 'rsvp']" :key="s" @click="scrollToSection(s)" class="text-left py-2 hover:text-[#FFB6C1] capitalize">{{ s }}</button>
    </div>
  </nav>

  <section id="home" class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-[#FFF5F5] via-[#FFF0F5] to-[#FFE4E1]"></div>
    <div class="relative z-10 text-center px-6">
      <div class="animate-fadeInUp"><p class="text-sm tracking-[0.4em] uppercase text-[#FFB6C1] mb-4">The Wedding Of</p></div>
      <div class="animate-fadeInUp" style="animation-delay: 0.2s;"><h1 class="text-5xl md:text-7xl font-light mb-6">{{ props.groom }} <span class="text-[#FFB6C1]">&</span> {{ props.bride }}</h1></div>
      <div class="animate-fadeInUp" style="animation-delay: 0.4s;"><p class="text-lg text-[#8B7D7B]/70 mb-8">{{ formattedDate }}</p></div>
      <div class="animate-fadeIn" style="animation-delay: 0.6s;"><p class="text-sm text-[#FFB6C1]/50">Kepada Yth.</p><p class="text-xl">{{ guestName }}</p></div>
    </div>
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"><button @click="scrollToSection('couple')" class="p-3 rounded-full border border-[#FFB6C1]/30"><ChevronDown class="w-6 h-6 text-[#FFB6C1]" /></button></div>
  </section>

  <section id="couple" class="py-24 px-6">
    <div class="max-w-4xl mx-auto">
      <div :class="['text-center mb-16 transition-all', isVisible('couple') ? 'opacity-100' : 'opacity-0']"><p class="text-sm tracking-[0.3em] uppercase text-[#FFB6C1] mb-4">Mempelai</p><h2 class="text-4xl font-light">Couple</h2></div>
      <div class="grid md:grid-cols-2 gap-16">
        <div class="text-center">
          <div class="aspect-[3/4] bg-[#FFE4E1] mb-6 rounded-full overflow-hidden"><NuxtImg src="https://picsum.photos/seed/pg/600/800" class="w-full h-full object-cover" /></div>
          <h3 class="text-2xl font-light mb-2">{{ props.groom }}</h3><p class="text-[#8B7D7B]/60">Putra dari Bpk. Heru & Ibu Siti</p>
        </div>
        <div class="text-center">
          <div class="aspect-[3/4] bg-[#FFE4E1] mb-6 rounded-full overflow-hidden"><NuxtImg src="https://picsum.photos/seed/pb/600/800" class="w-full h-full object-cover" /></div>
          <h3 class="text-2xl font-light mb-2">{{ props.bride }}</h3><p class="text-[#8B7D7B]/60">Putri dari Bpk. Ahmad & Ibu Aminah</p>
        </div>
      </div>
    </div>
  </section>

  <section class="py-20 px-6 bg-[#FFB6C1]/20">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-12"><p class="text-sm tracking-[0.3em] uppercase text-[#8B7D7B] mb-4">Hitung Mundur</p><h2 class="text-3xl font-light">Menuju Hari Bahagia</h2></div>
      <div class="grid grid-cols-4 gap-4">
        <div v-for="(v, k) in timeLeft" :key="k" class="text-center p-6 bg-white rounded-full">
          <div class="text-4xl font-light mb-2 text-[#FFB6C1]">{{ formatNumber(v as number) }}</div>
          <div class="text-xs uppercase tracking-widest text-[#8B7D7B]/60">{{ k }}</div>
        </div>
      </div>
    </div>
  </section>

  <section id="story" class="py-24 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16"><p class="text-sm tracking-[0.3em] uppercase text-[#FFB6C1] mb-4">Kisah Cinta</p><h2 class="text-4xl font-light">Our Story</h2></div>
      <div class="relative">
        <div class="absolute left-1/2 -translate-x-1/2 w-px h-full bg-[#FFB6C1]/20"></div>
        <div class="space-y-12">
          <div v-for="(s, i) in coupleStories" :key="i" :class="['flex', s.isLeft ? 'justify-start pr-12' : 'justify-end pl-12']">
            <div class="max-w-sm w-1/2">
              <div class="w-12 h-12 bg-[#FFB6C1] text-white rounded-full flex items-center justify-center font-light mb-4">{{ s.number }}</div>
              <p class="text-sm text-[#FFB6C1] mb-2">{{ s.year }}</p>
              <h3 class="text-xl font-light mb-2">{{ s.title }}</h3>
              <p class="text-[#8B7D7B]/70">{{ s.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="gallery" class="py-24 px-6 bg-[#FFE4E1]/30">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16"><p class="text-sm tracking-[0.3em] uppercase text-[#FFB6C1] mb-4">Kenangan</p><h2 class="text-4xl font-light">Gallery</h2></div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div v-for="(img, i) in images" :key="i" class="aspect-square bg-[#FFE4E1] rounded-full overflow-hidden cursor-pointer group" @click="openLightbox(img)">
          <NuxtImg :src="img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>
    </div>
  </section>

  <section id="event" class="py-24 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16"><p class="text-sm tracking-[0.3em] uppercase text-[#FFB6C1] mb-4">Jadwal</p><h2 class="text-4xl font-light">Wedding Event</h2></div>
      <div class="grid md:grid-cols-2 gap-8">
        <div v-for="(e, k) in eventLocations" :key="k" class="p-8 bg-white/50 rounded-3xl text-center">
          <h3 class="text-xl font-light mb-4">{{ e.title }}</h3>
          <div class="space-y-2 text-[#8B7D7B]/70"><div class="flex items-center justify-center gap-2"><Clock class="w-4 h-4" /><span>{{ e.time }}</span></div><div class="flex items-center justify-center gap-2"><MapPin class="w-4 h-4" /><span>{{ e.location }}</span></div></div>
        </div>
      </div>
    </div>
  </section>

  <section id="rsvp" class="py-24 px-6">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-16"><p class="text-sm tracking-[0.3em] uppercase text-[#FFB6C1] mb-4">Konfirmasi</p><h2 class="text-4xl font-light">RSVP</h2><p class="text-[#8B7D7B]/60 mt-4">Mohon konfirmasi sebelum 1 Juni 2026</p></div>
      <form class="space-y-6">
        <div>
          <label class="block text-sm text-[#FFB6C1] mb-2">Nama Tamu<input type="text" :value="guestName" class="w-full p-4 border border-[#FFB6C1]/30 rounded-full focus:border-[#FFB6C1] outline-none bg-white/50" /></label>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <button type="button" class="p-4 border border-[#FFB6C1]/30 rounded-full hover:bg-[#FFB6C1] hover:text-white transition-colors text-center"><Heart class="w-6 h-6 mx-auto mb-2" /><span class="text-sm">Hadir</span></button>
          <button type="button" class="p-4 border border-[#FFB6C1]/30 rounded-full hover:bg-[#FFB6C1] hover:text-white transition-colors text-center"><MessageSquare class="w-6 h-6 mx-auto mb-2" /><span class="text-sm">Ragu</span></button>
          <button type="button" class="p-4 border border-[#FFB6C1]/30 rounded-full hover:bg-[#FFB6C1] hover:text-white transition-colors text-center"><X class="w-6 h-6 mx-auto mb-2" /><span class="text-sm">Tidak</span></button>
        </div>
        <button type="submit" class="w-full py-4 bg-[#FFB6C1] text-white rounded-full hover:bg-[#FF9EB5] transition-colors font-light tracking-widest">KIRIM</button>
      </form>
    </div>
  </section>

  <footer class="py-12 px-6 bg-[#FFB6C1]/20 text-center"><p class="text-lg font-light tracking-widest mb-2">{{ props.groom }} & {{ props.bride }}</p><p class="text-[#8B7D7B]/60 text-sm">Terima kasih</p></footer>
  <div v-if="showLightbox" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 cursor-zoom-out" @click="closeLightbox"><NuxtImg :src="selectedImage" class="max-w-full max-h-full object-contain" /><button @click="closeLightbox" class="absolute top-6 right-6"><X class="w-8 h-8 text-white" /></button></div>
</div>
</template>

<style scoped>
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bounce { 0%, 100% { transform: translateY(0) translateX(-50%); } 50% { transform: translateY(-10px) translateX(-50%); } }
.animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
.animate-bounce { animation: bounce 2s infinite; }
</style>
