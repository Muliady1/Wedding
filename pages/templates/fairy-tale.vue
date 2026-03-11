<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { fairyTaleData } from '~/composables/useData'
import { ZoomIn, Copy, Check, Heart, MessageSquare, Clock, MapPin, ChevronDown, Menu, X, Sparkles, Castle, Moon, Star } from 'lucide-vue-next'

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

const stories = fairyTaleData.stories
const galleryImages = fairyTaleData.galleryImages
const accounts = fairyTaleData.accounts
const qrCodes = fairyTaleData.qrCodes
const eventLocations = fairyTaleData.eventLocations

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
  <div class="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-[#E8D5E5] font-sans">
    <!-- Sparkle Effects -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-20 left-10 text-white opacity-20 animate-sparkle">
        <Sparkles class="w-16 h-16" />
      </div>
      <div class="absolute top-40 right-20 text-white opacity-20 animate-sparkle-delayed">
        <Star class="w-12 h-12" />
      </div>
      <div class="absolute bottom-40 left-1/4 text-white opacity-15 animate-sparkle">
        <Moon class="w-14 h-14" />
      </div>
    </div>

    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e]/95 backdrop-blur-md border-b border-[#9B59B6]/20">
      <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div class="text-lg font-serif tracking-wider flex items-center gap-2">
          <Castle class="w-5 h-5 text-[#9B59B6]" />
          {{ props.groom }} & {{ props.bride }}
        </div>
        <button @click="showMenu = !showMenu" class="p-2 hover:bg-[#9B59B6]/10 rounded-lg transition-colors">
          <Menu v-if="!showMenu" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
      <div v-if="showMenu" class="px-6 pb-4 flex flex-col gap-3 animate-slideDown">
        <button @click="scrollToSection('home')" class="text-left py-2 hover:text-[#9B59B6] transition-colors">Home</button>
        <button @click="scrollToSection('couple')" class="text-left py-2 hover:text-[#9B59B6] transition-colors">Couple</button>
        <button @click="scrollToSection('story')" class="text-left py-2 hover:text-[#9B59B6] transition-colors">Story</button>
        <button @click="scrollToSection('gallery')" class="text-left py-2 hover:text-[#9B59B6] transition-colors">Gallery</button>
        <button @click="scrollToSection('event')" class="text-left py-2 hover:text-[#9B59B6] transition-colors">Event</button>
        <button @click="scrollToSection('gift')" class="text-left py-2 hover:text-[#9B59B6] transition-colors">Gift</button>
        <button @click="scrollToSection('rsvp')" class="text-left py-2 hover:text-[#9B59B6] transition-colors">RSVP</button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e]/50 to-[#0f3460]"></div>
      <div class="absolute inset-0">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#9B59B6]/20 rounded-full animate-spin" style="animation-duration: 30s;"></div>
      </div>
      <div class="relative z-10 text-center px-6">
        <div class="animate-fadeInUp">
          <p class="text-sm tracking-[0.4em] uppercase text-[#9B59B6]/70 mb-4">The Wedding Of</p>
        </div>
        <div class="animate-fadeInUp" style="animation-delay: 0.2s;">
          <Sparkles class="w-16 h-16 mx-auto mb-6 text-[#9B59B6]" />
          <h1 class="text-5xl md:text-7xl font-serif mb-6">{{ props.groom }} <span class="text-[#9B59B6]/40">&</span> {{ props.bride }}</h1>
        </div>
        <div class="animate-fadeInUp" style="animation-delay: 0.4s;">
          <p class="text-lg text-[#E8D5E5]/70 mb-8">{{ formattedDate }}</p>
        </div>
        <div class="animate-fadeIn" style="animation-delay: 0.6s;">
          <div class="flex flex-col items-center gap-2">
            <p class="text-sm text-[#9B59B6]/50">Kepada Yth.</p>
            <p class="text-xl font-medium text-[#E8D5E5]">{{ guestName }}</p>
          </div>
        </div>
      </div>
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <button @click="scrollToSection('couple')" class="p-3 rounded-full border border-[#9B59B6]/30 hover:border-[#9B59B6]/60 transition-colors">
          <ChevronDown class="w-6 h-6 text-[#9B59B6]" />
        </button>
      </div>
    </section>

    <!-- Couple Section -->
    <section id="couple" class="py-24 px-6 relative">
      <div class="max-w-4xl mx-auto">
        <div :class="['text-center mb-16 transition-all duration-700', isVisible('couple') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#9B59B6]/70 mb-4">Mempelai</p>
          <h2 class="text-4xl font-serif text-[#E8D5E5]">Couple</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-16">
          <div :class="['text-center transition-all duration-700 delay-100', isVisible('couple') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10']">
            <div class="aspect-[3/4] bg-[#16213e] mb-6 overflow-hidden rounded-lg border border-[#9B59B6]/20">
              <NuxtImg src="https://picsum.photos/seed/groom7/600/800" alt="Groom" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-2xl font-serif mb-2 text-[#E8D5E5]">{{ props.groom }}</h3>
            <p class="text-[#9B59B6]/70">Putra dari Bpk. Heru & Ibu Siti</p>
          </div>
          <div :class="['text-center transition-all duration-700 delay-200', isVisible('couple') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10']">
            <div class="aspect-[3/4] bg-[#16213e] mb-6 overflow-hidden rounded-lg border border-[#9B59B6]/20">
              <NuxtImg src="https://picsum.photos/seed/bride7/600/800" alt="Bride" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-2xl font-serif mb-2 text-[#E8D5E5]">{{ props.bride }}</h3>
            <p class="text-[#9B59B6]/70">Putri dari Bpk. Ahmad & Ibu Aminah</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Countdown Section -->
    <section class="py-20 px-6 bg-[#0f3460]">
      <div class="max-w-3xl mx-auto">
        <div :class="['text-center mb-12 transition-all duration-700', isVisible('couple') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#9B59B6] mb-4">Hitung Mundur</p>
          <h2 class="text-3xl font-serif text-[#E8D5E5]">Menuju Hari Bahagia</h2>
        </div>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="(item, key) in timeLeft" :key="key" :class="['text-center p-6 bg-[#1a1a2e]/50 border border-[#9B59B6]/30 transition-all duration-500', isVisible('couple') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" :style="{ transitionDelay: ['days', 'hours', 'minutes', 'seconds'].indexOf(key) * 0.1 + 's' }">
            <div class="text-4xl font-serif mb-2 text-[#9B59B6]">{{ formatNumber(item as number) }}</div>
            <div class="text-xs tracking-[0.2em] uppercase text-[#E8D5E5]/70">{{ key }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section id="story" class="py-24 px-6 relative">
      <div class="max-w-4xl mx-auto relative">
        <div :class="['text-center mb-16 transition-all duration-700', isVisible('story') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#9B59B6]/70 mb-4">Kisah Cinta</p>
          <h2 class="text-4xl font-serif text-[#E8D5E5]">Our Story</h2>
        </div>
        <div class="relative">
          <div class="absolute left-1/2 -translate-x-1/2 w-px h-full bg-[#9B59B6]/20"></div>
          <div class="space-y-16">
            <div v-for="(story, index) in coupleStories" :key="index" :class="['flex transition-all duration-700', story.isLeft ? 'justify-start pr-12' : 'justify-end pl-12', isVisible('story') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" :style="{ transitionDelay: index * 0.15 + 's' }">
              <div class="max-w-sm w-1/2">
                <div class="w-12 h-12 bg-[#9B59B6] text-white rounded-full flex items-center justify-center text-sm font-serif mb-4">{{ story.number }}</div>
                <p class="text-sm text-[#9B59B6]/70 mb-2">{{ story.year }}</p>
                <h3 class="text-xl font-serif mb-2 text-[#E8D5E5]">{{ story.title }}</h3>
                <p class="text-[#E8D5E5]/70 leading-relaxed">{{ story.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="py-24 px-6 bg-[#16213e]/30">
      <div class="max-w-6xl mx-auto">
        <div :class="['text-center mb-16 transition-all duration-700', isVisible('gallery') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#9B59B6]/70 mb-4">Kenangan</p>
          <h2 class="text-4xl font-serif text-[#E8D5E5]">Gallery</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="(img, index) in images" :key="index" :class="['aspect-square bg-[#16213e] overflow-hidden cursor-pointer group transition-all duration-700 border border-[#9B59B6]/10', isVisible('gallery') ? 'opacity-100 scale-100' : 'opacity-0 scale-90']" :style="{ transitionDelay: index * 0.1 + 's' }" @click="openLightbox(img)">
            <NuxtImg :src="img" :alt="`Gallery ${index + 1}`" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <ZoomIn class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Event Section -->
    <section id="event" class="py-24 px-6 relative">
      <div class="max-w-4xl mx-auto">
        <div :class="['text-center mb-16 transition-all duration-700', isVisible('event') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#9B59B6]/70 mb-4">Jadwal</p>
          <h2 class="text-4xl font-serif text-[#E8D5E5]">Wedding Event</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-8">
          <div :class="['p-8 border border-[#9B59B6]/20 hover:border-[#9B59B6]/50 transition-all duration-300 bg-[#1a1a2e]/50 backdrop-blur-sm rounded-lg', isVisible('event') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" style="transition-delay: 0.1s;">
            <div class="flex items-center gap-3 mb-4">
              <Moon class="w-5 h-5 text-[#9B59B6]" />
              <h3 class="text-xl font-serif text-[#E8D5E5]">{{ eventLocations.akad.title }}</h3>
            </div>
            <div class="space-y-3 text-[#E8D5E5]/70">
              <div class="flex items-center gap-2"><Clock class="w-4 h-4" /><span>{{ eventLocations.akad.time }}</span></div>
              <div class="flex items-center gap-2"><MapPin class="w-4 h-4" /><span>{{ eventLocations.akad.location }}</span></div>
              <p class="text-sm">{{ eventLocations.akad.address }}</p>
            </div>
          </div>
          <div :class="['p-8 border border-[#9B59B6]/20 hover:border-[#9B59B6]/50 transition-all duration-300 bg-[#1a1a2e]/50 backdrop-blur-sm rounded-lg', isVisible('event') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" style="transition-delay: 0.2s;">
            <div class="flex items-center gap-3 mb-4">
              <Star class="w-5 h-5 text-[#9B59B6]" />
              <h3 class="text-xl font-serif text-[#E8D5E5]">{{ eventLocations.resepsi.title }}</h3>
            </div>
            <div class="space-y-3 text-[#E8D5E5]/70">
              <div class="flex items-center gap-2"><Clock class="w-4 h-4" /><span>{{ eventLocations.resepsi.time }}</span></div>
              <div class="flex items-center gap-2"><MapPin class="w-4 h-4" /><span>{{ eventLocations.resepsi.location }}</span></div>
              <p class="text-sm">{{ eventLocations.resepsi.address }}</p>
            </div>
          </div>
        </div>
        <div :class="['mt-12 text-center transition-all duration-700', isVisible('event') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" style="transition-delay: 0.4s;">
          <button @click="addToCalendar" class="px-8 py-3 bg-[#9B59B6] text-white hover:bg-[#8E44AD] transition-colors tracking-widest text-sm rounded">
            ADD TO CALENDAR
          </button>
        </div>
      </div>
    </section>

    <!-- Gift Section -->
    <section id="gift" class="py-24 px-6 bg-[#16213e]/30">
      <div class="max-w-4xl mx-auto">
        <div :class="['text-center mb-16 transition-all duration-700', isVisible('gift') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#9B59B6]/70 mb-4">Hadiah</p>
          <h2 class="text-4xl font-serif text-[#E8D5E5]">Wedding Gift</h2>
        </div>
        <div class="flex justify-center mb-8">
          <div class="flex gap-2">
            <button @click="activeTab = 'bank'" :class="['px-6 py-2 text-sm tracking-widest transition-colors rounded', activeTab === 'bank' ? 'bg-[#9B59B6] text-white' : 'bg-[#1a1a2e] border border-[#9B59B6]/30']">BANK TRANSFER</button>
            <button @click="activeTab = 'digital'" :class="['px-6 py-2 text-sm tracking-widest transition-colors rounded', activeTab === 'digital' ? 'bg-[#9B59B6] text-white' : 'bg-[#1a1a2e] border border-[#9B59B6]/30']">DIGITAL WALLET</button>
          </div>
        </div>
        <div v-if="activeTab === 'bank'" class="grid md:grid-cols-2 gap-6">
          <div v-for="(account, index) in accounts" :key="account.bank" :class="['p-6 bg-[#1a1a2e] border border-[#9B59B6]/20 transition-all duration-500 rounded', isVisible('gift') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" :style="{ transitionDelay: index * 0.1 + 's' }">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 bg-[#9B59B6] text-white flex items-center justify-center font-serif">{{ account.logo }}</div>
              <span class="font-serif text-[#E8D5E5]">{{ account.bank }}</span>
            </div>
            <p class="text-lg mb-1 text-[#E8D5E5]">{{ account.number }}</p>
            <p class="text-[#9B59B6]/70 text-sm mb-4">{{ account.owner }}</p>
            <button @click="copyToClipboard(account.number, index)" class="w-full py-2 border border-[#9B59B6]/30 hover:border-[#9B59B6]/60 transition-colors text-sm flex items-center justify-center gap-2 rounded">
              <Check v-if="copiedIndex === index" class="w-4 h-4" />
              <Copy v-else class="w-4 h-4" />
              {{ copiedIndex === index ? 'Copied!' : 'Copy Number' }}
            </button>
          </div>
        </div>
        <div v-else class="grid md:grid-cols-2 gap-6">
          <div v-for="(qr, index) in qrCodes" :key="qr.bank" :class="['p-6 bg-[#1a1a2e] border border-[#9B59B6]/20 text-center transition-all duration-500 rounded', isVisible('gift') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']" :style="{ transitionDelay: index * 0.1 + 's' }">
            <div class="w-16 h-16 bg-[#9B59B6] text-white flex items-center justify-center text-2xl font-serif mx-auto mb-4">{{ qr.logo }}</div>
            <p class="text-lg font-medium text-[#E8D5E5]">{{ qr.bank }}</p>
            <p class="text-[#9B59B6]/70 text-sm mb-4">{{ qr.number }}</p>
            <button @click="copyQrToClipboard(qr.number, index)" class="w-full py-2 border border-[#9B59B6]/30 hover:border-[#9B59B6]/60 transition-colors text-sm flex items-center justify-center gap-2 rounded">
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
          <p class="text-sm tracking-[0.3em] uppercase text-[#9B59B6]/70 mb-4">Konfirmasi</p>
          <h2 class="text-4xl font-serif text-[#E8D5E5]">RSVP</h2>
          <p class="text-[#E8D5E5]/70 mt-4">Mohon konfirmasi kehadiran Anda sebelum 1 Juni 2026</p>
        </div>
        <div :class="['transition-all duration-700', isVisible('rsvp') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <form class="space-y-6" @submit.prevent>
            <div>
              <label class="block text-sm text-[#9B59B6]/70 mb-2">Nama Tamu<input type="text" :value="guestName" class="w-full p-4 border border-[#9B59B6]/30 focus:border-[#9B59B6]/60 outline-none transition-colors bg-[#1a1a2e]/50 rounded" /></label>
            </div>
            <div>
              <label class="block text-sm text-[#9B59B6]/70 mb-2">Jumlah Tamu<select class="w-full p-4 border border-[#9B59B6]/30 focus:border-[#9B59B6]/60 outline-none transition-colors bg-[#1a1a2e]/50 rounded">
                <option>1 Orang</option>
                <option>2 Orang</option>
                <option>3 Orang</option>
                <option>4 Orang</option>
              </select>
            </label>
            </div>
            <div>
              <p class="block text-sm text-[#9B59B6]/70 mb-2">Konfirmasi Kehadiran</p>
              <div class="grid grid-cols-3 gap-4">
                <button type="button" class="p-4 border border-[#9B59B6]/30 hover:border-[#9B59B6]/60 transition-colors text-center rounded">
                  <Heart class="w-6 h-6 mx-auto mb-2 text-[#9B59B6]" />
                  <span class="text-sm">Hadir</span>
                </button>
                <button type="button" class="p-4 border border-[#9B59B6]/30 hover:border-[#9B59B6]/60 transition-colors text-center rounded">
                  <MessageSquare class="w-6 h-6 mx-auto mb-2 text-[#9B59B6]" />
                  <span class="text-sm">Ragu</span>
                </button>
                <button type="button" class="p-4 border border-[#9B59B6]/30 hover:border-[#9B59B6]/60 transition-colors text-center rounded">
                  <X class="w-6 h-6 mx-auto mb-2 text-[#9B59B6]" />
                  <span class="text-sm">Tidak Hadir</span>
                </button>
              </div>
            </div>
            <button type="submit" class="w-full py-4 bg-[#9B59B6] text-white hover:bg-[#8E44AD] transition-colors tracking-widest text-sm rounded">
              KIRIM RSVP
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-6 bg-[#0f3460] text-[#E8D5E5] text-center border-t border-[#9B59B6]/20">
      <Sparkles class="w-8 h-8 mx-auto mb-4 text-[#9B59B6]" />
      <p class="text-lg font-serif tracking-widest mb-4">{{ props.groom }} & {{ props.bride }}</p>
      <p class="text-[#9B59B6]/70 text-sm">Terima kasih atas doa dan restunya</p>
    </footer>

    <!-- Lightbox -->
    <div v-if="showLightbox" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 cursor-zoom-out animate-fadeIn" @click="closeLightbox">
      <NuxtImg :src="selectedImage" class="max-w-full max-h-full object-contain" />
      <button @click="closeLightbox" class="absolute top-6 right-6 p-2 text-white hover:text-[#9B59B6]">
        <X class="w-8 h-8" />
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Montserrat:wght@300;400;500&display=swap');

.font-sans { font-family: 'Montserrat', sans-serif; }
.font-serif { font-family: 'Cinzel', serif; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideDown { from { opacity: 0; max-height: 0; } to { opacity: 1; max-height: 300px; } }
@keyframes bounce { 0%, 100% { transform: translateY(0) translateX(-50%); } 50% { transform: translateY(-10px) translateX(-50%); } }
@keyframes sparkle { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } }
@keyframes spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }

.animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
.animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
.animate-slideDown { animation: slideDown 0.3s ease-out forwards; }
.animate-bounce { animation: bounce 2s infinite; }
.animate-sparkle { animation: sparkle 3s ease-in-out infinite; }
.animate-sparkle-delayed { animation: sparkle 3s ease-in-out infinite; animation-delay: 1.5s; }
.animate-spin { animation: spin 30s linear infinite; transform-origin: center; }
</style>
