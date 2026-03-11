<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { tropicalParadiseData } from '~/composables/useData'
import { ZoomIn, Copy, Check, Heart, MessageSquare, Clock, MapPin, ChevronDown, X, Palmtree, Sun, Waves, ChevronLeft, ChevronRight } from 'lucide-vue-next'

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

const stories = tropicalParadiseData.stories
const galleryImages = tropicalParadiseData.galleryImages
const accounts = tropicalParadiseData.accounts
const qrCodes = tropicalParadiseData.qrCodes
const eventLocations = tropicalParadiseData.eventLocations

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

// Gallery Swipe/Carousel
const currentSlide = ref(0)
const touchStartX = ref(0)
const touchEndX = ref(0)
const isDragging = ref(false)

const openLightboxAtIndex = (index: number) => {
  currentSlide.value = index
  selectedImage.value = images.value[index] || ''
  showLightbox.value = true
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % images.value.length
  selectedImage.value = images.value[currentSlide.value] || ''
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + images.value.length) % images.value.length
  selectedImage.value = images.value[currentSlide.value] || ''
}

const goToSlide = (index: number) => {
  currentSlide.value = index
  selectedImage.value = images.value[index] || ''
}

// Touch/Swipe handling
const handleTouchStart = (e: TouchEvent) => {
  if (!e.changedTouches?.[0]) return
  touchStartX.value = e.changedTouches[0].screenX
  isDragging.value = true
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || !e.changedTouches?.[0]) return
  touchEndX.value = e.changedTouches[0].screenX
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  const swipeThreshold = 50
  const diff = touchStartX.value - touchEndX.value
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }
  isDragging.value = false
}

