<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Send, ZoomIn, Copy, Check, Heart, Smartphone, CreditCard, User, MessageCircle, MessageSquare, Calendar, Clock, MapPin, Gift, Images, Sparkles, ChevronDown, ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-vue-next'
import { Motion, AnimatePresence } from 'motion-v'
import { stories, galleryImages, COUPLE, eventLocations, accounts, qrCodes } from '~/composables/useData'

const props = defineProps<{
  groom: string
  bride: string
  date: string
  location: string
  mapUrl: string
}>()

const coupleData = COUPLE
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
  const date = new Date(props.date);
  const start = date.toISOString().replaceAll(/[-:]/g, '').replaceAll(/\.\d+/g, '');
  const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
  const end = endDate.toISOString().replaceAll(/[-:]/g, '').replaceAll(/\.\d+/g, '');
  const title = `Pernikahan ${props.groom} & ${props.bride}`;
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=Undangan+Pernikahan+${props.groom}+%26+${props.bride}&location=Jakarta`;
  window.open(url, '_blank')
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

// Lightbox & Gallery with swipe
const selectedImage = ref('');
const showLightbox = ref(false);
const currentSlide = ref(0);
const isAutoPlaying = ref(false);
let autoPlayInterval: ReturnType<typeof setInterval> | null = null;

const copiedIndex = ref<number | null>(null);
const copiedQrIndex = ref<number | null>(null);
const activeTab = ref<'bank' | 'digital'>('bank');

const copyToClipboard = (text: string, index: number) => {
  navigator.clipboard.writeText(text);
  copiedIndex.value = index;
  setTimeout(() => copiedIndex.value = null, 2000);
}

const copyQr = (text: string, index: number) => {
  navigator.clipboard.writeText(text);
  copiedQrIndex.value = index;
  setTimeout(() => copiedQrIndex.value = null, 2000);
}

const openLightbox = (img: string) => {
  selectedImage.value = img;
  currentSlide.value = images.value.indexOf(img);
  showLightbox.value = true;
}

const openLightboxAtIndex = (index: number) => {
  currentSlide.value = index;
  selectedImage.value = images.value[index];
  showLightbox.value = true;
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % images.value.length;
  selectedImage.value = images.value[currentSlide.value];
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + images.value.length) % images.value.length;
  selectedImage.value = images.value[currentSlide.value];
}

const goToSlide = (index: number) => {
  currentSlide.value = index;
  selectedImage.value = images.value[index];
}

const toggleAutoPlay = () => {
  isAutoPlaying.value = !isAutoPlaying.value;
  if (isAutoPlaying.value) {
    autoPlayInterval = setInterval(nextSlide, 4000);
  } else if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
  }
}

// Touch/Swipe handling
const touchStartX = ref(0);
const touchEndX = ref(0);
const isDragging = ref(false);

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX;
  isDragging.value = true;
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  touchEndX.value = e.changedTouches[0].screenX;
}

const handleTouchEnd = () => {
  if (!isDragging.value) return;
  const swipeThreshold = 50;
  const diff = touchStartX.value - touchEndX.value;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
  isDragging.value = false;
}

// Wishes
interface Wish {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

const wishes = ref<Wish[]>([]);
const wishStatus = ref<'idle' | 'loading' | 'success'>('idle');

const fetchWishes = async () => {
  try {
    const data = await $fetch<Wish[]>('/api/wishes');
    wishes.value = data;
  } catch (err) {
    console.error('Failed to fetch wishes:', err);
  }
};

const handleWish = async (e: Event) => {
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const name = formData.get('name') as string;
  const message = formData.get('message') as string;

  if (!name || !message) return;

  wishStatus.value = 'loading';

  try {
    await $fetch('/api/wishes', {
      method: 'POST',
      body: { name, message }
    });
    wishStatus.value = 'success';
    form.reset();
    await fetchWishes();
    setTimeout(() => {
      wishStatus.value = 'idle';
    }, 3000);
  } catch (err) {
    console.error('Failed to submit wish:', err);
    wishStatus.value = 'idle';
  }
};

onMounted(() => {
  fetchWishes();
});
</script>

<template>
  <div class="min-h-screen text-white overflow-x-hidden">
    <!-- Hero Section - Premium Redesign -->
    <section id="hero" class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <!-- Animated Premium Background -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Gradient orbs with slow animation -->
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-950 via-purple-950/30 to-slate-950"></div>
        <div class="absolute top-[-20%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-r from-rose-500/20 to-purple-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute bottom-[-20%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-l from-amber-500/15 to-rose-500/15 rounded-full blur-[120px] animate-pulse" style="animation-delay: 1.5s;"></div>
        <div class="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[80px] animate-pulse" style="animation-delay: 0.8s;"></div>
        
        <!-- Elegant grid pattern -->
        <div class="absolute inset-0 opacity-[0.02]" style="background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px); background-size: 60px 60px;"></div>
        
        <!-- Floating Elements with enhanced animation -->
        <div class="absolute top-24 left-8 sm:left-16 text-rose-400/20" style="animation: float 6s ease-in-out infinite;">
          <Heart :size="48" fill="currentColor" />
        </div>
        <div class="absolute top-40 right-12 sm:right-20 text-violet-400/20" style="animation: float 8s ease-in-out infinite; animation-delay: 1s;">
          <Heart :size="36" fill="currentColor" />
        </div>
        <div class="absolute bottom-40 left-16 sm:left-24 text-amber-400/20" style="animation: float 7s ease-in-out infinite; animation-delay: 2s;">
          <Heart :size="32" fill="currentColor" />
        </div>
        <div class="absolute bottom-24 right-8 sm:right-16 text-rose-400/20" style="animation: float 5s ease-in-out infinite; animation-delay: 0.5s;">
          <Heart :size="28" fill="currentColor" />
        </div>
        
        <!-- Sparkle particles -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div v-for="i in 30" :key="i" class="absolute animate-ping" :style="{ 
            left: Math.random() * 100 + '%', 
            top: Math.random() * 100 + '%', 
            animationDelay: Math.random() * 4 + 's',
            animationDuration: (Math.random() * 2 + 3) + 's'
          }">
            <Sparkles :size="Math.random() * 8 + 4" class="text-white/40" />
          </div>
        </div>
      </div>

      <!-- Decorative corners -->
      <div class="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/10"></div>
      <div class="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/10"></div>
      <div class="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/10"></div>
      <div class="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/10"></div>

      <div class="relative z-10 text-center px-4">
        <!-- Pre Title with premium styling -->
        <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.8 }"
          class="mb-8">
          <span
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm text-rose-300 shadow-lg">
            <Sparkles :size="16" class="animate-pulse" />
            Wedding Invitation
          </span>
        </Motion>

        <!-- Names with premium typography -->
        <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, delay: 0.2 }" class="mb-10">
          <h1 class="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-wider">
            <span
              class="block bg-gradient-to-r from-rose-200 via-violet-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">{{
              groom }}</span>
            <span class="text-3xl sm:text-4xl text-white/20 my-4 font-light">&</span>
            <span
              class="block bg-gradient-to-r from-purple-200 via-violet-200 to-rose-200 bg-clip-text text-transparent drop-shadow-lg">{{
              bride }}</span>
          </h1>
        </Motion>

        <!-- Date with enhanced styling -->
        <Motion :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ duration: 0.8, delay: 0.4 }"
          class="mb-12">
          <div
            class="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
            <Calendar :size="20" class="text-rose-400" />
            <span class="text-lg text-white/90">{{ formattedDate }}</span>
          </div>
        </Motion>

        <!-- Countdown with premium design -->
        <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, delay: 0.6 }" class="mb-12">
          <div class="flex justify-center gap-3 sm:gap-6">
            <div v-for="(value, key) in timeLeft" :key="key" class="text-center group">
              <div
                class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center mb-2 shadow-lg group-hover:bg-white/10 transition-all duration-300">
                <span class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-300 to-violet-300 bg-clip-text text-transparent">{{ formatNumber(value) }}</span>
              </div>
              <span class="text-xs text-white/40 uppercase tracking-widest">{{ key }}</span>
            </div>
          </div>
        </Motion>

        <!-- Scroll Indicator with animation -->
        <Motion :initial="{ opacity: 0 }" :animate="{ opacity: 1, y: [0, 10, 0] }"
          :transition="{ duration: 2, delay: 1, repeat: Infinity }" class="mt-16">
          <div class="flex flex-col items-center gap-2 text-white/30">
            <span class="text-sm">Scroll untuk melihat</span>
            <div class="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
              <div class="w-1.5 h-3 bg-white/40 rounded-full animate-bounce"></div>
            </div>
          </div>
        </Motion>
      </div>
    </section>

    <!-- Story Section -->
    <section id="story" class="py-28 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-rose-500/5 to-transparent"></div>
      <div class="absolute top-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
      
      <div class="max-w-4xl mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }"
            :viewport="{ once: true, margin: '-100px' }">
            <span
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-400 text-sm mb-4">
              <Heart :size="14" fill="currentColor" /> Our Story
            </span>
          </Motion>
          <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.1 }"
            :viewport="{ once: true }">
            <h2 class="text-4xl sm:text-5xl font-light mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Kisah Kami</h2>
          </Motion>
        </div>

        <div class="space-y-8">
          <Motion v-for="(story, index) in coupleStories" :key="index" :initial="{ opacity: 0, y: 30 }"
            :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: index * 0.15 }" class="relative"
            :viewport="{ once: true, margin: '-50px' }">
            <div class="flex-1 text-center">
              <div class="inline-block p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <span class="text-7xl font-light text-rose-400/30">{{ story.number }}</span>
                <h3 class="text-xl font-medium mt-4 mb-2 text-white/90">{{ story.title }}</h3>
                <p class="text-white/50 text-sm leading-relaxed max-w-md">{{ story.desc }}</p>
              </div>
            </div>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Gallery Section - With Swipe/Slide -->
    <section id="gallery" class="py-28 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]"></div>
      
      <div class="max-w-6xl mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }"
            :viewport="{ once: true, margin: '-100px' }">
            <span
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/20 text-violet-400 text-sm mb-4">
              <Images :size="14" /> Gallery
            </span>
          </Motion>
          <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.1 }"
            :viewport="{ once: true }">
            <h2 class="text-4xl sm:text-5xl font-light mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Momen Kami</h2>
          </Motion>
        </div>

        <!-- Swipeable Gallery Carousel -->
        <div class="relative">
          <!-- Main Carousel Container -->
          <div 
            class="relative overflow-hidden rounded-3xl"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <!-- Slides Container -->
            <div 
              class="flex transition-transform duration-500 ease-out"
              :style="{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }"
            >
              <div 
                v-for="(img, index) in images.slice(0, 9)" 
                :key="index"
                class="w-1/3 flex-shrink-0 px-2"
              >
                <Motion 
                  :initial="{ opacity: 0, scale: 0.9 }" 
                  :whileInView="{ opacity: 1, scale: 1 }" 
                  :transition="{ duration: 0.5, delay: index * 0.05 }"
                  :viewport="{ once: true }"
                  class="aspect-square rounded-2xl overflow-hidden cursor-pointer group relative"
                  @click="openLightboxAtIndex(index)"
                >
                  <img :src="img" :alt="`Gallery ${index + 1}`"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                    <span class="text-white/90 text-sm">Lihat</span>
                  </div>
                </Motion>
              </div>
            </div>
            
            <!-- Navigation Arrows -->
            <button 
              @click.stop="prevSlide"
              class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all z-10"
            >
              <ChevronLeft :size="20" />
            </button>
            <button 
              @click.stop="nextSlide"
              class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all z-10"
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
                currentSlide === index ? 'w-8 bg-rose-400' : 'bg-white/20 hover:bg-white/40'
              ]"
            />
          </div>
          
          <!-- Auto Play Toggle -->
          <div class="flex justify-center mt-4">
            <button 
              @click="toggleAutoPlay"
              class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm"
            >
              <component :is="isAutoPlaying ? Pause : Play" :size="14" />
              {{ isAutoPlaying ? 'Pause' : 'Auto Play' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <AnimatePresence>
        <div v-if="showLightbox" class="fixed inset-0 z-50 flex items-center justify-center">
          <!-- Backdrop -->
          <Motion 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            class="absolute inset-0 bg-black/95 backdrop-blur-xl"
            @click="showLightbox = false"
          />
          
          <!-- Content -->
          <div class="relative z-10 w-full h-full flex items-center justify-center p-4">
            <!-- Close button -->
            <button 
              @click="showLightbox = false"
              class="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <X :size="20" />
            </button>
            
            <!-- Image -->
            <Motion 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.8, opacity: 0 }}
              :transition={{ type: 'spring', duration: 0.5 }}
              class="relative max-w-4xl max-h-[80vh]"
              @click.stop
            >
              <img :src="selectedImage" alt="Gallery" class="max-w-full max-h-[80vh] object-contain rounded-lg" />
            </Motion>
            
            <!-- Navigation -->
            <button 
              @click.stop="prevSlide"
              class="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <ChevronLeft :size="24" />
            </button>
            <button 
              @click.stop="nextSlide"
              class="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-all"
            >
              <ChevronRight :size="24" />
            </button>
            
            <!-- Counter -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/70 text-sm">
              {{ currentSlide + 1 }} / {{ images.length }}
            </div>
          </div>
        </div>
      </AnimatePresence>
    </Teleport>

    <!-- Location Section -->
    <section id="location" class="py-28 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent"></div>
      <div class="absolute top-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
      
      <div class="max-w-4xl mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }"
            :viewport="{ once: true, margin: '-100px' }">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 text-sky-400 text-sm mb-4">
              <MapPin :size="14" /> Location
            </span>
          </Motion>
          <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.1 }"
            :viewport="{ once: true }">
            <h2 class="text-4xl sm:text-5xl font-light mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Lokasi Acara</h2>
          </Motion>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <Motion v-for="(event, key) in eventDetails" :key="key" :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }"
            :viewport="{ once: true, margin: '-50px' }"
            class="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all group">
            <h3 class="text-xl font-medium mb-4 flex items-center gap-2">
              <Clock :size="20" class="text-rose-400" />
              {{ event.title }}
            </h3>
            <div class="space-y-3 text-white/70">
              <p class="font-medium text-white">{{ event.time }}</p>
              <p>{{ event.location }}</p>
              <p class="text-sm text-white/50">{{ event.address }}</p>
            </div>
            <div class="mt-6 flex flex-wrap gap-3">
              <a :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(event.location)"
                target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 transition-colors text-sm">
                <MapPin :size="16" />
                Lihat di Peta
              </a>
              <button @click="addToCalendar"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/80 hover:bg-amber-500 transition-colors text-sm">
                <Calendar :size="16" />
                Tambah ke Kalender
              </button>
            </div>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Gift Section -->
    <section id="gift" class="py-28 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]"></div>
      
      <div class="max-w-4xl mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }"
            :viewport="{ once: true, margin: '-100px' }">
            <span
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-sm mb-4">
              <Gift :size="14" /> Wedding Gift
            </span>
          </Motion>
          <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.1 }"
            :viewport="{ once: true }">
            <h2 class="text-4xl sm:text-5xl font-light mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Hadiah</h2>
          </Motion>
          <p class="text-white/50 mt-4 max-w-md mx-auto">Doa restu Anda adalah hadiah terindah bagi kami. Namun jika Anda ingin memberikan hadiah, kami menyediakan:</p>
        </div>

        <!-- Tabs -->
        <div class="flex justify-center mb-8">
          <div class="inline-flex p-1 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <button @click="activeTab = 'bank'"
              :class="['px-6 py-3 rounded-xl transition-all', activeTab === 'bank' ? 'bg-rose-500 text-white' : 'text-white/50 hover:text-white']">
              <CreditCard :size="16" class="inline mr-2" />
              Transfer Bank
            </button>
            <button @click="activeTab = 'digital'"
              :class="['px-6 py-3 rounded-xl transition-all', activeTab === 'digital' ? 'bg-rose-500 text-white' : 'text-white/50 hover:text-white']">
              <Smartphone :size="16" class="inline mr-2" />
              Digital Wallet
            </button>
          </div>
        </div>

        <!-- Bank Accounts -->
        <div v-if="activeTab === 'bank'" class="grid sm:grid-cols-2 gap-4">
          <Motion v-for="(account, index) in accounts" :key="index" :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, delay: index * 0.1 }"
            :viewport="{ once: true, margin: '-50px' }"
            class="p-5 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                :style="{ backgroundColor: account.color }">
                {{ account.logo }}
              </div>
              <div>
                <h4 class="font-medium">{{ account.bank }}</h4>
                <p class="text-sm text-white/50">{{ account.owner }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <code class="flex-1 p-3 rounded-xl bg-black/20 font-mono">{{ account.number }}</code>
              <button @click="copyToClipboard(account.number, index)"
                class="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <Copy v-if="copiedIndex !== index" :size="16" />
                <Check v-else :size="16" class="text-green-400" />
              </button>
            </div>
          </Motion>
        </div>

        <!-- Digital Wallets -->
        <div v-else class="grid sm:grid-cols-3 gap-4">
          <Motion v-for="(qr, index) in qrCodes" :key="index" :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, delay: index * 0.1 }"
            :viewport="{ once: true, margin: '-50px' }"
            class="p-5 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all text-center">
            <div class="w-24 h-24 mx-auto mb-4 rounded-xl flex items-center justify-center text-white font-bold"
              :style="{ backgroundColor: qr.color }">
              {{ qr.logo }}
            </div>
            <h4 class="font-medium mb-1">{{ qr.bank }}</h4>
            <p class="text-sm text-white/50 mb-3">{{ qr.owner }}</p>
            <div class="flex items-center justify-center gap-2">
              <code class="p-2 rounded-lg bg-black/20 font-mono text-xs">{{ qr.number }}</code>
              <button @click="copyQr(qr.number, index)"
                class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Copy v-if="copiedQrIndex !== index" :size="14" />
                <Check v-else :size="14" class="text-green-400" />
              </button>
            </div>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Wishes Section -->
    <section id="wishes" class="py-28 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-rose-500/5 to-transparent"></div>
      <div class="absolute top-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>
      
      <div class="max-w-4xl mx-auto px-4 relative z-10">
        <div class="text-center mb-12">
          <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }"
            :viewport="{ once: true, margin: '-100px' }">
            <span
              class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-400 text-sm mb-4">
              <MessageSquare :size="14" /> Ucapan & Doa
            </span>
          </Motion>
          <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.1 }"
            :viewport="{ once: true }">
            <h2 class="text-4xl sm:text-5xl font-light mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Ucapan & Doa</h2>
          </Motion>
          <p class="text-white/50 mt-4">Berikan ucapan selamat dan doa restu untuk kami</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Form -->
          <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }"
            :viewport="{ once: true, margin: '-50px' }"
            class="p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
            <h3 class="text-xl font-medium mb-6 flex items-center gap-2">
              <MessageCircle :size="20" class="text-rose-400" />
              Kirim Ucapan
            </h3>

            <form @submit.prevent="handleWish" class="space-y-4">
              <input name="name" type="text" placeholder="Nama Anda" required
                class="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-rose-500 transition-colors" />
              <textarea name="message" rows="4" placeholder="Ucapan & Doa" required
                class="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-rose-500 transition-colors resize-none"></textarea>
              <button type="submit" :disabled="wishStatus === 'loading'"
                class="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <Send v-if="wishStatus !== 'loading'" :size="18" />
                <span v-if="wishStatus === 'loading'">Mengirim...</span>
                <span v-else-if="wishStatus === 'success'">Terkirim!</span>
                <span v-else>Kirim Ucapan</span>
              </button>
            </form>
          </Motion>

          <!-- Wishes List -->
          <Motion :initial="{ opacity: 0, y: 20 }" :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.2 }" :viewport="{ once: true, margin: '-50px' }"
            class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <div v-if="wishes.length === 0" class="text-center py-12 text-white/40">
              <Heart :size="48" class="mx-auto mb-4 opacity-50" />
              <p>Belum ada ucapan</p>
              <p class="text-sm">Jadilah yang pertama!</p>
            </div>
            <div v-for="wish in wishes" :key="wish.id" class="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500/30 to-violet-500/30 flex items-center justify-center">
                  <User :size="18" class="text-white/70" />
                </div>
                <div>
                  <p class="font-medium text-white/90">{{ wish.name }}</p>
                  <p class="text-xs text-white/40">{{ new Date(wish.created_at).toLocaleDateString('id-ID') }}</p>
                </div>
              </div>
              <p class="text-white/60 text-sm pl-13">{{ wish.message }}</p>
            </div>
          </Motion>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
