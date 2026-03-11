<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Heart, MessageSquare, Clock, MapPin, ChevronDown, Menu, X, Hexagon } from 'lucide-vue-next'
import { modernGeometricData } from '~/composables/useData'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

const props = defineProps<{ groom: string; bride: string; date: string; location: string; mapUrl: string }>()

const stories = modernGeometricData.stories
const galleryImages = modernGeometricData.galleryImages
const accounts = modernGeometricData.accounts
const qrCodes = modernGeometricData.qrCodes
const eventLocations = modernGeometricData.eventLocations

const guestName = ref("Tamu Undangan"), showMenu = ref(false), selectedImage = ref(''), showLightbox = ref(false), copiedIndex = ref<number | null>(null), copiedQrIndex = ref<number | null>(null), activeTab = ref<'bank' | 'digital'>('bank'), visibleSections = ref<Set<string>>(new Set())

onMounted(() => {
  const params = new URLSearchParams(globalThis.location.search)
  if (params.get('to')) guestName.value = params.get('to')!
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
  const observer = new IntersectionObserver(e => { e.forEach(entry => { if (entry.isIntersecting) { visibleSections.value.add(entry.target.id); visibleSections.value = new Set(visibleSections.value) }}) }, { threshold: 0.1 })
  document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
})

onUnmounted(() => { if (interval) clearInterval(interval) })

const coupleStories = computed(() => stories.map((s, i) => ({ ...s, number: String(i + 1).padStart(2, '0'), isLeft: i % 2 === 0 })));
const images = computed(() => galleryImages.map(i => i.src));
const formattedDate = computed(() => new Date(props.date || '2026-06-15T08:00:00').toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))

