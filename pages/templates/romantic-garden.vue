<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ZoomIn, Copy, Check, Heart, MessageSquare, Clock, MapPin, ChevronDown, X, Flower2, Sun, Moon } from 'lucide-vue-next'
import { Motion, AnimatePresence } from 'motion-v'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import { romanticGardenData } from '~/composables/useData'

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

// Use template-specific data from useData.ts
const stories = romanticGardenData.stories
const galleryImages = romanticGardenData.galleryImages
const accounts = romanticGardenData.accounts
const qrCodes = romanticGardenData.qrCodes
const eventLocations = romanticGardenData.eventLocations

const guestName = ref("Tamu Undangan")
const showMenu = ref(false)
const selectedImage = ref('')
const showLightbox = ref(false)
const copiedIndex = ref<number | null>(null)
const copiedQrIndex = ref<number | null>(null)
const activeTab = ref<'bank' | 'digital'>('bank')
const visibleSections = ref<Set<string>>(new Set())

// Swiper modules
const swiperModules = [Navigation, Pagination, Autoplay, EffectCoverflow]

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
  <div class="min-h-screen bg-[#F8F5F0] text-[#2D4A3E] font-sans">
    <!-- Floating Flowers Background -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute top-20 left-10 text-[#5D8A66] opacity-20 animate-float">
        <Flower2 class="w-24 h-24" />
      </div>
      <div class="absolute top-40 right-20 text-[#7BA05B] opacity-20 animate-float-delayed">
        <Flower2 class="w-32 h-32" />
      </div>
      <div class="absolute bottom-40 left-20 text-[#5D8A66] opacity-15 animate-float">
        <Flower2 class="w-28 h-28" />
      </div>
      <div class="absolute bottom-20 right-10 text-[#7BA05B] opacity-20 animate-float-delayed">
        <Flower2 class="w-20 h-20" />
      </div>
    </div>

    <!-- Hero Section -->
    <section id="hero" class="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-[#F8F5F0] via-[#F0EBE3] to-[#E8E2D9]"></div>
      <div class="absolute inset-0">
        <div class="absolute top-10 left-1/4 w-64 h-64 bg-[#5D8A66]/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-10 right-1/4 w-96 h-96 bg-[#7BA05B]/10 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 1s;"></div>
      </div>
      <div class="relative z-10 text-center px-6">
        <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.8 }">
          <p class="text-sm tracking-[0.4em] uppercase text-[#5D8A66]/70 mb-4">The Wedding Of</p>
        </Motion>
        <Motion :initial="{ opacity: 0, scale: 0.9 }" :animate="{ opacity: 1, scale: 1 }"
          :transition="{ duration: 1, delay: 0.2 }">
          <h1 class="text-5xl md:text-7xl font-serif mb-6">{{ props.groom }} <span class="text-[#5D8A66]/40">&</span> {{
            props.bride }}</h1>
          props.bride }}
        </Motion>
        <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, delay: 0.4 }">
          <p class="text-lg text-[#2D4A3E]/70 mb-8">{{ formattedDate }}</p>
        </Motion>
        <Motion :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ duration: 0.8, delay: 0.6 }">
          <div class="flex flex-col items-center gap-2">
            <p class="text-sm text-[#5D8A66]/50">Kepada Yth.</p>
            <p class="text-xl font-medium text-[#2D4A3E]">{{ guestName }}</p>
          </div>
        </Motion>
      </div>
      <Motion :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ delay: 1, duration: 1 }"
        class="absolute bottom-10 left-1/2 -translate-x-1/2">
        <button @click="scrollToSection('couple')"
          class="p-3 rounded-full border border-[#5D8A66]/30 hover:border-[#5D8A66]/60 transition-colors">
          <ChevronDown class="w-6 h-6 text-[#5D8A66]" />
        </button>
      </Motion>
    </section>

    <!-- Couple Section -->
    <section id="couple" class="py-24 px-6 relative">
      <div class="max-w-4xl mx-auto">
        <Motion :initial="{ opacity: 0, y: 40 }" :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
          :transition="{ duration: 0.8 }">
          <div class="text-center mb-16">
            <p class="text-sm tracking-[0.3em] uppercase text-[#5D8A66]/70 mb-4">Mempelai</p>
            <h2 class="text-4xl font-serif text-[#2D4A3E]">Couple</h2>
            <div class="flex justify-center mt-4">
              <Flower2 class="w-8 h-8 text-[#5D8A66]/50" />
            </div>
          </div>
        </Motion>
        <div class="grid md:grid-cols-2 gap-16">
          <Motion :initial="{ opacity: 0, x: -40 }" :whileInView="{ opacity: 1, x: 0 }" :viewport="{ once: true }"
            :transition="{ duration: 0.8 }">
            <div class="text-center">
              <div class="aspect-[3/4] bg-[#E8E2D9] mb-6 overflow-hidden rounded-t-full">
                <NuxtImg src="https://picsum.photos/seed/groom2/600/800" alt="Groom"
                  class="w-full h-full object-cover" />
              </div>
              <h3 class="text-2xl font-serif mb-2 text-[#2D4A3E]">{{ props.groom }}</h3>
              <p class="text-[#5D8A66]/70">Putra dari Bpk. Heru & Ibu Siti</p>
            </div>
          </Motion>
          <Motion :initial="{ opacity: 0, x: 40 }" :whileInView="{ opacity: 1, x: 0 }" :viewport="{ once: true }"
            :transition="{ duration: 0.8, delay: 0.2 }">
            <div class="text-center">
              <div class="aspect-[3/4] bg-[#E8E2D9] mb-6 overflow-hidden rounded-t-full">
                <NuxtImg src="https://picsum.photos/seed/bride2/600/800" alt="Bride"
                  class="w-full h-full object-cover" />
              </div>
              <h3 class="text-2xl font-serif mb-2 text-[#2D4A3E]">{{ props.bride }}</h3>
              <p class="text-[#5D8A66]/70">Putri dari Bpk. Ahmad & Ibu Aminah</p>
            </div>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Countdown Section -->
    <section class="py-20 px-6 bg-[#2D4A3E] text-[#F8F5F0]">
      <div class="max-w-3xl mx-auto">
        <Motion :initial="{ opacity: 0, y: 30 }" :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
          :transition="{ duration: 0.8 }">
          <div class="text-center mb-12">
            <p class="text-sm tracking-[0.3em] uppercase text-[#7BA05B] mb-4">Hitung Mundur</p>
            <h2 class="text-3xl font-serif">Menuju Hari Bahagia</h2>
          </div>
        </Motion>
        <div class="grid grid-cols-4 gap-4">
          <Motion v-for="(item, key) in timeLeft" :key="key" :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
            :transition="{ duration: 0.5, delay: ['days', 'hours', 'minutes', 'seconds'].indexOf(key) * 0.1 }">
            <div class="text-center p-6 bg-[#F8F5F0]/5 border border-[#7BA05B]/30">
              <div class="text-4xl font-serif mb-2">{{ formatNumber(item as number) }}</div>
              <div class="text-xs tracking-[0.2em] uppercase text-[#7BA05B]">{{ key }}</div>
            </div>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Story Section -->
    <section id="story" class="py-24 px-6 relative">
      <div class="max-w-4xl mx-auto relative">
        <Motion :initial="{ opacity: 0, y: 40 }" :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
          :transition="{ duration: 0.8 }">
          <div class="text-center mb-16">
            <p class="text-sm tracking-[0.3em] uppercase text-[#5D8A66]/70 mb-4">Kisah Cinta</p>
            <h2 class="text-4xl font-serif text-[#2D4A3E]">Our Story</h2>
          </div>
        </Motion>
        <div class="relative">
          <div class="absolute left-1/2 -translate-x-1/2 w-px h-full bg-[#5D8A66]/20"></div>
          <div class="space-y-16">
            <Motion v-for="(story, index) in coupleStories" :key="index" :initial="{ opacity: 0, y: 30 }"
              :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
              :transition="{ duration: 0.6, delay: index * 0.15 }">
              <div :class="['flex', story.isLeft ? 'justify-start pr-12' : 'justify-end pl-12']">
                <div class="max-w-sm w-1/2">
                  <div
                    class="w-12 h-12 bg-[#5D8A66] text-white rounded-full flex items-center justify-center text-sm font-serif mb-4">
                    {{ story.number }}</div>
                  <p class="text-sm text-[#5D8A66]/70 mb-2">{{ story.year }}</p>
                  <h3 class="text-xl font-serif mb-2 text-[#2D4A3E]">{{ story.title }}</h3>
                  <p class="text-[#2D4A3E]/70 leading-relaxed">{{ story.desc }}</p>
                </div>
              </div>
            </Motion>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section with Swiper -->
    <section id="gallery" class="py-24 px-6 bg-[#E8E2D9]/30">
      <div class="max-w-6xl mx-auto">
        <Motion :initial="{ opacity: 0, y: 40 }" :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
          :transition="{ duration: 0.8 }">
          <div class="text-center mb-16">
            <p class="text-sm tracking-[0.3em] uppercase text-[#5D8A66]/70 mb-4">Kenangan</p>
            <h2 class="text-4xl font-serif text-[#2D4A3E]">Gallery</h2>
          </div>
        </Motion>

        <!-- Swiper Gallery with Coverflow Effect -->
        <Swiper :modules="swiperModules" :effect="'coverflow'" :grabCursor="true" :centeredSlides="true"
          :slidesPerView="'auto'" :coverflowEffect="{
            rotate: 10,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
          }" :pagination="{ clickable: true }" :autoplay="{ delay: 3000, disableOnInteraction: false }"
          :navigation="true" class="mySwiper">
          <SwiperSlide v-for="(img, index) in images" :key="index" class="!w-80 !h-96">
            <div class="w-full h-full overflow-hidden rounded-lg cursor-pointer group" @click="openLightbox(img)">
              <NuxtImg :src="img" :alt="`Gallery ${index + 1}`"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ZoomIn class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>

    <!-- Event Section -->
    <section id="event" class="py-24 px-6 relative">
      <div class="max-w-4xl mx-auto">
        <Motion :initial="{ opacity: 0, y: 40 }" :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
          :transition="{ duration: 0.8 }">
          <div class="text-center mb-16">
            <p class="text-sm tracking-[0.3em] uppercase text-[#5D8A66]/70 mb-4">Jadwal</p>
            <h2 class="text-4xl font-serif text-[#2D4A3E]">Wedding Event</h2>
          </div>
        </Motion>
        <div class="grid md:grid-cols-2 gap-8">
          <Motion :initial="{ opacity: 0, y: 30 }" :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
            :transition="{ duration: 0.6, delay: 0.1 }">
            <div
              class="p-8 border border-[#5D8A66]/20 hover:border-[#5D8A66]/50 transition-all duration-300 bg-white/50 backdrop-blur-sm">
              <div class="flex items-center gap-3 mb-4">
                <Sun class="w-5 h-5 text-[#5D8A66]" />
                <h3 class="text-xl font-serif text-[#2D4A3E]">{{ eventLocations.akad.title }}</h3>
              </div>
              <div class="space-y-3 text-[#2D4A3E]/70">
                <div class="flex items-center gap-2">
                  <Clock class="w-4 h-4" /><span>{{ eventLocations.akad.time }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <MapPin class="w-4 h-4" /><span>{{ eventLocations.akad.location }}</span>
                </div>
                <p class="text-sm">{{ eventLocations.akad.address }}</p>
              </div>
            </div>
          </Motion>
          <Motion :initial="{ opacity: 0, y: 30 }" :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
            :transition="{ duration: 0.6, delay: 0.2 }">
            <div
              class="p-8 border border-[#5D8A66]/20 hover:border-[#5D8A66]/50 transition-all duration-300 bg-white/50 backdrop-blur-sm">
              <div class="flex items-center gap-3 mb-4">
                <Moon class="w-5 h-5 text-[#5D8A66]" />
                <h3 class="text-xl font-serif text-[#2D4A3E]">{{ eventLocations.resepsi.title }}</h3>
              </div>
              <div class="space-y-3 text-[#2D4A3E]/70">
                <div class="flex items-center gap-2">
                  <Clock class="w-4 h-4" /><span>{{ eventLocations.resepsi.time }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <MapPin class="w-4 h-4" /><span>{{ eventLocations.resepsi.location }}</span>
                </div>
                <p class="text-sm">{{ eventLocations.resepsi.address }}</p>
              </div>
            </div>
          </Motion>
        </div>
        <Motion :initial="{ opacity: 0 }" :whileInView="{ opacity: 1 }" :viewport="{ once: true }"
          :transition="{ duration: 0.8, delay: 0.4 }" class="mt-12 text-center">
          <button @click="addToCalendar"
            class="px-8 py-3 bg-[#2D4A3E] text-white hover:bg-[#5D8A66] transition-colors tracking-widest text-sm rounded-full">
            ADD TO CALENDAR
          </button>
        </Motion>
      </div>
    </section>

    <!-- Gift Section -->
    <section id="gift" class="py-24 px-6 bg-[#E8E2D9]/30">
      <div class="max-w-4xl mx-auto">
        <Motion :initial="{ opacity: 0, y: 40 }" :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
          :transition="{ duration: 0.8 }">
          <div class="text-center mb-16">
            <p class="text-sm tracking-[0.3em] uppercase text-[#5D8A66]/70 mb-4">Hadiah</p>
            <h2 class="text-4xl font-serif text-[#2D4A3E]">Wedding Gift</h2>
          </div>
        </Motion>
        <div class="flex justify-center mb-8">
          <div class="flex gap-2">
            <button @click="activeTab = 'bank'"
              :class="['px-6 py-2 text-sm tracking-widest transition-colors rounded-full', activeTab === 'bank' ? 'bg-[#2D4A3E] text-white' : 'bg-white border border-[#5D8A66]/30']">BANK
              TRANSFER</button>
            <button @click="activeTab = 'digital'"
              :class="['px-6 py-2 text-sm tracking-widest transition-colors rounded-full', activeTab === 'digital' ? 'bg-[#2D4A3E] text-white' : 'bg-white border border-[#5D8A66]/30']">DIGITAL
              WALLET</button>
          </div>
        </div>
        <div v-if="activeTab === 'bank'" class="grid md:grid-cols-2 gap-6">
          <Motion v-for="(account, index) in accounts" :key="account.bank" :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
            :transition="{ duration: 0.5, delay: index * 0.1 }">
            <div class="p-6 bg-white border border-[#5D8A66]/20">
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 bg-[#5D8A66] text-white flex items-center justify-center font-serif">{{
                  account.logo }}</div>
                <span class="font-serif">{{ account.bank }}</span>
              </div>
              <p class="text-lg mb-1">{{ account.number }}</p>
              <p class="text-[#5D8A66]/70 text-sm mb-4">{{ account.owner }}</p>
              <button @click="copyToClipboard(account.number, index)"
                class="w-full py-2 border border-[#5D8A66]/30 hover:border-[#5D8A66]/60 transition-colors text-sm flex items-center justify-center gap-2 rounded-full">
                <Check v-if="copiedIndex === index" class="w-4 h-4" />
                <Copy v-else class="w-4 h-4" />
                {{ copiedIndex === index ? 'Copied!' : 'Copy Number' }}
              </button>
            </div>
          </Motion>
        </div>
        <div v-else class="grid md:grid-cols-2 gap-6">
          <Motion v-for="(qr, index) in qrCodes" :key="qr.bank" :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
            :transition="{ duration: 0.5, delay: index * 0.1 }">
            <div class="p-6 bg-white border border-[#5D8A66]/20 text-center">
              <div
                class="w-16 h-16 bg-[#5D8A66] text-white flex items-center justify-center text-2xl font-serif mx-auto mb-4">
                {{ qr.logo }}</div>
              <p class="text-lg font-medium">{{ qr.bank }}</p>
              <p class="text-[#5D8A66]/70 text-sm mb-4">{{ qr.number }}</p>
              <button @click="copyQrToClipboard(qr.number, index)"
                class="w-full py-2 border border-[#5D8A66]/30 hover:border-[#5D8A66]/60 transition-colors text-sm flex items-center justify-center gap-2 rounded-full">
                <Check v-if="copiedQrIndex === index" class="w-4 h-4" />
                <Copy v-else class="w-4 h-4" />
                {{ copiedQrIndex === index ? 'Copied!' : 'Copy Number' }}
              </button>
            </div>
          </Motion>
        </div>
      </div>
    </section>

    <!-- RSVP Section -->
    <section id="rsvp" class="py-24 px-6">
      <div class="max-w-2xl mx-auto">
        <Motion :initial="{ opacity: 0, y: 40 }" :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
          :transition="{ duration: 0.8 }">
          <div class="text-center mb-16">
            <p class="text-sm tracking-[0.3em] uppercase text-[#5D8A66]/70 mb-4">Konfirmasi</p>
            <h2 class="text-4xl font-serif text-[#2D4A3E]">RSVP</h2>
            <p class="text-[#2D4A3E]/70 mt-4">Mohon konfirmasi kehadiran Anda sebelum 1 Juni 2026</p>
          </div>
        </Motion>
        <Motion :initial="{ opacity: 0, y: 30 }" :whileInView="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
          :transition="{ duration: 0.6 }">
          <form class="space-y-6" @submit.prevent>
            <div>
              <label class="block text-sm text-[#5D8A66]/70 mb-2">Nama Tamu<input type="text" :value="guestName"
                  class="w-full p-4 border border-[#5D8A66]/30 focus:border-[#5D8A66]/60 outline-none transition-colors bg-white/50" /></label>
            </div>
            <div>
              <label class="block text-sm text-[#5D8A66]/70 mb-2">Jumlah Tamu<select
                  class="w-full p-4 border border-[#5D8A66]/30 focus:border-[#5D8A66]/60 outline-none transition-colors bg-white/50">
                  <option>1 Orang</option>
                  <option>2 Orang</option>
                  <option>3 Orang</option>
                  <option>4 Orang</option>
                </select>
              </label>
            </div>
            <div>
              <p class="block text-sm text-[#5D8A66]/70 mb-2">Konfirmasi Kehadiran</p>
              <div class="grid grid-cols-3 gap-4">
                <button type="button"
                  class="p-4 border border-[#5D8A66]/30 hover:border-[#5D8A66]/60 transition-colors text-center rounded-full">
                  <Heart class="w-6 h-6 mx-auto mb-2 text-[#5D8A66]" />
                  <span class="text-sm">Hadir</span>
                </button>
                <button type="button"
                  class="p-4 border border-[#5D8A66]/30 hover:border-[#5D8A66]/60 transition-colors text-center rounded-full">
                  <MessageSquare class="w-6 h-6 mx-auto mb-2 text-[#5D8A66]" />
                  <span class="text-sm">Ragu</span>
                </button>
                <button type="button"
                  class="p-4 border border-[#5D8A66]/30 hover:border-[#5D8A66]/60 transition-colors text-center rounded-full">
                  <X class="w-6 h-6 mx-auto mb-2 text-[#5D8A66]" />
                  <span class="text-sm">Tidak Hadir</span>
                </button>
              </div>
            </div>
            <button type="submit"
              class="w-full py-4 bg-[#2D4A3E] text-white hover:bg-[#5D8A66] transition-colors tracking-widest text-sm rounded-full">
              KIRIM RSVP
            </button>
          </form>
        </Motion>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-6 bg-[#2D4A3E] text-[#F8F5F0] text-center">
      <p class="text-lg font-serif tracking-widest mb-4">{{ props.groom }} & {{ props.bride }}</p>
      <p class="text-[#7BA05B] text-sm">Terima kasih atas doa dan restunya</p>
      <div class="flex justify-center mt-4">
        <Flower2 class="w-6 h-6 text-[#7BA05B]/50" />
      </div>
    </footer>

    <!-- Lightbox with AnimatePresence -->
    <AnimatePresence>
      <Motion v-if="showLightbox" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }"
        @click="closeLightbox"
        class="fixed inset-0 z-50 bg-[#2D4A3E]/95 flex items-center justify-center p-6 cursor-zoom-out">
        <NuxtImg :src="selectedImage" class="max-w-full max-h-full object-contain" />
        <button @click="closeLightbox" class="absolute top-6 right-6 p-2 text-white hover:text-[#7BA05B]">
          <X class="w-8 h-8" />
        </button>
      </Motion>
    </AnimatePresence>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Montserrat:wght@300;400;500&display=swap');

.font-sans {
  font-family: 'Montserrat', sans-serif;
}

.font-serif {
  font-family: 'Cormorant Garamond', serif;
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

@keyframes float {

  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(5deg);
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

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 6s ease-in-out infinite;
  animation-delay: 3s;
}

/* Swiper Custom Styles */
:deep(.swiper) {
  padding-bottom: 50px !important;
}

:deep(.swiper-slide) {
  width: 320px;
  height: 400px;
}

:deep(.swiper-slide-shadow-left) {
  background-image: none !important;
}

:deep(.swiper-slide-shadow-right) {
  background-image: none !important;
}

:deep(.swiper-pagination-bullet) {
  background: #5D8A66 !important;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #5D8A66 !important;
}
</style>
