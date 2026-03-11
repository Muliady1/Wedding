<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { luxeGoldData } from '~/composables/useData'
import { ZoomIn, Copy, Check, Heart, MessageSquare, Clock, MapPin, ChevronDown, X, Crown, Sparkles, Gem, Diamond } from 'lucide-vue-next'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

const props = defineProps<{
  groom: string
  bride: string
  date: string
  location: string
  mapUrl: string
}>()

const stories = luxeGoldData.stories
const galleryImages = luxeGoldData.galleryImages
const accounts = luxeGoldData.accounts
const qrCodes = luxeGoldData.qrCodes
const eventLocations = luxeGoldData.eventLocations

const guestName = ref("Tamu Undangan")
const showMenu = ref(false)
const selectedImage = ref('')
const showLightbox = ref(false)
const copiedIndex = ref<number | null>(null)
const copiedQrIndex = ref<number | null>(null)
const activeTab = ref<'bank' | 'digital'>('bank')
const visibleSections = ref<Set<string>>(new Set())

onMounted(() => {
  const params = new URLSearchParams(globalThis.location.search)
  const to = params.get('to')
  if (to) guestName.value = to
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        visibleSections.value.add(entry.target.id)
        visibleSections.value = new Set(visibleSections.value)
      }
    })
  }, { threshold: 0.1 })
  
  document.querySelectorAll('section[id]').forEach(section => observer.observe(section))
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const coupleStories = computed(() => {
  return stories.map((story, index) => ({
    ...story,
    number: String(index + 1).padStart(2, '0'),
    isLeft: index % 2 === 0,
    isCenter: index === stories.length - 1
  }))
})

const images = computed(() => galleryImages.map(img => img.src))

const formattedDate = computed(() => {
  const d = new Date(props.date || '2026-06-15T08:00:00')
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return d.toLocaleDateString('id-ID', options)
})