const addToCalendar = () => { const d = new Date(props.date), s = d.toISOString().replaceAll(/[-:]/g, '').replaceAll(/\.\d+/g, ''), e = new Date(d.getTime() + 7200000).toISOString().replaceAll(/[-:]/g, '').replaceAll(/\.\d+/g, ''); const title = 'Pernikahan ' + props.groom + ' & ' + props.bride; window.open('https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) + '&dates=' + s + '/' + e + '&details=Undangan+Pernikahan', '_blank') }

const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let interval: ReturnType<typeof setInterval> | null = null
const targetDate = computed(() => new Date(props.date || '2026-06-15T08:00:00').getTime())
const updateCountdown = () => { const n = Date.now(), d = targetDate.value - n; if (d > 0) { timeLeft.value = { days: Math.floor(d / 86400000), hours: Math.floor(d % 86400000 / 3600000), minutes: Math.floor(d % 3600000 / 60000), seconds: Math.floor(d % 60000 / 1000) } } else { timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 } } };
const formatNumber = (n: number) => n.toString().padStart(2, '0')
const openLightbox = (src: string) => { selectedImage.value = src; showLightbox.value = true }
const closeLightbox = () => { showLightbox.value = false; selectedImage.value = '' }
const copyToClipboard = (t: string, i: number) => { navigator.clipboard.writeText(t); copiedIndex.value = i; setTimeout(() => copiedIndex.value = null, 2000) }
const copyQrToClipboard = (t: string, i: number) => { navigator.clipboard.writeText(t); copiedQrIndex.value = i; setTimeout(() => copiedQrIndex.value = null, 2000) }
const scrollToSection = (id: string) => { showMenu.value = false; document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
const isVisible = (id: string) => visibleSections.value.has(id)
</script>

<template>
<div class="min-h-screen bg-white text-[#2C3E50] font-sans">
  <section id="hero" class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="w-[500px] h-[500px] border-2 border-[#2C3E50]/10 rotate-45 absolute"></div>
      <div class="w-[400px] h-[400px] border-2 border-[#E74C3C]/10 rotate-45 absolute"></div>
    </div>
    <div class="relative z-10 text-center px-6">
      <div class="animate-fadeInUp"><p class="text-sm tracking-[0.4em] uppercase text-[#2C3E50]/60 mb-4">The Wedding Of</p></div>
      <div class="animate-fadeInUp" style="animation-delay: 0.2s;"><h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{{ props.groom }} <span class="text-[#E74C3C]">&</span> {{ props.bride }}</h1></div>
      <div class="animate-fadeInUp" style="animation-delay: 0.4s;"><p class="text-lg text-[#2C3E50]/70 mb-8">{{ formattedDate }}</p></div>
      <div class="animate-fadeIn" style="animation-delay: 0.6s;"><p class="text-sm text-[#2C3E50]/50">Kepada Yth.</p><p class="text-xl font-bold">{{ guestName }}</p></div>
    </div>
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"><button @click="scrollToSection('couple')" class="p-3 border-2 border-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-colors"><ChevronDown class="w-6 h-6" /></button></div>
  </section>

  <section id="couple" class="py-24 px-6">
    <div class="max-w-4xl mx-auto">
      <div :class="['text-center mb-16', isVisible('couple') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"><p class="text-sm tracking-[0.3em] uppercase text-[#2C3E50]/60 mb-4">Mempelai</p><h2 class="text-4xl font-bold">Couple</h2></div>
      <div class="grid md:grid-cols-2 gap-16">
        <div :class="['text-center transition-all duration-700', isVisible('couple') ? 'opacity-100' : 'opacity-0']">
          <div class="aspect-[3/4] bg-gray-100 mb-6"><NuxtImg src="https://picsum.photos/seed/g8/600/800" class="w-full h-full object-cover grayscale" /></div>
          <h3 class="text-2xl font-bold mb-2">{{ props.groom }}</h3><p class="text-[#2C3E50]/60">Putra dari Bpk. Heru & Ibu Siti</p>
        </div>
        <div :class="['text-center transition-all duration-700', isVisible('couple') ? 'opacity-100' : 'opacity-0']" style="animation-delay: 0.2s;">
          <div class="aspect-[3/4] bg-gray-100 mb-6"><NuxtImg src="https://picsum.photos/seed/b8/600/800" class="w-full h-full object-cover grayscale" /></div>
          <h3 class="text-2xl font-bold mb-2">{{ props.bride }}</h3><p class="text-[#2C3E50]/60">Putri dari Bpk. Ahmad & Ibu Aminah</p>
        </div>
      </div>
    </div>
  </section>

  <section class="py-20 px-6 bg-[#2C3E50] text-white">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-12"><p class="text-sm tracking-[0.3em] uppercase text-[#E74C3C] mb-4">Hitung Mundur</p><h2 class="text-3xl font-bold">Menuju Hari Bahagia</h2></div>
      <div class="grid grid-cols-4 gap-4">
        <div v-for="(v, k) in timeLeft" :key="k" class="text-center p-6 bg-white/5 border-2 border-white/10">
          <div class="text-4xl font-bold mb-2 text-[#E74C3C]">{{ formatNumber(v as number) }}</div>
          <div class="text-xs uppercase tracking-widest">{{ k }}</div>
        </div>
      </div>
    </div>
  </section>

  <section id="story" class="py-24 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16"><p class="text-sm tracking-[0.3em] uppercase text-[#2C3E50]/60 mb-4">Kisah Cinta</p><h2 class="text-4xl font-bold">Our Story</h2></div>
      <div class="relative">
        <div class="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-[#2C3E50]/10"></div>
        <div class="space-y-12">
          <div v-for="(s, i) in coupleStories" :key="i" :class="['flex', s.isLeft ? 'justify-start pr-12' : 'justify-end pl-12']">
            <div class="max-w-sm w-1/2">
              <div class="w-12 h-12 bg-[#2C3E50] text-white rounded-none flex items-center justify-center font-bold mb-4">{{ s.number }}</div>
              <p class="text-sm text-[#2C3E50]/60 mb-2">{{ s.year }}</p>
              <h3 class="text-xl font-bold mb-2">{{ s.title }}</h3>
              <p class="text-[#2C3E50]/70">{{ s.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="gallery" class="py-24 px-6 bg-gray-50">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-16"><p class="text-sm tracking-[0.3em] uppercase text-[#2C3E50]/60 mb-4">Kenangan</p><h2 class="text-4xl font-bold">Gallery</h2></div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="(img, i) in images" :key="i" class="aspect-square bg-gray-200 cursor-pointer group overflow-hidden" @click="openLightbox(img)">
          <NuxtImg :src="img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>
    </div>
  </section>

  <section id="event" class="py-24 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16"><p class="text-sm tracking-[0.3em] uppercase text-[#2C3E50]/60 mb-4">Jadwal</p><h2 class="text-4xl font-bold">Wedding Event</h2></div>
      <div class="grid md:grid-cols-2 gap-8">
        <div v-for="(e, k) in eventLocations" :key="k" class="p-8 border-2 border-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-all">
          <h3 class="text-xl font-bold mb-4">{{ e.title }}</h3>
          <div class="space-y-2"><div class="flex items-center gap-2"><Clock class="w-4 h-4" /><span>{{ e.time }}</span></div><div class="flex items-center gap-2"><MapPin class="w-4 h-4" /><span>{{ e.location }}</span></div></div>
        </div>
      </div>
      <div class="mt-12 text-center"><button @click="addToCalendar" class="px-8 py-3 bg-[#2C3E50] text-white hover:bg-[#E74C3C] transition-colors font-bold tracking-widest text-sm">ADD TO CALENDAR</button></div>
    </div>
  </section>

  <section id="gift" class="py-24 px-6 bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-16"><p class="text-sm tracking-[0.3em] uppercase text-[#2C3E50]/60 mb-4">Hadiah</p><h2 class="text-4xl font-bold">Wedding Gift</h2></div>
      <div class="flex justify-center mb-8 gap-2">
        <button @click="activeTab = 'bank'" :class="['px-6 py-2 text-sm font-bold tracking-widest transition-colors', activeTab === 'bank' ? 'bg-[#2C3E50] text-white' : 'bg-white border-2 border-[#2C3E50]']">BANK</button>
        <button @click="activeTab = 'digital'" :class="['px-6 py-2 text-sm font-bold tracking-widest transition-colors', activeTab === 'digital' ? 'bg-[#2C3E50] text-white' : 'bg-white border-2 border-[#2C3E50]']">DIGITAL</button>
      </div>
      <div class="grid md:grid-cols-2 gap-6">
        <div v-for="(a, i) in (activeTab === 'bank' ? accounts : qrCodes)" :key="i" class="p-6 bg-white border-2 border-[#2C3E50]">
          <div class="flex items-center justify-between mb-4"><div class="w-10 h-10 bg-[#2C3E50] text-white flex items-center justify-center font-bold">{{ a.logo }}</div><span class="font-bold">{{ a.bank }}</span></div>
          <p class="text-lg mb-1">{{ a.number }}</p>
          <p class="text-sm text-[#2C3E50]/60 mb-4">{{ a.owner }}</p>
          <button @click="copyToClipboard(a.number, i)" class="w-full py-2 border-2 border-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-colors text-sm font-bold">{{ copiedIndex === i ? 'Copied!' : 'COPY' }}</button>
        </div>
      </div>
    </div>
  </section>

  <section id="rsvp" class="py-24 px-6">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-16"><p class="text-sm tracking-[0.3em] uppercase text-[#2C3E50]/60 mb-4">Konfirmasi</p><h2 class="text-4xl font-bold">RSVP</h2><p class="text-[#2C3E50]/60 mt-4">Mohon konfirmasi sebelum 1 Juni 2026</p></div>
      <form class="space-y-6">
        <div><label class="block text-sm text-[#2C3E50]/60 mb-2">Nama Tamu<input type="text" :value="guestName" class="w-full p-4 border-2 border-[#2C3E50] focus:border-[#E74C3C] outline-none" /></label></div>
        <div><label class="block text-sm text-[#2C3E50]/60 mb-2">Jumlah Tamu<select class="w-full p-4 border-2 border-[#2C3E50] focus:border-[#E74C3C] outline-none"><option>1</option><option>2</option><option>3</option><option>4</option></select></label></div>
        <div class="grid grid-cols-3 gap-4">
          <button type="button" class="p-4 border-2 border-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-colors text-center"><Heart class="w-6 h-6 mx-auto mb-2" /><span class="text-sm font-bold">Hadir</span></button>
          <button type="button" class="p-4 border-2 border-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-colors text-center"><MessageSquare class="w-6 h-6 mx-auto mb-2" /><span class="text-sm font-bold">Ragu</span></button>
          <button type="button" class="p-4 border-2 border-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-colors text-center"><X class="w-6 h-6 mx-auto mb-2" /><span class="text-sm font-bold">Tidak</span></button>
        </div>
        <button type="submit" class="w-full py-4 bg-[#2C3E50] text-white hover:bg-[#E74C3C] transition-colors font-bold tracking-widest text-sm">KIRIM RSVP</button>
      </form>
    </div>
  </section>

  <footer class="py-12 px-6 bg-[#2C3E50] text-white text-center"><p class="text-lg font-bold tracking-widest mb-2">{{ props.groom }} & {{ props.bride }}</p><p class="text-white/60 text-sm">Terima kasih</p></footer>

  <div v-if="showLightbox" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 cursor-zoom-out" @click="closeLightbox"><NuxtImg :src="selectedImage" class="max-w-full max-h-full object-contain" /><button @click="closeLightbox" class="absolute top-6 right-6 p-2 text-white"><X class="w-8 h-8" /></button></div>
</div>
</template>

<style scoped>
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bounce { 0%, 100% { transform: translateY(0) translateX(-50%); } 50% { transform: translateY(-10px) translateX(-50%); } }
.animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
.animate-bounce { animation: bounce 2s infinite; }
</style>
