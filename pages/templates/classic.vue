<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Send, ZoomIn, MapPin, Copy, Check, Heart, Smartphone, CreditCard, User, MessageCircle, Instagram, Mail, MessageSquare } from 'lucide-vue-next'
import { Motion, AnimatePresence } from 'motion-v'
import { stories, galleryImages, COUPLE, eventLocations, accounts, qrCodes, attendanceOptions } from '~/composables/useData'


const props = defineProps<{
  groom: string
  bride: string
  date: string
  location: string
  mapUrl: string
}>()

const coupleData = COUPLE
const guestName = ref(COUPLE.guestName);

onMounted(() => {
  const params = new URLSearchParams(globalThis.location.search);
  const to = params.get('to');
  if (to) guestName.value = to;
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
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
  const d = new Date(props.date || coupleData.date)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return d.toLocaleDateString('id-ID', options)
})

const eventDetails = eventLocations;

const addToCalendar = () => {
  const start = new Date(props.date).toISOString().replaceAll(/-|:|\.\d+/g, '');
  const end = new Date(new Date(props.date).getTime() + 2 * 60 * 60 * 1000).toISOString().replaceAll(/-|:|\.\d+/g, '');
  const title = `Pernikahan ${props.groom} & ${props.bride}`;
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=Undangan+Pernikahan+${props.groom}+%26+${props.bride}&location=Jakarta`;
  window.open(url, '_blank');
};
// Countdown Timer
const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

let interval: ReturnType<typeof setInterval> | null = null

const targetDate = computed(() => {
  return new Date(props.date || '2026-03-15T10:00:00').getTime()
})

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

onMounted(() => {
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const formatNumber = (num: number) => {
  return num.toString().padStart(2, '0')
}
const selectedImage = ref('');
const showLightbox = ref(false);
const copiedIndex = ref<number | null>(null);
const copiedQrIndex = ref<number | null>(null);
const activeTab = ref<'bank' | 'digital'>('bank');

const copyToClipboard = (text: string, index: number) => {
  navigator.clipboard.writeText(text);
  copiedIndex.value = index;
  setTimeout(() => copiedIndex.value = null, 2000);
};

const copyQrToClipboard = (text: string, index: number) => {
  navigator.clipboard.writeText(text);
  copiedQrIndex.value = index;
  setTimeout(() => copiedQrIndex.value = null, 2000);
};

const formatAccountNumber = (num: string) => {
  return num.replaceAll(/\s/g, '').replaceAll(/(.{4})/g, '$1 ').trim()
};

interface Wish {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

const wishes = ref<Wish[]>([]);
const wishStatus = ref<'idle' | 'loading' | 'success'>('idle');
const rsvpStatus = ref<'idle' | 'loading' | 'success'>('idle');
const selectedAttendance = ref('');
const guestCount = ref(1);

const fetchWishes = async () => {
  try {
    const data = await $fetch<Wish[]>('/api/wishes');
    wishes.value = data;
  } catch (err) {
    console.error(err);
  }
};

const handleWish = async (e: Event) => {
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  wishStatus.value = 'loading';

  try {
    await $fetch('/api/wishes', {
      method: 'POST',
      body: {
        name: formData.get('name'),
        message: formData.get('message')
      }
    });
    wishStatus.value = 'success';
    fetchWishes();
    setTimeout(() => wishStatus.value = 'idle', 3000);
    form.reset();
  } catch (err) {
    wishStatus.value = 'idle';
  }
};
const handleRSVP = async (e: Event) => {
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  rsvpStatus.value = 'loading';

  try {
    await $fetch('/api/rsvp', {
      method: 'POST',
      body: {
        name: formData.get('name'),
        guests: Number.parseInt(formData.get('guests') as string),
        attendance: formData.get('attendance')
      }
    });
    rsvpStatus.value = 'success';
    setTimeout(() => rsvpStatus.value = 'idle', 3000);
    form.reset();
  } catch (err) {
    rsvpStatus.value = 'idle';
  }
};
onMounted(fetchWishes);
</script>
<template>
  <main>
    <div class="fixed inset-0 z-[-1]">
      <NuxtImg src="https://picsum.photos/seed/classic-wedding/1920/1080?blur=2"
        class="w-full h-full object-cover opacity-15" alt="Classic" referrerPolicy="no-referrer">
      </NuxtImg>
    </div>
    <section id="hero" class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute top-8 left-8 w-32 h-32 border-l-2 border-t-2 border-amber-400/40"></div>
        <div class="absolute top-8 right-8 w-32 h-32 border-r-2 border-t-2 border-amber-400/40"></div>
        <div class="absolute bottom-8 left-8 w-32 h-32 border-l-2 border-b-2 border-amber-400/40"></div>
        <div class="absolute bottom-8 right-8 w-32 h-32 border-r-2 border-b-2 border-amber-400/40"></div>
      </div>
      <div class="relative z-10 text-center px-4 max-w-4xl">
        <div class="inline-flex items-center gap-3 mb-8">
          <div class="w-12 h-px bg-gradient-to-r from-transparent to-amber-400"></div>
          <span class="text-amber-600 font-serif italic text-sm sm:text-base tracking-[0.3em] uppercase">Undangan
            Pernikahan</span>
          <div class="w-12 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
        </div>

        <!-- Names with Premium Typography -->
        <h1 class="hero-title font-serif text-5xl sm:text-7xl md:text-8xl text-stone-800 leading-tight mb-6">
          <span class="block font-light tracking-wide">{{ groom }}</span>
          <span class="inline-flex items-center justify-center my-4">
            <span class="w-16 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></span>
            <span class="mx-6 text-amber-500 text-3xl sm:text-4xl">&</span>
            <span class="w-16 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></span>
          </span>
          <span class="block font-light tracking-wide">{{ bride }}</span>
        </h1>

        <!-- Elegant Divider -->
        <div class="flex items-center justify-center gap-4 mb-10">
          <div class="w-8 h-px bg-amber-400"></div>
          <div class="w-2 h-2 rotate-45 bg-amber-400"></div>
          <div class="w-8 h-px bg-amber-400"></div>
        </div>

        <!-- Premium Countdown Timer -->
        <div class="mb-10">
          <p class="text-stone-500 font-serif text-sm tracking-widest uppercase mb-6">Hitung Mundur Menuju Hari Bahagia
          </p>
          <div class="flex items-center justify-center gap-3 sm:gap-6">
            <!-- Days -->
            <div class="flex flex-col items-center">
              <div
                class="relative bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-2xl px-4 sm:px-6 py-4 sm:py-6 shadow-lg shadow-amber-100/50">
                <span class="font-serif text-3xl sm:text-5xl md:text-6xl text-stone-800 font-light">{{
                  formatNumber(timeLeft.days) }}</span>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-400 rounded-full"></div>
              </div>
              <span class="mt-3 text-stone-500 font-serif text-xs sm:text-sm uppercase tracking-widest">Hari</span>
            </div>

            <span class="text-amber-400 text-2xl sm:text-3xl font-light mt-[-20px]">:</span>

            <!-- Hours -->
            <div class="flex flex-col items-center">
              <div
                class="relative bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-2xl px-4 sm:px-6 py-4 sm:py-6 shadow-lg shadow-amber-100/50">
                <span class="font-serif text-3xl sm:text-5xl md:text-6xl text-stone-800 font-light">{{
                  formatNumber(timeLeft.hours) }}</span>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-400 rounded-full"></div>
              </div>
              <span class="mt-3 text-stone-500 font-serif text-xs sm:text-sm uppercase tracking-widest">Jam</span>
            </div>

            <span class="text-amber-400 text-2xl sm:text-3xl font-light mt-[-20px]">:</span>

            <!-- Minutes -->
            <div class="flex flex-col items-center">
              <div
                class="relative bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-2xl px-4 sm:px-6 py-4 sm:py-6 shadow-lg shadow-amber-100/50">
                <span class="font-serif text-3xl sm:text-5xl md:text-6xl text-stone-800 font-light">{{
                  formatNumber(timeLeft.minutes) }}</span>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-400 rounded-full"></div>
              </div>
              <span class="mt-3 text-stone-500 font-serif text-xs sm:text-sm uppercase tracking-widest">Menit</span>
            </div>

            <span class="text-amber-400 text-2xl sm:text-3xl font-light mt-[-20px]">:</span>

            <!-- Seconds -->
            <div class="flex flex-col items-center">
              <div
                class="relative bg-white/60 backdrop-blur-sm border border-amber-200/50 rounded-2xl px-4 sm:px-6 py-4 sm:py-6 shadow-lg shadow-amber-100/50 animate-pulse">
                <span class="font-serif text-3xl sm:text-5xl md:text-6xl text-stone-800 font-light">{{
                  formatNumber(timeLeft.seconds) }}</span>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-400 rounded-full"></div>
              </div>
              <span class="mt-3 text-stone-500 font-serif text-xs sm:text-sm uppercase tracking-widest">Detik</span>
            </div>
          </div>
        </div>

        <!-- Date Display -->
        <div class="text-center mb-8">
          <p class="text-stone-700 font-serif text-xl sm:text-2xl">{{ formattedDate }}</p>
          <p class="text-stone-600 font-serif text-sm mt-2">Resepsi pukul 08:00 - 14:00</p>
        </div>

        <!-- Add to Calendar Button -->
        <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ delay: 0.3, duration: 0.5 }">
          <button @click="addToCalendar"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-full shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Tambah ke Kalender
          </button>
        </Motion>
      </div>
    </section>

    <section id="story" class="py-2 sm:py-4 relative overflow-hidden">
      <!-- Decorative Lines -->
      <div class="absolute left-8 top-1/4 w-px h-1/2 bg-gradient-to-b from-amber-400/0 via-amber-400/20 to-amber-400/0">
      </div>
      <div
        class="absolute right-8 top-1/3 w-px h-1/2 bg-gradient-to-b from-amber-400/0 via-amber-400/20 to-amber-400/0">
      </div>

      <div class="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-16 sm:mb-20">
          <div class="inline-flex items-center gap-3 mb-4">
            <div class="w-8 h-px bg-amber-400"></div>
            <span class="text-amber-600 font-serif italic text-sm tracking-[0.2em] uppercase">Kisah Kami</span>
            <div class="w-8 h-px bg-amber-400"></div>
          </div>
          <h2 class="text-5xl sm:text-6xl md:text-7xl font-serif text-stone-800 mb-8 tracking-wide">Perjalanan Cinta
          </h2>
          <div class="flex items-center justify-center gap-4">
            <div class="w-16 h-px bg-gradient-to-r from-transparent to-amber-400"></div>
            <div class="w-2 h-2 rotate-45 bg-amber-400"></div>
            <div class="w-16 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
          <div class="mt-6 flex items-center justify-center gap-2">
            <span class="w-1 h-1 bg-amber-300 rounded-full"></span>
            <span class="w-8 h-px bg-amber-200"></span>
            <span class="w-1 h-1 bg-amber-300 rounded-full"></span>
            <span class="w-8 h-px bg-amber-200"></span>
            <span class="w-1 h-1 bg-amber-300 rounded-full"></span>
          </div>
        </div>

        <!-- Dynamic Story Section using coupleStories data -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <template v-for="(story, index) in coupleStories" :key="index">
            <!-- Left/Right Stories -->
            <div v-if="!story.isCenter" class="group relative" :class="story.isLeft ? 'order-1' : 'order-2 md:mt-16'">
              <div
                class="absolute -left-3 top-8 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                <span class="text-xs">{{ story.number }}</span>
              </div>
              <div
                class="relative bg-white rounded-3xl overflow-hidden shadow-2xl shadow-stone-300/40 border border-amber-100/50 group-hover:shadow-amber-200/50 group-hover:border-amber-200 transition-all duration-700 group-hover:-translate-y-2 h-full">
                <div class="relative h-48 sm:h-56 overflow-hidden">
                  <NuxtImg :src="`https://picsum.photos/seed/story${index + 1}/800/600`"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    :alt="story.title" referrerPolicy="no-referrer" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <span class="text-white/90 font-serif text-4xl sm:text-5xl font-light drop-shadow-lg">{{ story.year
                    }}</span>
                    <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span class="text-white text-lg">{{ index === 0 ? '♥' : '💍' }}</span>
                    </div>
                  </div>
                </div>

                <div class="p-6 sm:p-8 relative">
                  <div v-if="story.isLeft"
                    class="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-amber-300/40 rounded-tl-3xl">
                  </div>
                  <div v-if="story.isLeft"
                    class="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-amber-300/40 rounded-br-3xl">
                  </div>
                  <div v-if="!story.isLeft"
                    class="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-amber-300/40 rounded-tr-3xl">
                  </div>
                  <div v-if="!story.isLeft"
                    class="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-amber-300/40 rounded-bl-3xl">
                  </div>

                  <h3
                    class="text-xl sm:text-2xl md:text-3xl font-serif text-stone-800 mb-3 group-hover:text-amber-700 transition-colors">
                    {{ story.title }}</h3>
                  <p class="text-stone-600 font-serif leading-relaxed italic text-sm sm:text-base">{{ story.desc }}</p>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Final Story - Center (Last story) -->
        <div class="mt-16">
          <div class="group relative max-w-2xl mx-auto">
            <div
              class="absolute left-1/2 -translate-x-1/2 -top-4 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
              <span class="text-lg">♥</span>
            </div>
            <div
              class="relative bg-gradient-to-br from-white via-amber-50 to-white rounded-3xl overflow-hidden shadow-2xl shadow-amber-300/40 border-2 border-amber-200/50 group-hover:shadow-amber-400/60 group-hover:border-amber-300 transition-all duration-700 group-hover:-translate-y-2">
              <div class="absolute -top-20 -right-20 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl"></div>
              <div class="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-100/30 rounded-full blur-3xl"></div>

              <div class="relative h-48 sm:h-56 overflow-hidden">
                <NuxtImg :src="`https://picsum.photos/seed/story${coupleStories.length}/800/600`"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  :alt="coupleStories[coupleStories.length - 1]?.title" referrerPolicy="no-referrer" />
                <div class="absolute inset-0 bg-gradient-to-t from-amber-900/50 via-amber-800/20 to-transparent"></div>
                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span class="text-white font-serif text-4xl sm:text-5xl font-light drop-shadow-lg">{{
                    coupleStories[coupleStories.length - 1]?.year }}</span>
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <span class="text-white text-xl">💒</span>
                  </div>
                </div>
              </div>

              <div class="p-6 sm:p-8 relative text-center">
                <div class="absolute top-0 left-0 w-20 h-20 border-l-3 border-t-3 border-amber-400/50 rounded-tl-3xl">
                </div>
                <div
                  class="absolute bottom-0 right-0 w-20 h-20 border-r-3 border-b-3 border-amber-400/50 rounded-br-3xl">
                </div>
                <div class="absolute top-2 left-2 w-4 h-4 border-l border-t border-amber-400/30"></div>
                <div class="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-amber-400/30"></div>

                <h3
                  class="text-xl sm:text-2xl md:text-3xl font-serif text-stone-800 mb-3 group-hover:text-amber-800 transition-colors font-semibold">
                  {{ coupleStories[coupleStories.length - 1]?.title }}</h3>
                <p
                  class="text-stone-600 font-serif leading-relaxed italic text-sm sm:text-base group-hover:text-stone-700 transition-colors">
                  {{ coupleStories[coupleStories.length - 1]?.desc }}</p>

                <div class="mt-6 flex items-center justify-center gap-2">
                  <div class="w-8 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
                  <span class="text-amber-500 text-xl animate-pulse">♥</span>
                  <span class="text-amber-500 text-xl animate-pulse delay-300">♥</span>
                  <span class="text-amber-500 text-xl animate-pulse delay-500">♥</span>
                  <div class="w-8 h-px bg-gradient-to-l from-amber-400 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="gallery" class="py-2 relative overflow-hidden">
      <div class="max-w-6xl mx-auto px-4 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-3 mb-4">
            <div class="w-8 h-px bg-amber-400"></div>
            <span class="text-amber-600 font-serif italic text-sm tracking-[0.2em] uppercase">Koleksi Foto</span>
            <div class="w-8 h-px bg-amber-400"></div>
          </div>
          <h2 class="text-4xl sm:text-5xl md:text-6xl font-serif text-stone-800 mb-6 tracking-wide">Momen Bahagia</h2>
          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="w-16 h-px bg-gradient-to-r from-transparent to-amber-400"></div>
            <div class="w-2 h-2 rotate-45 bg-amber-400"></div>
            <div class="w-16 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
          <p class="text-stone-500 font-serif italic text-sm max-w-md mx-auto">"Cinta tidak terlihat dengan mata, tetapi
            dengan hati."</p>
        </div>

        <!-- Premium Gallery Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <Motion v-for="(img, idx) in images" :key="idx" :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true, margin: '-50px' }"
            :transition="{ delay: idx * 0.08, duration: 0.5 }"
            class="group relative overflow-hidden cursor-pointer rounded-xl"
            :class="idx === 0 ? 'md:col-span-2 md:row-span-2' : ''" @click="selectedImage = img; showLightbox = true">
            <!-- Image with Zoom Effect -->
            <NuxtImg :src="img" class="w-full object-cover transition-all duration-700 group-hover:scale-110"
              :class="idx === 0 ? 'h-56 md:h-full' : 'h-48 md:h-56'" alt="Gallery" quality="85" format="webp"
              referrerPolicy="no-referrer" />

            <!-- Premium Overlay -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <!-- Animated Border -->
              <div
                class="absolute inset-2 border-2 border-white/0 group-hover:border-white/40 rounded-lg transition-all duration-300">
              </div>

              <!-- Corner Accents -->
              <div
                class="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/0 group-hover:border-white/60 rounded-tl-lg transition-all duration-300">
              </div>
              <div
                class="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/0 group-hover:border-white/60 rounded-tr-lg transition-all duration-300">
              </div>
              <div
                class="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/0 group-hover:border-white/60 rounded-bl-lg transition-all duration-300">
              </div>
              <div
                class="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/0 group-hover:border-white/60 rounded-br-lg transition-all duration-300">
              </div>

              <!-- Center Icon -->
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <ZoomIn class="text-white" :size="24" />
                </div>
              </div>

              <!-- View Text -->
              <div class="absolute bottom-4 left-1/2 -translate-x-1/2">
                <span
                  class="text-white/0 group-hover:text-white text-xs font-light tracking-widest uppercase transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">Lihat
                  Foto</span>
              </div>
            </div>

            <!-- Index Number -->
            <div
              class="absolute top-3 left-3 w-6 h-6 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span class="text-white text-xs font-light">{{ idx + 1 }}</span>
            </div>
          </Motion>
        </div>
      </div>
      <LightboxModal :show="showLightbox" :image="selectedImage" :images="images" @close="showLightbox = false" />
    </section>
    <section id="location" class="py-5 relative overflow-hidden">
      <div class="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center gap-3 mb-4">
            <div class="w-8 h-px bg-amber-400"></div>
            <span class="text-amber-600 font-serif italic text-sm tracking-[0.2em] uppercase">Lokasi</span>
            <div class="w-8 h-px bg-amber-400"></div>
          </div>
          <h2 class="text-4xl sm:text-5xl md:text-6xl font-serif text-stone-800 mb-6 tracking-wide">Lokasi Acara</h2>
          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="w-16 h-px bg-gradient-to-r from-transparent to-amber-400"></div>
            <div class="w-2 h-2 rotate-45 bg-amber-400"></div>
            <div class="w-16 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
          <p class="text-stone-500 font-serif italic text-sm max-w-md mx-auto">Kami tunggu kehadiran Anda di hari
            bahagia
            kami</p>
        </div>

        <!-- Event Cards with Maps -->
        <div class="grid md:grid-cols-2 gap-6 md:gap-8">
          <!-- Akad Nikah -->
          <Motion :initial="{ opacity: 0, y: 30 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
            :transition="{ duration: 0.6 }" class="group">
            <div
              class="bg-white rounded-3xl overflow-hidden shadow-xl shadow-stone-300/40 border border-amber-100/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-200/40 hover:border-amber-300/50 h-full">
              <!-- Map -->
              <div class="h-48 sm:h-56 bg-stone-200 relative overflow-hidden">
                <iframe :src="eventDetails.akad.mapUrl" width="100%" height="100%" style="border:0;"
                  referrerPolicy="no-referrer-when-downgrade" class="absolute inset-0 w-full h-full" loading="lazy"
                  title="Lokasi Akad Nikah"></iframe>
                <div class="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent pointer-events-none"></div>
                <!-- Map Pin Badge -->
                <div
                  class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <MapPin class="text-amber-600" :size="20" />
                </div>
              </div>

              <!-- Content -->
              <div class="p-6 sm:p-8">
                <div class="text-center">
                  <!-- Icon -->
                  <div
                    class="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-200">
                    <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <h3
                    class="text-xl sm:text-2xl font-serif text-stone-800 mb-2 group-hover:text-amber-600 transition-colors">
                    {{ eventDetails.akad.title }}</h3>
                  <p class="text-amber-600 font-medium mb-3">{{ eventDetails.akad.time }}</p>
                  <p class="text-stone-700 font-medium">{{ eventDetails.akad.location }}</p>
                  <p class="text-stone-500 text-sm mt-1">{{ eventDetails.akad.address }}</p>

                  <!-- Button -->
                  <a :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(eventDetails.akad.location)"
                    target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full text-amber-700 text-sm font-light transition-all duration-300">
                    <MapPin :size="14" />
                    Buka Maps
                  </a>
                </div>
              </div>
            </div>
          </Motion>

          <!-- Resepsi -->
          <Motion :initial="{ opacity: 0, y: 30 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }"
            :transition="{ delay: 0.2, duration: 0.6 }" class="group">
            <div
              class="bg-white rounded-3xl overflow-hidden shadow-xl shadow-stone-300/40 border border-rose-100/50 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-200/40 hover:border-rose-300/50 h-full">
              <!-- Map -->
              <div class="h-48 sm:h-56 bg-stone-200 relative overflow-hidden">
                <iframe :src="eventDetails.resepsi.mapUrl" width="100%" height="100%" style="border:0;"
                  referrerPolicy="no-referrer-when-downgrade" class="absolute inset-0 w-full h-full" loading="lazy"
                  title="Lokasi Resepsi"></iframe>
                <div class="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent pointer-events-none"></div>
                <!-- Map Pin Badge -->
                <div
                  class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <MapPin class="text-rose-600" :size="20" />
                </div>
              </div>

              <!-- Content -->
              <div class="p-6 sm:p-8">
                <div class="text-center">
                  <!-- Icon -->
                  <div
                    class="w-16 h-16 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-rose-200">
                    <svg class="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>

                  <h3
                    class="text-xl sm:text-2xl font-serif text-stone-800 mb-2 group-hover:text-rose-600 transition-colors">
                    {{ eventDetails.resepsi.title }}</h3>
                  <p class="text-rose-600 font-medium mb-3">{{ eventDetails.resepsi.time }}</p>
                  <p class="text-stone-700 font-medium">{{ eventDetails.resepsi.location }}</p>
                  <p class="text-stone-500 text-sm mt-1">{{ eventDetails.resepsi.address }}</p>

                  <!-- Button -->
                  <a :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(eventDetails.resepsi.location)"
                    target="_blank" rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full text-rose-700 text-sm font-light transition-all duration-300">
                    <MapPin :size="14" />
                    Buka Maps
                  </a>
                </div>
              </div>
            </div>
          </Motion>
        </div>
      </div>
    </section>
    <section id="gift" class="py-12 md:py-20 relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <Motion :initial="{ opacity: 0, y: 30 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }"
          class="text-center mb-12">
          <div class="inline-flex items-center gap-3 mb-4">
            <div class="w-8 h-px bg-amber-400"></div>
            <span class="text-amber-600 font-serif italic text-sm tracking-[0.2em] uppercase">Hadiah</span>
            <div class="w-8 h-px bg-amber-400"></div>
          </div>
          <h2 class="text-4xl sm:text-5xl md:text-6xl font-serif text-stone-800 mb-4 tracking-wide">Kado Digital</h2>
          <p class="text-stone-600 max-w-xl mx-auto leading-relaxed">
            Doa restu Anda merupakan karunia yang sangat bermakna bagi kami.
            Namun jika Anda ingin memberikan tanda kasih, kami menerima melalui:
          </p>
        </Motion>

        <!-- Tab Buttons -->
        <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.2, duration: 0.5 }" class="flex justify-center mb-10 z-10">
          <div class="inline-flex bg-white rounded-full p-1.5 shadow-lg shadow-stone-200/50 border border-stone-100">
            <button type="button" @click="activeTab = 'bank'"
              class="px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2" :class="activeTab === 'bank'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                : 'text-stone-500 hover:text-stone-700'">
              <CreditCard :size="18" />
              <span class="hidden sm:inline">Transfer Bank</span>
              <span class="sm:hidden">Bank</span>
            </button>
            <button type="button" @click="activeTab = 'digital'"
              class="px-6 sm:px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2" :class="activeTab === 'digital'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md'
                : 'text-stone-500 hover:text-stone-700'">
              <Smartphone :size="18" />
              <span class="hidden sm:inline">QR Code</span>
              <span class="sm:hidden">QR</span>
            </button>
          </div>
        </Motion>

        <!-- Bank Transfer Cards -->
        <div v-if="activeTab === 'bank'" class="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <Motion v-for="(acc, idx) in accounts" :key="idx" :initial="{ opacity: 0, scale: 0.95 }"
            :whileInView="{ opacity: 1, scale: 1 }" :transition="{ delay: idx * 0.15, duration: 0.4 }" class="group">
            <!-- Virtual Card Design -->
            <div
              class="relative overflow-hidden rounded-3xl shadow-2xl transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
              :style="{ background: `linear-gradient(135deg, ${acc.color} 0%, ${acc.color}dd 100%)` }"
              @click="copyToClipboard(acc.number, idx)">
              <!-- Card Pattern -->
              <div class="absolute inset-0 opacity-10">
                <div class="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full"></div>
                <div class="absolute -left-5 -bottom-5 w-24 h-24 bg-white rounded-full"></div>
              </div>

              <!-- Card Chip -->
              <div class="absolute top-6 left-6 w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-lg">
              </div>

              <!-- Card Content -->
              <div class="relative p-5 pt-20 sm:p-6 sm:pt-20">
                <!-- Bank Logo -->
                <div class="absolute top-6 right-6 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span class="text-white font-bold text-xl">{{ acc.logo }}</span>
                </div>

                <!-- Account Number -->
                <div class="mb-5">
                  <p class="text-white/80 text-xs uppercase tracking-widest mb-1">Nomor Rekening</p>
                  <p class="text-white text-xl sm:text-2xl font-mono font-bold tracking-wider">{{ formatAccountNumber(acc.number) }}
                  </p>
                </div>

                <!-- Owner -->
                <div class="flex justify-between items-end">
                  <div>
                    <p class="text-white/80 text-xs uppercase tracking-widest mb-1">Atas Nama</p>
                    <p class="text-white text-base sm:text-lg font-medium">{{ acc.owner }}</p>
                  </div>
                  <div class="text-white/70 text-xs sm:text-sm font-medium">{{ acc.bank }}</div>
                </div>
              </div>

              <!-- Copy Button Overlay -->
              <div
                class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  class="bg-white text-stone-800 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white/90 transition-colors shadow-lg text-sm sm:text-base">
                  <Check v-if="copiedIndex === idx" :size="18" class="text-emerald-500" />
                  <Copy v-else :size="18" />
                  {{ copiedIndex === idx ? 'Tersalin!' : 'Salin Nomor' }}
                </button>
              </div>
            </div>
          </Motion>
        </div>

        <!-- QR Code Section -->
        <div v-if="activeTab === 'digital'" class="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <Motion v-for="(qr, idx) in qrCodes" :key="idx" :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }" :transition="{ delay: idx * 0.15, duration: 0.4 }">
            <div
              class="bg-white rounded-3xl p-5 sm:p-6 shadow-lg border border-stone-100 text-center hover:shadow-xl transition-shadow">
              <!-- QR Code Placeholder -->
              <div class="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                :style="{ backgroundColor: qr.color + '15' }">
                <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-xl flex items-center justify-center"
                  :style="{ backgroundColor: qr.color }">
                  <span class="text-white font-bold text-2xl sm:text-3xl">{{ qr.logo }}</span>
                </div>
              </div>

              <!-- QR Info -->
              <h3 class="font-bold text-stone-800 text-lg mb-1">{{ qr.bank }}</h3>
              <p class="text-stone-600 text-sm mb-1">{{ qr.number }}</p>
              <p class="text-stone-500 text-xs mb-4">{{ qr.owner }}</p>

              <!-- Copy Button -->
              <button @click="copyQrToClipboard(qr.number, idx)"
                class="w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                :class="copiedQrIndex === idx
                  ? 'bg-emerald-500 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'">
                <Check v-if="copiedQrIndex === idx" :size="16" />
                <Copy v-else :size="16" />
                {{ copiedQrIndex === idx ? 'Tersalin!' : 'Salin Nomor' }}
              </button>
            </div>
          </Motion>
        </div>

        <!-- Footer Note -->
        <Motion :initial="{ opacity: 0 }" :whileInView="{ opacity: 1 }" :transition="{ delay: 0.5 }"
          class="text-center mt-10">
          <p class="text-stone-500 text-sm">
            <Heart :size="14" class="inline mr-1 text-amber-500" />
            Terima kasih atas doa dan dukungan Anda
          </p>
        </Motion>
      </div>
    </section>

    <section class="py-12 md:py-20 relative flex flex-col items-center justify-center overflow-hidden">
      <div class="max-w-2xl mx-auto px-4 sm:px-6">
        <!-- Header -->
        <Motion :initial="{ opacity: 0, y: 30 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }"
          class="text-center mb-10">
          
          <div class="inline-flex items-center gap-3 mb-4">
            <div class="w-8 h-px bg-amber-400"></div>
            <span class="text-amber-600 font-serif italic text-sm tracking-[0.2em] uppercase">RSVP</span>
            <div class="w-8 h-px bg-amber-400"></div>
          </div>
          <h2 class="text-4xl sm:text-5xl md:text-6xl font-serif text-stone-800 mb-4 tracking-wide">Konfirmasi Kehadiran</h2>
          <p class="text-stone-600 max-w-md mx-auto leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dalam acara
            pernikahan kami.
          </p>
        </Motion>

        <!-- RSVP Form -->
        <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.2, duration: 0.5 }">
          <div class="bg-gradient-to-br from-white via-white to-amber-50/30 rounded-3xl shadow-2xl shadow-amber-200/40 border border-white/60 overflow-hidden relative">
            <form @submit.prevent="handleRSVP" class="p-6 md:p-8">
              <!-- Form Header -->
              <div class="text-center mb-8">
                <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 mb-3 shadow-lg shadow-amber-500/30">
                  <Heart :size="20" class="text-white" />
                </div>
                <h3 class="text-2xl font-serif text-stone-800">Konfirmasi Kehadiran</h3>
                <p class="text-sm text-stone-500 mt-1">Isi data di bawah untuk konfirmasi kehadiran Anda</p>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 text-black">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium uppercase tracking-wider mb-2 text-stone-600">Nama Tamu</label>
                  <div class="relative">
                    <User :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                    <input name="name" required :value="guestName"
                      class="w-full pl-11 pr-4 py-4 rounded-2xl bg-stone-50 border-2 border-transparent focus:border-amber-300 focus:bg-white focus:ring-8 focus:ring-amber-100/50 outline-none transition-all text-stone-700 placeholder:text-stone-400 font-medium"
                      placeholder="Nama lengkap Anda" />
                  </div>
                </div>

                <!-- Guest Count -->
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2.5 text-stone-600">Jumlah Tamu</label>
                  <div class="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border-2 border-stone-100 shadow-sm">
                    <button v-for="n in 5" :key="n" type="button"
                      class="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ease-out"
                      :class="guestCount === n 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/40 transform scale-105' 
                        : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'"
                      @click="guestCount = n">
                      {{ n }}
                    </button>
                  </div>
                  <input type="hidden" name="guests" :value="guestCount" />
                </div>

                <!-- Attendance Options -->
                <div>
                  <label class="block text-xs font-semibold uppercase tracking-wider mb-2.5 text-stone-600">Konfirmasi</label>
                  <div class="flex sm:flex-col gap-2 p-1.5 bg-white rounded-2xl border-2 border-stone-100 shadow-sm">
                    <button v-for="option in attendanceOptions" :key="option.value" type="button"
                      @click="selectedAttendance = option.value"
                      class="flex-1 py-2 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-300 ease-out flex items-center justify-center gap-1 sm:gap-2"
                      :class="selectedAttendance === option.value
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/40 transform scale-105' 
                        : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'"
                    >
                      <component :is="option.icon" :size="14" />
                      <span class="hidden xs:inline">{{ option.label }}</span>
                    </button>
                  </div>
                  <input type="hidden" name="attendance" :value="selectedAttendance" />
                </div>
              </div>

              <!-- Submit Button -->
              <div class="mt-6 flex justify-center">
                <button type="submit" :disabled="rsvpStatus !== 'idle' || !selectedAttendance"
                  class="w-full sm:w-auto py-4 px-8 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99]"
                  :class="rsvpStatus === 'success'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40'">
                  <template v-if="rsvpStatus === 'loading'">
                    <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Mengirim...</span>
                  </template>
                  <template v-else-if="rsvpStatus === 'success'">
                    <Check :size="20" />
                    <span>{{ selectedAttendance === 'Hadir' ? 'Sampai Jumpa di Hari Bahagia!' : 'Terima Kasih!' }}</span>
                  </template>
                  <template v-else>
                    <Send :size="18" />
                    Konfirmasi Sekarang
                  </template>
                </button>
              </div>
            </form>
          </div>
        </Motion>
      </div>
    </section>
    <section id="contact" class="py-16 md:py-24 relative flex flex-col items-center justify-center overflow-hidden">
     
      <!-- Decorative Elements -->
      <div class="absolute top-20 left-10 w-px h-32 bg-gradient-to-b from-amber-400/0 via-amber-400/20 to-amber-400/0"></div>
      <div class="absolute top-40 right-10 w-px h-48 bg-gradient-to-b from-amber-400/0 via-amber-400/20 to-amber-400/0"></div>
      <div class="absolute -bottom-10 left-1/4 w-24 h-24 bg-amber-100/30 rounded-full blur-3xl"></div>
      <div class="absolute -top-10 right-1/4 w-32 h-32 bg-amber-50/50 rounded-full blur-3xl"></div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
      <!-- Premium Section Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-3 mb-6">
          <div class="w-12 h-px bg-gradient-to-r from-transparent to-amber-400"></div>
          <span class="text-amber-600 font-serif italic text-sm tracking-[0.3em] uppercase">Hubungi Kami</span>
          <div class="w-12 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
        </div>
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-serif text-stone-800 mb-6 tracking-wide">Informasi Kontak</h2>
        <div class="flex items-center justify-center gap-4 mb-6">
          <div class="w-16 h-px bg-gradient-to-r from-transparent to-amber-400"></div>
          <div class="w-2 h-2 rotate-45 bg-amber-400"></div>
          <div class="w-16 h-px bg-gradient-to-l from-transparent to-amber-400"></div>
        </div>
        <p class="text-stone-600 max-w-xl mx-auto leading-relaxed">
          Dengan senang hati kami siap menjawab pertanyaan Anda.
          Silakan hubungi kami melalui kontak berikut:
        </p>
      </div>

      <!-- Premium Contact Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16">
        <Motion 
          v-for="(contact, idx) in contacts" 
          :key="idx"
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ delay: idx * 0.15, duration: 0.6 }"
          class="group"
        >
          <div class="relative bg-white rounded-3xl overflow-hidden shadow-2xl shadow-stone-200/50 border border-amber-100/50 transition-all duration-500 hover:shadow-3xl hover:shadow-amber-200/30 hover:border-amber-200/70 h-full">
            <!-- Card Decorations -->
            <div class="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-amber-300/30 rounded-tl-3xl"></div>
            <div class="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-amber-300/30 rounded-br-3xl"></div>
            <div class="absolute -top-16 -right-16 w-32 h-32 bg-amber-100/20 rounded-full blur-2xl"></div>
            
            <div class="relative p-8 md:p-10">
              <!-- Icon -->
              <div class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:from-amber-200 group-hover:to-amber-100">
                <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <span class="text-white font-serif text-xl">{{ idx === 0 ? '👨' : '👩' }}</span>
                </div>
              </div>

              <!-- Contact Type Label -->
              <div class="text-center mb-4">
                <span class="inline-block px-4 py-1 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest rounded-full">
                  {{ contact.name }}
                </span>
              </div>
              
              <!-- Person Name -->
              <div class="text-center mb-8">
                <h3 class="text-2xl md:text-3xl font-serif text-stone-800 mb-2 group-hover:text-amber-700 transition-colors">
                  {{ contact.person }}
                </h3>
                <div class="flex items-center justify-center gap-2">
                  <div class="w-8 h-px bg-amber-300"></div>
                  <span class="text-amber-500 text-sm"> Wedding Coordinator </span>
                  <div class="w-8 h-px bg-amber-300"></div>
                </div>
              </div>
              
              <!-- Contact Button -->
              <div class="flex justify-center">
                <a 
                  :href="`https://wa.me/${contact.phone}`" 
                  target="_blank"
                  class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-bold transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105"
                >
                  <MessageCircle :size="20" />
                  Hubungi {{ contact.type }}
                </a>
              </div>
            </div>
          </div>
        </Motion>
      </div>

      <!-- Alternative Contact Methods -->
      <div class="text-center">
        <p class="text-stone-500 mb-6">atau melalui media sosial kami</p>
        <div class="flex justify-center gap-4 mb-8">
          <a href="#" class="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-stone-200/50 border border-stone-100 flex items-center justify-center text-stone-600 hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-600 hover:text-white hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-110">
            <Instagram :size="22" />
          </a>
          <a href="#" class="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-stone-200/50 border border-stone-100 flex items-center justify-center text-stone-600 hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-600 hover:text-white hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-110">
            <Mail :size="22" />
          </a>
        </div>
        
        <!-- Footer -->
        <div class="pt-8 border-t border-stone-200">
          <div class="flex items-center justify-center gap-3 mb-4">
            <Heart :size="16" class="text-amber-500" />
            <span class="text-stone-400">Terima kasih telah menjadi bagian dari hari istimewa kami</span>
            <Heart :size="16" class="text-amber-500" />
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <section id="wishes" class="py-12 md:py-20 relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-transparent via-amber-50/20 to-transparent">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="w-8 h-px bg-amber-400"></div>
          <span class="text-amber-600 font-serif italic text-sm tracking-[0.2em] uppercase">Ucapan</span>
          <div class="w-8 h-px bg-amber-400"></div>
        </div>
        <h2 class="text-4xl sm:text-5xl md:text-6xl font-serif text-stone-800 mb-4 tracking-wide">Ucapan & Doa</h2>
        <p class="text-stone-600 max-w-lg mx-auto">Berikan ucapan selamat dan doa restu untuk kami</p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-6 md:gap-12">
        <div class="bg-gradient-to-br from-white via-white to-amber-50/30 p-6 sm:p-8 rounded-3xl shadow-xl shadow-stone-200/40 border border-white/60 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/40 to-transparent rounded-tr-2xl"></div>
          <div class="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-amber-100/30 to-transparent rounded-bl-2xl"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 mx-auto mb-4 shadow-lg shadow-amber-500/30">
              <MessageSquare :size="20" class="text-white" />
            </div>
            <h3 class="text-xl font-serif text-stone-800 text-center mb-1">Ucapan & Doa</h3>
            <p class="text-sm text-stone-500 text-center mb-6">Berikan ucapan dan doa restu untuk kami</p>
          </div>

          <form @submit.prevent="handleWish" class="space-y-4 relative z-10">
            <input 
              name="name"
              required
              placeholder="Nama Anda"
              class="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border-2 border-transparent focus:border-amber-300 focus:ring-4 focus:ring-amber-100/50 outline-none transition-all text-stone-700 placeholder:text-stone-400"
            />
            <textarea 
              name="message"
              required
              placeholder="Tulis ucapan dan doa terbaik Anda..."
              rows="4"
              class="w-full px-4 py-3.5 rounded-2xl bg-stone-50 border-2 border-transparent focus:border-amber-300 focus:ring-4 focus:ring-amber-100/50 outline-none transition-all resize-none text-stone-700 placeholder:text-stone-400"
            ></textarea>
            <button 
              type="submit"
              :disabled="wishStatus !== 'idle'"
              class="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
            >
              <template v-if="wishStatus === 'loading'">
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Mengirim...</span>
              </template>
              <template v-else>
                <Send :size="18" /> 
                <span>Kirim Ucapan</span>
              </template>
            </button>
          </form>
        </div>
        
        <!-- Wish List -->
        <div class="space-y-4">
          <div class="max-h-[400px] sm:max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
            <AnimatePresence>
              <Motion 
                v-for="wish in wishes"
                :key="wish.id"
                :initial="{ opacity: 0, y: 20 }"
                :animate="{ opacity: 1, y: 0 }"
                class="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-stone-100"
              >
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                    {{ wish.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h4 class="font-bold text-stone-800">{{ wish.name }}</h4>
                    <span class="text-xs text-stone-500">{{ new Date(wish.created_at).toLocaleDateString() }}</span>
                  </div>
                </div>
                <p class="text-stone-600 italic">"{{ wish.message }}"</p>
              </Motion>
            </AnimatePresence>
            <div v-if="wishes.length === 0" class="text-center py-12 text-stone-500">
              Belum ada ucapan. Jadilah yang pertama!
            </div>
          </div>
          
          <div v-if="wishes.length > 0" class="pt-4">
            <NuxtLink 
              to="/guestbook" 
              class="w-full py-4 border-2 border-stone-200 rounded-xl text-stone-600 font-bold hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
            >
              Lihat Semua Pesan di Buku Tamu
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
  </main>
</template>