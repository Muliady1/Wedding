<script setup lang="ts">
import { MessageCircle, Globe, Heart, Sparkles, Mail, Phone, Instagram } from 'lucide-vue-next'
import { WEBSITE_OWNER, COUPLE } from '~/composables/useData'
import { Motion } from 'motion-v'

const currentYear = new Date().getFullYear()
const groom = COUPLE.groom
const bride = COUPLE.bride

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="relative overflow-hidden">
    <!-- Gradient Background -->
    <div class="absolute inset-0"></div>
    <!-- Wave Pattern Top -->
    <div class="absolute top-0 left-0 w-full overflow-hidden  -mt-20">
      <svg class="absolute w-full h-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="white" fill-opacity="1" d="M0,160 C240,120 480,200 720,160 C960,120 1200,200 1440,160 L1440,0 L0,0 Z"></path>
      </svg>
    </div>

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Main Content -->
      <div class="grid md:grid-cols-2 gap-12 lg:gap-16">
        <!-- Left Column - Thank You Message -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          viewport={{ once: true }}
          class="text-center md:text-left"
        >
          <!-- Logo/Brand -->
          <div class="flex items-center justify-center md:justify-start gap-2 mb-5">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Heart class="text-white" :size="24" />
            </div>
            <div>
              <h3 class="font-serif text-xl text-stone-800">{{ groom }} & {{ bride }}</h3>
              <p class="text-xs text-stone-500 uppercase tracking-wider">Wedding</p>
            </div>
          </div>
          
          <!-- Thank You Message -->
          <div class="flex items-center justify-center md:justify-start gap-3 mb-4">
            <Sparkles class="text-amber-500" :size="20" />
            <span class="text-stone-600 text-lg">Terima kasih atas doa restu Anda</span>
          </div>
          
          <p class="text-stone-500 text-sm leading-relaxed max-w-sm">
            Kehadiran Anda di hari istimewa kami adalah kebahagiaan terbesar. Teriring doa restu kami untuk Anda.
          </p>
          
          <!-- Social Links Placeholder -->
          <div class="flex items-center gap-4 mt-6 justify-center md:justify-start">
            <a href="#" class="w-10 h-10 rounded-xl bg-stone-100 hover:bg-amber-100 flex items-center justify-center text-stone-500 hover:text-amber-600 transition-colors">
              <Instagram :size="18" />
            </a>
            <a href="#" class="w-10 h-10 rounded-xl bg-stone-100 hover:bg-amber-100 flex items-center justify-center text-stone-500 hover:text-amber-600 transition-colors">
              <Mail :size="18" />
            </a>
          </div>
        </Motion>

        <!-- Right Column - Website Owner Contact -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.2 }"
          viewport={{ once: true }}
        >
          <div class="bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-200/20 border border-white/50">
            <!-- Header -->
            <div class="text-center mb-6">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 mb-4">
                <Sparkles class="text-amber-600" :size="16" />
                <span class="text-amber-700 text-sm font-medium">Jasa Pembuatan Website</span>
              </div>
              <h3 class="font-serif text-2xl text-stone-800 mb-2">Pesan Website Undangan?</h3>
              <p class="text-stone-500 text-sm">Buat website undangan pernikahan elegant untuk hari istimewa Anda</p>
            </div>
            
            <!-- Contact Buttons -->
            <div class="grid sm:grid-cols-2 gap-4">
              <a 
                :href="`https://wa.me/${WEBSITE_OWNER.whatsapp}`" 
                target="_blank"
                class="group flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02]"
              >
                <MessageCircle :size="20" class="group-hover:scale-110 transition-transform" />
                <div class="text-left">
                  <p class="text-xs opacity-80">Chat WhatsApp</p>
                  <p class="text-sm font-bold">Konsultasi Gratis</p>
                </div>
              </a>
              <a 
                :href="WEBSITE_OWNER.website" 
                target="_blank"
                class="group flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02]"
              >
                <Globe :size="20" class="group-hover:rotate-12 transition-transform" />
                <div class="text-left">
                  <p class="text-xs opacity-80">Kunjungi</p>
                  <p class="text-sm font-bold">Website Kami</p>
                </div>
              </a>
            </div>
            
            <!-- Contact Info -->
            <div class="mt-6 pt-6 border-t border-stone-100">
              <p class="text-center text-stone-400 text-sm">atau hubungi langsung</p>
              <div class="flex items-center justify-center gap-4 mt-3">
                <a :href="`https://wa.me/${WEBSITE_OWNER.whatsapp}`" class="flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors">
                  <Phone :size="16" />
                  <span class="text-sm">{{ WEBSITE_OWNER.whatsapp }}</span>
                </a>
              </div>
            </div>
          </div>
        </Motion>
      </div>

      <!-- Divider -->
      <div class="mt-16 mb-8">
        <div class="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent"></div>
      </div>

      <!-- Copyright -->
      <Motion
        :initial="{ opacity: 0 }"
        :whileInView="{ opacity: 1 }"
        :transition="{ duration: 0.6 }"
        viewport={{ once: true }}
        class="text-center"
      >
        <div class="flex items-center justify-center gap-2 mb-3">
          <Heart class="text-amber-500 animate-pulse" :size="18" />
          <span class="text-stone-500">Terima kasih telah menjadi bagian dari hari istimewa kami</span>
          <Heart class="text-amber-500 animate-pulse" :size="18" />
        </div>
        
        <p class="text-stone-400 text-sm">
          © {{ currentYear }} <span class="font-semibold text-amber-600">{{ groom }} & {{ bride }}</span>. All Rights Reserved.
        </p>
        <p class="text-stone-300 text-xs mt-2">
          Dibuat dengan ❤️ oleh <a :href="WEBSITE_OWNER.website" target="_blank" class="hover:text-amber-600 transition-colors">{{ WEBSITE_OWNER.name }}</a>
        </p>
         
      </Motion>
    </div>
  </footer>
</template>

<script lang="ts">
const groom = 'Anindita'
const bride = 'Rizky'
</script>