const scrollToSection = (id: string) => {
  showMenu.value = false
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const isVisible = (id: string) => visibleSections.value.has(id)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#87CEEB] via-[#98D8C8] to-[#F7DC6F] text-[#2C3E50] font-sans">
    <!-- Background Elements -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute top-10 left-10 text-[#228B22] opacity-30 animate-sway">
        <Palmtree class="w-32 h-32" />
      </div>
      <div class="absolute top-40 right-20 text-[#FF6B35] opacity-30 animate-sway-delayed">
        <Sun class="w-24 h-24" />
      </div>
      <div class="absolute bottom-20 left-1/4 text-[#228B22] opacity-25 animate-sway">
        <Palmtree class="w-24 h-24" />
      </div>
    </div>

    <!-- Hero Section -->
    <section id="hero" class="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-[#87CEEB]/50 via-[#98D8C8]/50 to-[#F7DC6F]/50"></div>
      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#98D8C8] to-transparent"></div>
      <div class="relative z-10 text-center px-6">
        <div class="animate-fadeInUp">
          <p class="text-sm tracking-[0.4em] uppercase text-[#2C3E50]/70 mb-4">The Wedding Of</p>
        </div>
        <div class="animate-fadeInUp" style="animation-delay: 0.2s;">
          <Palmtree class="w-16 h-16 mx-auto mb-6 text-[#228B22]" />
          <h1 class="text-5xl md:text-7xl font-bold mb-6 text-[#2C3E50]">{{ props.groom }} <span
              class="text-[#FF6B35]/60">&</span> {{ props.bride }}</h1>
        </div>
        <div class="animate-fadeInUp" style="animation-delay: 0.4s;">
          <p class="text-lg text-[#2C3E50]/70 mb-8">{{ formattedDate }}</p>
        </div>
        <div class="animate-fadeIn" style="animation-delay: 0.6s;">
          <div class="flex flex-col items-center gap-2">
            <p class="text-sm text-[#2C3E50]/50">Kepada Yth.</p>
            <p class="text-xl font-bold text-[#2C3E50]">{{ guestName }}</p>
          </div>
        </div>
      </div>
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <button @click="scrollToSection('couple')"
          class="p-3 rounded-full bg-white/50 hover:bg-white/80 transition-colors">
          <ChevronDown class="w-6 h-6 text-[#2C3E50]" />
        </button>
      </div>
    </section>

    <!-- Couple Section -->
    <section id="couple" class="py-24 px-6 relative">
      <div class="max-w-4xl mx-auto">
        <div
          :class="['text-center mb-16 transition-all duration-700', isVisible('couple') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#2C3E50]/70 mb-4">Mempelai</p>
          <h2 class="text-4xl font-bold text-[#2C3E50]">Couple</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-16">
          <div
            :class="['text-center transition-all duration-700 delay-100', isVisible('couple') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10']">
            <div class="aspect-[3/4] bg-white/50 mb-6 overflow-hidden rounded-2xl shadow-lg">
              <NuxtImg src="https://picsum.photos/seed/groom5/600/800" alt="Groom" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-2xl font-bold mb-2 text-[#2C3E50]">{{ props.groom }}</h3>
            <p class="text-[#2C3E50]/70">Putra dari Bpk. Heru & Ibu Siti</p>
          </div>
          <div
            :class="['text-center transition-all duration-700 delay-200', isVisible('couple') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10']">
            <div class="aspect-[3/4] bg-white/50 mb-6 overflow-hidden rounded-2xl shadow-lg">
              <NuxtImg src="https://picsum.photos/seed/bride5/600/800" alt="Bride" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-2xl font-bold mb-2 text-[#2C3E50]">{{ props.bride }}</h3>
            <p class="text-[#2C3E50]/70">Putri dari Bpk. Ahmad & Ibu Aminah</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Countdown Section -->
    <section class="py-20 px-6 bg-[#2C3E50] text-white">
      <div class="max-w-3xl mx-auto">
        <div
          :class="['text-center mb-12 transition-all duration-700', isVisible('couple') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#F7DC6F] mb-4">Hitung Mundur</p>
          <h2 class="text-3xl font-bold">Menuju Hari Bahagia</h2>
        </div>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="(item, key) in timeLeft" :key="key"
            :class="['text-center p-6 bg-white/10 border border-white/20 transition-all duration-500', isVisible('couple') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
            :style="{ transitionDelay: ['days', 'hours', 'minutes', 'seconds'].indexOf(key) * 0.1 + 's' }">
            <div class="text-4xl font-bold mb-2 text-[#F7DC6F]">{{ formatNumber(item as number) }}</div>
            <div class="text-xs tracking-[0.2em] uppercase text-white/70">{{ key }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section id="story" class="py-24 px-6 relative">
      <div class="max-w-4xl mx-auto relative">
        <div
          :class="['text-center mb-16 transition-all duration-700', isVisible('story') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#2C3E50]/70 mb-4">Kisah Cinta</p>
          <h2 class="text-4xl font-bold text-[#2C3E50]">Our Story</h2>
        </div>
        <div class="relative">
          <div class="absolute left-1/2 -translate-x-1/2 w-px h-full bg-[#2C3E50]/20"></div>
          <div class="space-y-16">
            <div v-for="(story, index) in coupleStories" :key="index"
              :class="['flex transition-all duration-700', story.isLeft ? 'justify-start pr-12' : 'justify-end pl-12', isVisible('story') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
              :style="{ transitionDelay: index * 0.15 + 's' }">
              <div class="max-w-sm w-1/2">
                <div
                  class="w-12 h-12 bg-[#FF6B35] text-white rounded-full flex items-center justify-center text-sm font-bold mb-4">
                  {{ story.number }}</div>
                <p class="text-sm text-[#2C3E50]/70 mb-2">{{ story.year }}</p>
                <h3 class="text-xl font-bold mb-2 text-[#2C3E50]">{{ story.title }}</h3>
                <p class="text-[#2C3E50]/70 leading-relaxed">{{ story.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section with Swipe -->
    <section id="gallery" class="py-24 px-6 bg-white/30">
      <div class="max-w-6xl mx-auto">
        <div
          :class="['text-center mb-16 transition-all duration-700', isVisible('gallery') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#2C3E50]/70 mb-4">Kenangan</p>
          <h2 class="text-4xl font-bold text-[#2C3E50]">Gallery</h2>
        </div>
        
        <!-- Swipe Carousel -->
        <div 
          class="relative overflow-hidden rounded-3xl"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div 
            class="flex transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }"
          >
            <div 
              v-for="(img, index) in images.slice(0, 9)" 
              :key="index"
              class="w-1/3 flex-shrink-0 px-2"
            >
              <div 
                :class="['aspect-square rounded-2xl overflow-hidden cursor-pointer group transition-all duration-700 shadow-lg', isVisible('gallery') ? 'opacity-100 scale-100' : 'opacity-0 scale-90']"
                @click="openLightboxAtIndex(index)"
              >
                <NuxtImg :src="img" :alt="`Gallery ${index + 1}`"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div
                  class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <ZoomIn class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Navigation Arrows -->
          <button 
            @click.stop="prevSlide"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all z-10"
          >
            <ChevronLeft :size="20" />
          </button>
          <button 
            @click.stop="nextSlide"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all z-10"
          >
            <ChevronRight :size="20" />
          </button>
        </div>
        
        <!-- Slide Indicators -->
        <div class="flex justify-center gap-2 mt-6">
          <button 
            v-for="(_, index) in Math.min(images.slice(0, 9).length, 6)" 
            :key="index"
            @click="goToSlide(index)"
            :class="[
              'w-2 h-2 rounded-full transition-all duration-300',
              currentSlide === index ? 'w-8 bg-[#FF6B35]' : 'bg-[#2C3E50]/30 hover:bg-[#2C3E50]/50'
            ]"
          />
        </div>
      </div>
    </section>

    <!-- Event Section -->
    <section id="event" class="py-24 px-6 relative">
      <div class="max-w-4xl mx-auto">
        <div
          :class="['text-center mb-16 transition-all duration-700', isVisible('event') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#2C3E50]/70 mb-4">Jadwal</p>
          <h2 class="text-4xl font-bold text-[#2C3E50]">Wedding Event</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-8">
          <div
            :class="['p-8 border border-[#2C3E50]/20 hover:border-[#FF6B35]/50 transition-all duration-300 bg-white/50 backdrop-blur-sm rounded-xl', isVisible('event') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
            style="transition-delay: 0.1s;">
            <div class="flex items-center gap-3 mb-4">
              <Sun class="w-5 h-5 text-[#FF6B35]" />
              <h3 class="text-xl font-bold text-[#2C3E50]">{{ eventLocations.akad.title }}</h3>
            </div>
            <div class="space-y-3 text-[#2C3E50]/70">
              <div class="flex items-center gap-2">
                <Clock class="w-4 h-4" /><span>{{ eventLocations.akad.time }}</span>
              </div>
              <div class="flex items-center gap-2">
                <MapPin class="w-4 h-4" /><span>{{ eventLocations.akad.location }}</span>
              </div>
              <p class="text-sm">{{ eventLocations.akad.address }}</p>
            </div>
          </div>
          <div
            :class="['p-8 border border-[#2C3E50]/20 hover:border-[#FF6B35]/50 transition-all duration-300 bg-white/50 backdrop-blur-sm rounded-xl', isVisible('event') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
            style="transition-delay: 0.2s;">
            <div class="flex items-center gap-3 mb-4">
              <Waves class="w-5 h-5 text-[#FF6B35]" />
              <h3 class="text-xl font-bold text-[#2C3E50]">{{ eventLocations.resepsi.title }}</h3>
            </div>
            <div class="space-y-3 text-[#2C3E50]/70">
              <div class="flex items-center gap-2">
                <Clock class="w-4 h-4" /><span>{{ eventLocations.resepsi.time }}</span>
              </div>
              <div class="flex items-center gap-2">
                <MapPin class="w-4 h-4" /><span>{{ eventLocations.resepsi.location }}</span>
              </div>
              <p class="text-sm">{{ eventLocations.resepsi.address }}</p>
            </div>
          </div>
        </div>
        <div
          :class="['mt-12 text-center transition-all duration-700', isVisible('event') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
          style="transition-delay: 0.4s;">
          <button @click="addToCalendar"
            class="px-8 py-3 bg-[#FF6B35] text-white hover:bg-[#E55A2B] transition-colors tracking-widest text-sm font-bold rounded-full">
            ADD TO CALENDAR
          </button>
        </div>
      </div>
    </section>

    <!-- Gift Section -->
    <section id="gift" class="py-24 px-6 bg-white/30">
      <div class="max-w-4xl mx-auto">
        <div
          :class="['text-center mb-16 transition-all duration-700', isVisible('gift') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#2C3E50]/70 mb-4">Hadiah</p>
          <h2 class="text-4xl font-bold text-[#2C3E50]">Wedding Gift</h2>
        </div>
        <div class="flex justify-center mb-8">
          <div class="flex gap-2">
            <button @click="activeTab = 'bank'"
              :class="['px-6 py-2 text-sm tracking-widest transition-colors rounded-full', activeTab === 'bank' ? 'bg-[#FF6B35] text-white' : 'bg-white border border-[#2C3E50]/30']">BANK
              TRANSFER</button>
            <button @click="activeTab = 'digital'"
              :class="['px-6 py-2 text-sm tracking-widest transition-colors rounded-full', activeTab === 'digital' ? 'bg-[#FF6B35] text-white' : 'bg-white border border-[#2C3E50]/30']">DIGITAL
              WALLET</button>
          </div>
        </div>
        <div v-if="activeTab === 'bank'" class="grid md:grid-cols-2 gap-6">
          <div v-for="(account, index) in accounts" :key="account.bank"
            :class="['p-6 bg-white border border-[#2C3E50]/20 transition-all duration-500 rounded-xl', isVisible('gift') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
            :style="{ transitionDelay: index * 0.1 + 's' }">
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 bg-[#FF6B35] text-white flex items-center justify-center font-bold">{{ account.logo
                }}</div>
              <span class="font-bold text-[#2C3E50]">{{ account.bank }}</span>
            </div>
            <p class="text-lg mb-1 text-[#2C3E50]">{{ account.number }}</p>
            <p class="text-[#2C3E50]/70 text-sm mb-4">{{ account.owner }}</p>
            <button @click="copyToClipboard(account.number, index)"
              class="w-full py-2 border border-[#2C3E50]/30 hover:border-[#FF6B35] transition-colors text-sm flex items-center justify-center gap-2 rounded-full">
              <Check v-if="copiedIndex === index" class="w-4 h-4" />
              <Copy v-else class="w-4 h-4" />
              {{ copiedIndex === index ? 'Copied!' : 'Copy Number' }}
            </button>
          </div>
        </div>
        <div v-else class="grid md:grid-cols-2 gap-6">
          <div v-for="(qr, index) in qrCodes" :key="qr.bank"
            :class="['p-6 bg-white border border-[#2C3E50]/20 text-center transition-all duration-500 rounded-xl', isVisible('gift') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
            :style="{ transitionDelay: index * 0.1 + 's' }">
            <div
              class="w-16 h-16 bg-[#FF6B35] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {{ qr.logo }}</div>
            <p class="text-lg font-bold text-[#2C3E50]">{{ qr.bank }}</p>
            <p class="text-[#2C3E50]/70 text-sm mb-4">{{ qr.number }}</p>
            <button @click="copyQrToClipboard(qr.number, index)"
              class="w-full py-2 border border-[#2C3E50]/30 hover:border-[#FF6B35] transition-colors text-sm flex items-center justify-center gap-2 rounded-full">
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
        <div
          :class="['text-center mb-16 transition-all duration-700', isVisible('rsvp') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <p class="text-sm tracking-[0.3em] uppercase text-[#2C3E50]/70 mb-4">Konfirmasi</p>
          <h2 class="text-4xl font-bold text-[#2C3E50]">RSVP</h2>
          <p class="text-[#2C3E50]/70 mt-4">Mohon konfirmasi kehadiran Anda sebelum 1 Juni 2026</p>
        </div>
        <div
          :class="['transition-all duration-700', isVisible('rsvp') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']">
          <form class="space-y-6" @submit.prevent>
            <div>
              <label class="block text-sm text-[#2C3E50]/70 mb-2">Nama Tamu<input type="text" :value="guestName"
                  class="w-full p-4 border border-[#2C3E50]/30 focus:border-[#FF6B35] outline-none transition-colors bg-white/50 rounded-xl" /></label>
            </div>
            <div>
              <label class="block text-sm text-[#2C3E50]/70 mb-2">Jumlah Tamu
                <select
                  class="w-full p-4 border border-[#2C3E50]/30 focus:border-[#FF6B35] outline-none transition-colors bg-white/50 rounded-xl">
                  <option>1 Orang</option>
                  <option>2 Orang</option>
                  <option>3 Orang</option>
                  <option>4 Orang</option>
                </select>
              </label>
            </div>
            <div>
              <p class="block text-sm text-[#2C3E50]/70 mb-2">Konfirmasi Kehadiran</p>
              <div class="grid grid-cols-3 gap-4">
                <button type="button"
                  class="p-4 border border-[#2C3E50]/30 hover:border-[#FF6B35] transition-colors text-center rounded-xl">
                  <Heart class="w-6 h-6 mx-auto mb-2 text-[#FF6B35]" />
                  <span class="text-sm">Hadir</span>
                </button>
                <button type="button"
                  class="p-4 border border-[#2C3E50]/30 hover:border-[#FF6B35] transition-colors text-center rounded-xl">
                  <MessageSquare class="w-6 h-6 mx-auto mb-2 text-[#FF6B35]" />
                  <span class="text-sm">Ragu</span>
                </button>
                <button type="button"
                  class="p-4 border border-[#2C3E50]/30 hover:border-[#FF6B35] transition-colors text-center rounded-xl">
                  <X class="w-6 h-6 mx-auto mb-2 text-[#FF6B35]" />
                  <span class="text-sm">Tidak Hadir</span>
                </button>
              </div>
            </div>
            <button type="submit"
              class="w-full py-4 bg-[#FF6B35] text-white hover:bg-[#E55A2B] transition-colors tracking-widest text-sm font-bold rounded-full">
              KIRIM RSVP
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-6 bg-[#2C3E50] text-white text-center">
      <Palmtree class="w-8 h-8 mx-auto mb-4 text-[#228B22]" />
      <p class="text-lg font-bold tracking-widest mb-4">{{ props.groom }} & {{ props.bride }}</p>
      <p class="text-white/70 text-sm">Terima kasih atas doa dan restunya</p>
    </footer>

    <!-- Lightbox -->
    <div v-if="showLightbox"
      class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 cursor-zoom-out animate-fadeIn"
      @click="closeLightbox">
      <NuxtImg :src="selectedImage" class="max-w-full max-h-full object-contain" />
      <button @click="closeLightbox" class="absolute top-6 right-6 p-2 text-white hover:text-[#FF6B35]">
        <X class="w-8 h-8" />
      </button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.font-sans {
  font-family: 'Poppins', sans-serif;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
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

@keyframes sway {

  0%,
  100% {
    transform: rotate(-5deg);
  }

  50% {
    transform: rotate(5deg);
  }
}

@keyframes bounce {

  0%,
  100% {
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

.animate-sway {
  animation: sway 4s ease-in-out infinite;
}

.animate-sway-delayed {
  animation: sway 4s ease-in-out infinite;
  animation-delay: 2s;
}
</style>
