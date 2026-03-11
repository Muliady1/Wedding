<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Send, ZoomIn, Copy, Check, Heart, Smartphone, CreditCard, User, MessageCircle, MessageSquare, Calendar, Clock, MapPin, Gift, Images, Sparkles, ChevronDown } from 'lucide-vue-next'
import { Motion } from 'motion-v'
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

const selectedImage = ref('');
const showLightbox = ref(false);
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
  showLightbox.value = true;
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
  <div class="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
    <!-- Hero Section -->
    <section id="hero" class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-1/4 -left-20 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-rose-500/10 via-violet-500/10 to-sky-500/10 rounded-full blur-3xl"></div>
        
        <!-- Floating Elements -->
        <div class="absolute top-20 left-10 text-rose-400/20 animate-bounce" style="animation-duration: 3s">
          <Heart :size="40" />
        </div>
        <div class="absolute top-32 right-20 text-violet-400/20 animate-bounce" style="animation-duration: 4s; animation-delay: 1s">
          <Heart :size="32" />
        </div>
        <div class="absolute bottom-32 left-20 text-sky-400/20 animate-bounce" style="animation-duration: 3.5s; animation-delay: 0.5s">
          <Heart :size="28" />
        </div>
      </div>

      <div class="relative z-10 text-center px-4">
        <!-- Pre Title -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8 }"
          class="mb-6"
        >
          <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-rose-300">
            <Sparkles :size="16" />
            Wedding Invitation
          </span>
        </Motion>

        <!-- Names -->
        <Motion
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, delay: 0.2 }"
          class="mb-8"
        >
          <h1 class="text-6xl sm:text-8xl md:text-9xl font-light tracking-wider">
            <span class="block bg-gradient-to-r from-rose-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">{{ groom }}</span>
            <span class="text-4xl sm:text-5xl text-white/30 my-2">&</span>
            <span class="block bg-gradient-to-r from-sky-300 via-violet-300 to-rose-300 bg-clip-text text-transparent">{{ bride }}</span>
          </h1>
        </Motion>

        <!-- Date -->
        <Motion
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :transition="{ duration: 0.8, delay: 0.4 }"
          class="mb-12"
        >
          <div class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <Calendar :size="20" class="text-rose-400" />
            <span class="text-lg text-white/80">{{ formattedDate }}</span>
          </div>
        </Motion>

        <!-- Countdown -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, delay: 0.6 }"
          class="mb-12"
        >
          <div class="flex justify-center gap-3 sm:gap-6">
            <div v-for="(value, key) in timeLeft" :key="key" class="text-center">
              <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-2">
                <span class="text-2xl sm:text-3xl font-bold">{{ formatNumber(value) }}</span>
              </div>
              <span class="text-xs text-white/50 uppercase tracking-wider">{{ key }}</span>
            </div>
          </div>
        </Motion>

        <!-- Scroll Indicator -->
        <Motion
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1, y: [0, 10, 0] }"
          :transition="{ duration: 2, delay: 1, repeat: Infinity }"
          class="mt-12"
        >
          <div class="flex flex-col items-center gap-2 text-white/30">
            <span class="text-sm">Scroll untuk melihat</span>
            <ChevronDown :size="24" />
          </div>
        </Motion>
      </div>
    </section>

    <!-- Story Section -->
    <section id="story" class="py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-rose-500/5 to-transparent"></div>
      <div class="max-w-4xl mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
          >
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-sm mb-4">
              Our Story
            </span>
          </Motion>
          <h2 class="text-4xl sm:text-5xl font-light mb-4">Kisah Kami</h2>
        </div>

        <div class="space-y-8">
          <Motion
            v-for="(story, index) in coupleStories"
            :key="index"
            :initial="{ opacity: 0, x: story.isLeft ? -50 : 50 }"
            :whileInView="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6, delay: index * 0.2 }"
            class="relative flex items-center gap-8"
            :class="story.isLeft ? 'flex-row' : 'flex-row-reverse'"
          >
            <div class="flex-1 text-center">
              <div class="inline-block p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                <span class="text-6xl font-light text-rose-400/50">{{ story.number }}</span>
                <h3 class="text-xl font-medium mt-4 mb-2">{{ story.title }}</h3>
                <p class="text-white/60 text-sm leading-relaxed">{{ story.desc }}</p>
              </div>
            </div>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="py-24 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/5 to-transparent"></div>
      <div class="max-w-6xl mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
          >
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-sm mb-4">
              <Images :size="16" /> Gallery
            </span>
          </Motion>
          <h2 class="text-4xl sm:text-5xl font-light mb-4">Momen Kami</h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Motion
            v-for="(img, index) in images.slice(0, 6)"
            :key="index"
            :initial="{ opacity: 0, scale: 0.9 }"
            :whileInView="{ opacity: 1, scale: 1 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
            class="aspect-square rounded-2xl overflow-hidden cursor-pointer group"
            @click="openLightbox(img)"
          >
            <NuxtImg :src="img" :alt="`Gallery ${index + 1}`" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn :size="32" class="text-white" />
            </div>
          </Motion>
        </div>
      </div>
    </section>

    <LightboxModal :show="showLightbox" :image="selectedImage" :images="images" @close="showLightbox = false" />

    <!-- Location Section -->
    <section id="location" class="py-24 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent"></div>
      <div class="max-w-4xl mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
          >
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-sm mb-4">
              <MapPins :size="16" /> Location
            </span>
          </Motion>
          <h2 class="text-4xl sm:text-5xl font-light mb-4">Lokasi Acara</h2>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <Motion
            v-for="(event, key) in eventDetails"
            :key="key"
            :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
            class="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <h3 class="text-xl font-medium mb-4 flex items-center gap-2">
              <Clock :size="20" class="text-rose-400" />
              {{ event.title }}
            </h3>
            <div class="space-y-3 text-white/70">
              <p class="font-medium text-white">{{ event.time }}</p>
              <p>{{ event.location }}</p>
              <p class="text-sm text-white/50">{{ event.address }}</p>
            </div>
            <a :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(event.location)"
              target="_blank" rel="noopener noreferrer"
              class="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 transition-colors"
            >
              <MapPin :size="18" />
              Lihat di Peta
            </a>
            <button @click="addToCalendar"
              class="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors"
            >
              <Calendar :size="18" />
              Tambah ke Kalender
            </button>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Gift Section -->
    <section id="gift" class="py-24 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent"></div>
      <div class="max-w-4xl mx-auto px-4 relative z-10">
        <div class="text-center mb-16">
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
          >
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm mb-4">
              <Gift :size="16" /> Wedding Gift
            </span>
          </Motion>
          <h2 class="text-4xl sm:text-5xl font-light mb-4">Hadiah</h2>
          <p class="text-white/60">Doa restu Anda adalah hadiah terindah bagi kami. Namun jika Anda ingin memberikan hadiah, kami menyediakan:</p>
        </div>

        <!-- Tabs -->
        <div class="flex justify-center mb-8">
          <div class="inline-flex p-1 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <button
              @click="activeTab = 'bank'"
              :class="['px-6 py-3 rounded-xl transition-all', activeTab === 'bank' ? 'bg-rose-500 text-white' : 'text-white/60 hover:text-white']"
            >
              <CreditCard :size="18" class="inline mr-2" />
              Transfer Bank
            </button>
            <button
              @click="activeTab = 'digital'"
              :class="['px-6 py-3 rounded-xl transition-all', activeTab === 'digital' ? 'bg-rose-500 text-white' : 'text-white/60 hover:text-white']"
            >
              <Smartphone :size="18" class="inline mr-2" />
              Digital Wallet
            </button>
          </div>
        </div>

        <!-- Bank Accounts -->
        <div v-if="activeTab === 'bank'" class="grid sm:grid-cols-2 gap-4">
          <Motion
            v-for="(account, index) in accounts"
            :key="index"
            :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
            class="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" :style="{ backgroundColor: account.color }">
                {{ account.logo }}
              </div>
              <div>
                <h4 class="font-medium">{{ account.bank }}</h4>
                <p class="text-sm text-white/50">{{ account.owner }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <code class="flex-1 p-3 rounded-xl bg-black/20 font-mono">{{ account.number }}</code>
              <button @click="copyToClipboard(account.number, index)" class="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                <Copy v-if="copiedIndex !== index" :size="18" />
                <Check v-else :size="18" class="text-green-400" />
              </button>
            </div>
          </Motion>
        </div>

        <!-- Digital Wallets -->
        <div v-else class="grid sm:grid-cols-3 gap-4">
          <Motion
            v-for="(qr, index) in qrCodes"
            :key="index"
            :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: index * 0.1 }"
            class="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-center"
          >
            <div class="w-24 h-24 mx-auto mb-4 rounded-xl flex items-center justify-center text-white font-bold" :style="{ backgroundColor: qr.color }">
              {{ qr.logo }}
            </div>
            <h4 class="font-medium mb-1">{{ qr.bank }}</h4>
            <p class="text-sm text-white/50 mb-3">{{ qr.owner }}</p>
            <div class="flex items-center justify-center gap-2">
              <code class="p-2 rounded-lg bg-black/20 font-mono text-xs">{{ qr.number }}</code>
              <button @click="copyQr(qr.number, index)" class="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Copy v-if="copiedQrIndex !== index" :size="14" />
                <Check v-else :size="14" class="text-green-400" />
              </button>
            </div>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Wishes Section -->
    <section id="wishes" class="py-24 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-rose-500/5 to-transparent"></div>
      <div class="max-w-4xl mx-auto px-4 relative z-10">
        <div class="text-center mb-12">
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
          >
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-sm mb-4">
              <MessageSquare :size="16" /> Ucapan & Doa
            </span>
          </Motion>
          <h2 class="text-4xl sm:text-5xl font-light mb-4">Ucapan & Doa</h2>
          <p class="text-white/60">Berikan ucapan selamat dan doa restu untuk kami</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Form -->
          <Motion
            :initial="{ opacity: 0, x: -20 }"
            :whileInView="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6 }"
            class="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <h3 class="text-xl font-medium mb-6 flex items-center gap-2">
              <MessageCircle :size="20" class="text-rose-400" />
              Kirim Ucapan
            </h3>

            <form @submit.prevent="handleWish" class="space-y-4">
              <input 
                name="name"
                type="text"
                placeholder="Nama Anda"
                required
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-rose-500 transition-colors"
              />
              <textarea 
                name="message"
                rows="4"
                placeholder="Ucapan & Doa"
                required
                class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-rose-500 transition-colors resize-none"
              ></textarea>
              <button 
                type="submit"
                :disabled="wishStatus === 'loading'"
                class="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 to-violet-500 hover:from-rose-600 hover:to-violet-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send v-if="wishStatus !== 'loading'" :size="18" />
                <span v-if="wishStatus === 'loading'">Mengirim...</span>
                <span v-else-if="wishStatus === 'success'">Terkirim!</span>
                <span v-else>Kirim Ucapan</span>
              </button>
            </form>
          </Motion>

          <!-- Wishes List -->
          <Motion
            :initial="{ opacity: 0, x: 20 }"
            :whileInView="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6 }"
            class="space-y-4 max-h-[500px] overflow-y-auto pr-2"
          >
            <div v-if="wishes.length === 0" class="text-center py-12 text-white/40">
              <Heart :size="48" class="mx-auto mb-4 opacity-50" />
              <p>Belum ada ucapan</p>
              <p class="text-sm">Jadilah yang pertama!</p>
            </div>
            <div
              v-for="wish in wishes"
              :key="wish.id"
              class="p-4 rounded-2xl bg-white/5 border border-white/10"
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-violet-500 flex items-center justify-center">
                  <User :size="18" class="text-white" />
                </div>
                <div>
                  <h4 class="font-medium">{{ wish.name }}</h4>
                  <p class="text-xs text-white/40">{{ new Date(wish.created_at).toLocaleDateString('id-ID') }}</p>
                </div>
              </div>
              <p class="text-white/70 text-sm">{{ wish.message }}</p>
            </div>
          </Motion>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 border-t border-white/10">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <Heart :size="20" class="text-rose-400" />
          <span class="text-white/60">Terima kasih atas doa restu Anda</span>
          <Heart :size="20" class="text-rose-400" />
        </div>
        <p class="text-white/40 text-sm">
          &copy; {{ new Date().getFullYear() }} {{ groom }} & {{ bride }}. All Rights Reserved.
        </p>
      </div>
    </footer>
  </div>
</template>