const addToCalendar = () => {
  const date = new Date(props.date)
  const start = date.toISOString().replaceAll(/[-:]/g, '').replaceAll(/\.\d+/g, '')
  const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000)
  const end = endDate.toISOString().replaceAll(/[-:]/g, '').replaceAll(/\.\d+/g, '')
  const title = `Pernikahan ${props.groom} & ${props.bride}`
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=Undangan+Pernikahan&location=Jakarta`
  window.open(url, '_blank')
}

const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let interval: ReturnType<typeof setInterval> | null = null

const targetDate = computed(() => new Date(props.date || '2026-06-15T08:00:00').getTime())

const updateCountdown = () => {
  const now = Date.now()
  const distance = targetDate.value - now
  if (distance > 0) {
    timeLeft.value = {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    }
  } else {
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    if (interval) clearInterval(interval)
  }
}

const formatNumber = (num: number) => num.toString().padStart(2, '0')

const openLightbox = (src: string) => { selectedImage.value = src; showLightbox.value = true }
const closeLightbox = () => { showLightbox.value = false; selectedImage.value = '' }

const copyToClipboard = (text: string, index: number) => {
  navigator.clipboard.writeText(text)
  copiedIndex.value = index
  setTimeout(() => copiedIndex.value = null, 2000)
}

const copyQrToClipboard = (text: string, index: number) => {
  navigator.clipboard.writeText(text)
  copiedQrIndex.value = index
  setTimeout(() => copiedQrIndex.value = null, 2000)
}

const scrollToSection = (id: string) => {
  showMenu.value = false
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const isVisible = (id: string) => visibleSections.value.has(id)
</script>

<template>
  <div class="min-h-screen bg-[#1A1A1A] text-[#D4AF37] font-sans">
    <!-- Golden Background Effects -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
      <div class="absolute top-20 left-10 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-[#C5A028]/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
    </div>

    <!-- Hero Section -->
    <section id="hero" class="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A]"></div>
      <div class="absolute inset-0">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-[#D4AF37]/10 rounded-full animate-spin" style="animation-duration: 60s;"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#D4AF37]/5 rounded-full animate-spin" style="animation-duration: 40s; animation-direction: reverse;"></div>
      </div>
      <div class="relative z-10 text-center px-6">
        <div class="animate-fadeInUp">
          <p class="text-sm tracking-[0.4em] uppercase text-[#D4AF37]/70 mb-4">The Wedding Of</p>
        </div>
        <div class="animate-fadeInUp" style="animation-delay: 0.2s;">
          <Crown class="w-16 h-16 mx-auto mb-6 text-[#D4AF37]" />
          <h1 class="text-5xl md:text-7xl font-serif mb-6">{{ props.groom }} <span class="text-[#D4AF37]/40">&</span> {{ props.bride }}</h1>
        </div>
        <div class="animate-fadeInUp" style="animation-delay: 0.4s;">
          <p class="text-lg text-[#D4AF37]/70 mb-8">{{ formattedDate }}</p>
        </div>
        <div class="animate-fadeIn" style="animation-delay: 0.6s;">
          <div class="flex flex-col items-center gap-2">
            <p class="text-sm text-[#D4AF37]/50">Kepada Yth.</p>
            <p class="text-xl font-medium text-[#D4AF37]">{{ guestName }}</p>
          </div>
        </div>
      </div>
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <button @click="scrollToSection('couple')" class="p-3 rounded-full border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-colors">
          <ChevronDown class="w-6 h-6 text-[#D4AF37]" />
        </button>
      </div>
    </section>

    <!-- Couple Section -->
    <section id="couple" class="py-24 px-6 relative">
      <div class="max-w-4xl mx-auto">
        <div :class="['text-center mb-16 transition-all duration-700', isVisible('couple') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#D4AF37]/70 mb-4">Mempelai</p>
          <h2 class="text-4xl font-serif text-[#D4AF37]">Couple</h2>
          <div class="flex justify-center mt-4">
            <Sparkles class="w-6 h-6 text-[#D4AF37]/50" />
          </div>
        </div>
        <div class="grid md:grid-cols-2 gap-16">
          <div :class="['text-center transition-all duration-700 delay-100', isVisible('couple') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10']">
            <div class="aspect-[3/4] bg-[#2A2A2A] mb-6 overflow-hidden rounded-lg border border-[#D4AF37]/20">
              <NuxtImg src="https://picsum.photos/seed/groom4/600/800" alt="Groom" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-2xl font-serif mb-2 text-[#D4AF37]">{{ props.groom }}</h3>
            <p class="text-[#D4AF37]/70">Putra dari Bpk. Heru & Ibu Siti</p>
          </div>
          <div :class="['text-center transition-all duration-700 delay-200', isVisible('couple') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10']">
            <div class="aspect-[3/4] bg-[#2A2A2A] mb-6 overflow-hidden rounded-lg border border-[#D4AF37]/20">
              <NuxtImg src="https://picsum.photos/seed/bride4/600/800" alt="Bride" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-2xl font-serif mb-2 text-[#D4AF37]">{{ props.bride }}</h3>
            <p class="text-[#D4AF37]/70">Putri dari Bpk. Ahmad & Ibu Aminah</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Countdown Section -->
    <section class="py-20 px-6 bg-gradient-to-r from-[#D4AF37]/20 via-[#C5A028]/20 to-[#D4AF37]/20">
      <div class="max-w-3xl mx-auto">
        <div :class="['text-center mb-12 transition-all duration-700', isVisible('couple') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#D4AF37] mb-4">Hitung Mundur</p>
          <h2 class="text-3xl font-serif text-[#D4AF37]">Menuju Hari Bahagia</h2>
        </div>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="(item, key) in timeLeft" :key="key" :class="['text-center p-6 bg-[#1A1A1A] border border-[#D4AF37]/30 transition-all duration-500', isVisible('couple') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" :style="{ transitionDelay: ['days', 'hours', 'minutes', 'seconds'].indexOf(key) * 0.1 + 's' }">
            <div class="text-4xl font-serif mb-2 text-[#D4AF37]">{{ formatNumber(item as number) }}</div>
            <div class="text-xs tracking-[0.2em] uppercase text-[#D4AF37]/70">{{ key }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section id="story" class="py-24 px-6 relative">
      <div class="max-w-4xl mx-auto relative">
        <div :class="['text-center mb-16 transition-all duration-700', isVisible('story') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#D4AF37]/70 mb-4">Kisah Cinta</p>
          <h2 class="text-4xl font-serif text-[#D4AF37]">Our Story</h2>
        </div>
        <div class="relative">
          <div class="absolute left-1/2 -translate-x-1/2 w-px h-full bg-[#D4AF37]/20"></div>
          <div class="space-y-16">
            <div v-for="(story, index) in coupleStories" :key="index" :class="['flex transition-all duration-700', story.isLeft ? 'justify-start pr-12' : 'justify-end pl-12', isVisible('story') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" :style="{ transitionDelay: index * 0.15 + 's' }">
              <div class="max-w-sm w-1/2">
                <div class="w-12 h-12 bg-[#D4AF37] text-[#1A1A1A] rounded-full flex items-center justify-center text-sm font-serif mb-4">{{ story.number }}</div>
                <p class="text-sm text-[#D4AF37]/70 mb-2">{{ story.year }}</p>
                <h3 class="text-xl font-serif mb-2 text-[#D4AF37]">{{ story.title }}</h3>
                <p class="text-[#D4AF37]/70 leading-relaxed">{{ story.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="py-24 px-6 bg-[#2A2A2A]/50">
      <div class="max-w-6xl mx-auto">
        <div :class="['text-center mb-16 transition-all duration-700', isVisible('gallery') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#D4AF37]/70 mb-4">Kenangan</p>
          <h2 class="text-4xl font-serif text-[#D4AF37]">Gallery</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="(img, index) in images" :key="index" :class="['aspect-square bg-[#2A2A2A] overflow-hidden cursor-pointer group transition-all duration-700 border border-[#D4AF37]/10', isVisible('gallery') ? 'opacity-100 scale-100' : 'opacity-0 scale-90']" :style="{ transitionDelay: index * 0.1 + 's' }" @click="openLightbox(img)">
            <NuxtImg :src="img" :alt="`Gallery ${index + 1}`" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/50 transition-colors flex items-center justify-center">
              <ZoomIn class="w-8 h-8 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Event Section -->
    <section id="event" class="py-24 px-6 relative">
      <div class="max-w-4xl mx-auto">
        <div :class="['text-center mb-16 transition-all duration-700', isVisible('event') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#D4AF37]/70 mb-4">Jadwal</p>
          <h2 class="text-4xl font-serif text-[#D4AF37]">Wedding Event</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-8">
          <div :class="['p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 bg-[#1A1A1A]/50 backdrop-blur-sm', isVisible('event') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" style="transition-delay: 0.1s;">
            <div class="flex items-center gap-3 mb-4">
              <Diamond class="w-5 h-5 text-[#D4AF37]" />
              <h3 class="text-xl font-serif text-[#D4AF37]">{{ eventLocations.akad.title }}</h3>
            </div>
            <div class="space-y-3 text-[#D4AF37]/70">
              <div class="flex items-center gap-2"><Clock class="w-4 h-4" /><span>{{ eventLocations.akad.time }}</span></div>
              <div class="flex items-center gap-2"><MapPin class="w-4 h-4" /><span>{{ eventLocations.akad.location }}</span></div>
              <p class="text-sm">{{ eventLocations.akad.address }}</p>
            </div>
          </div>
          <div :class="['p-8 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 bg-[#1A1A1A]/50 backdrop-blur-sm', isVisible('event') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" style="transition-delay: 0.2s;">
            <div class="flex items-center gap-3 mb-4">
              <Gem class="w-5 h-5 text-[#D4AF37]" />
              <h3 class="text-xl font-serif text-[#D4AF37]">{{ eventLocations.resepsi.title }}</h3>
            </div>
            <div class="space-y-3 text-[#D4AF37]/70">
              <div class="flex items-center gap-2"><Clock class="w-4 h-4" /><span>{{ eventLocations.resepsi.time }}</span></div>
              <div class="flex items-center gap-2"><MapPin class="w-4 h-4" /><span>{{ eventLocations.resepsi.location }}</span></div>
              <p class="text-sm">{{ eventLocations.resepsi.address }}</p>
            </div>
          </div>
        </div>
        <div :class="['mt-12 text-center transition-all duration-700', isVisible('event') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" style="transition-delay: 0.4s;">
          <button @click="addToCalendar" class="px-8 py-3 bg-[#D4AF37] text-[#1A1A1A] hover:bg-[#C5A028] transition-colors tracking-widest text-sm font-medium rounded">
            ADD TO CALENDAR
          </button>
        </div>
      </div>
    </section>

    <!-- Gift Section -->
    <section id="gift" class="py-24 px-6 bg-[#2A2A2A]/50">
      <div class="max-w-4xl mx-auto">
        <div :class="['text-center mb-16 transition-all duration-700', isVisible('gift') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#D4AF37]/70 mb-4">Hadiah</p>
          <h2 class="text-4xl font-serif text-[#D4AF37]">Wedding Gift</h2>
        </div>
        <div class="flex justify-center mb-8">
          <div class="flex gap-2">
            <button @click="activeTab = 'bank'" :class="['px-6 py-2 text-sm tracking-widest transition-colors rounded', activeTab === 'bank' ? 'bg-[#D4AF37] text-[#1A1A1A]' : 'bg-[#1A1A1A] border border-[#D4AF37]/30']">BANK TRANSFER</button>
            <button @click="activeTab = 'digital'" :class="['px-6 py-2 text-sm tracking-widest transition-colors rounded', activeTab === 'digital' ? 'bg-[#D4AF37] text-[#1A1A1A]' : 'bg-[#1A1A1A] border border-[#D4AF37]/30']">DIGITAL WALLET</button>
          </div>
        </div>
        <div v-if="activeTab === 'bank'" class="grid md:grid-cols-2 gap-6">
          <div v-for="(account, index) in accounts" :key="account.bank" :class="['p-6 bg-[#1A1A1A] border border-[#D4AF37]/20 transition-all duration-500', isVisible('gift') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" :style="{ transitionDelay: index * 0.1 + 's' }">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 bg-[#D4AF37] text-[#1A1A1A] flex items-center justify-center font-serif">{{ account.logo }}</div>
              <span class="font-serif text-[#D4AF37]">{{ account.bank }}</span>
            </div>
            <p class="text-lg mb-1 text-[#D4AF37]">{{ account.number }}</p>
            <p class="text-[#D4AF37]/70 text-sm mb-4">{{ account.owner }}</p>
            <button @click="copyToClipboard(account.number, index)" class="w-full py-2 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-colors text-sm flex items-center justify-center gap-2 rounded">
              <Check v-if="copiedIndex === index" class="w-4 h-4" />
              <Copy v-else class="w-4 h-4" />
              {{ copiedIndex === index ? 'Copied!' : 'Copy Number' }}
            </button>
          </div>
        </div>
        <div v-else class="grid md:grid-cols-2 gap-6">
          <div v-for="(qr, index) in qrCodes" :key="qr.bank" :class="['p-6 bg-[#1A1A1A] border border-[#D4AF37]/20 text-center transition-all duration-500', isVisible('gift') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" :style="{ transitionDelay: index * 0.1 + 's' }">
            <div class="w-16 h-16 bg-[#D4AF37] text-[#1A1A1A] flex items-center justify-center text-2xl font-serif mx-auto mb-4">{{ qr.logo }}</div>
            <p class="text-lg font-medium text-[#D4AF37]">{{ qr.bank }}</p>
            <p class="text-[#D4AF37]/70 text-sm mb-4">{{ qr.number }}</p>
            <button @click="copyQrToClipboard(qr.number, index)" class="w-full py-2 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-colors text-sm flex items-center justify-center gap-2 rounded">
              <Check v-if="copiedQrIndex === index" class="w-4 h-4" />
              <Copy v-else class="w-4 h-4" />
              {{ copiedQrIndex === index ? 'Copied!' : 'Copy Number' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- RSVP Section -->
    <section id="rsvp" class="py-24 px-6">
      <div class="max-w-2xl mx-auto">
        <div :class="['text-center mb-16 transition-all duration-700', isVisible('rsvp') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#D4AF37]/70 mb-4">Konfirmasi</p>
          <h2 class="text-4xl font-serif text-[#D4AF37]">RSVP</h2>
          <p class="text-[#D4AF37]/70 mt-4">Mohon konfirmasi kehadiran Anda sebelum 1 Juni 2026</p>
        </div>
        <div :class="['transition-all duration-700', isVisible('rsvp') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <form class="space-y-6" @submit.prevent>
            <div>
              <label class="block text-sm text-[#D4AF37]/70 mb-2">Nama Tamu<input type="text" :value="guestName" class="w-full p-4 border border-[#D4AF37]/30 focus:border-[#D4AF37]/60 outline-none transition-colors bg-[#1A1A1A]/50 rounded" /></label>
            </div>
            <div>
              <label class="block text-sm text-[#D4AF37]/70 mb-2">Jumlah Tamu<select class="w-full p-4 border border-[#D4AF37]/30 focus:border-[#D4AF37]/60 outline-none transition-colors bg-[#1A1A1A]/50 rounded">
                <option>1 Orang</option>
                <option>2 Orang</option>
                <option>3 Orang</option>
                <option>4 Orang</option>
              </select>
              </label>
            </div>
            <div>
              <p class="block text-sm text-[#D4AF37]/70 mb-2">Konfirmasi Kehadiran</p>
              <div class="grid grid-cols-3 gap-4">
                <button type="button" class="p-4 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-colors text-center rounded">
                  <Heart class="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                  <span class="text-sm">Hadir</span>
                </button>
                <button type="button" class="p-4 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-colors text-center rounded">
                  <MessageSquare class="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                  <span class="text-sm">Ragu</span>
                </button>
                <button type="button" class="p-4 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 transition-colors text-center rounded">
                  <X class="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
                  <span class="text-sm">Tidak Hadir</span>
                </button>
              </div>
            </div>
            <button type="submit" class="w-full py-4 bg-[#D4AF37] text-[#1A1A1A] hover:bg-[#C5A028] transition-colors tracking-widest text-sm font-medium rounded">
              KIRIM RSVP
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-6 bg-[#1A1A1A] text-[#D4AF37] text-center border-t border-[#D4AF37]/10">
      <Crown class="w-8 h-8 mx-auto mb-4" />
      <p class="text-lg font-serif tracking-widest mb-4">{{ props.groom }} & {{ props.bride }}</p>
      <p class="text-[#D4AF37]/70 text-sm">Terima kasih atas doa dan restunya</p>
    </footer>

    <!-- Lightbox -->
    <div v-if="showLightbox" class="fixed inset-0 z-50 bg-[#1A1A1A]/95 flex items-center justify-center p-6 cursor-zoom-out animate-fadeIn" @click="closeLightbox">
      <NuxtImg :src="selectedImage" class="max-w-full max-h-full object-contain" />
      <button @click="closeLightbox" class="absolute top-6 right-6 p-2 text-[#D4AF37] hover:text-[#D4AF37]/70">
        <X class="w-8 h-8" />
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500&display=swap');

.font-sans { font-family: 'Montserrat', sans-serif; }
.font-serif { font-family: 'Cinzel', serif; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 300px;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  50% {
    transform: translateY(-10px) translateX(-50%);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out forwards;
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
