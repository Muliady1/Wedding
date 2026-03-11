<script setup lang="ts">
import { MessageCircle, Globe, Heart, Instagram, Mail } from 'lucide-vue-next'
import { WEBSITE_OWNER, COUPLE } from '~/composables/useData'
import { Motion } from 'motion-v'

const currentYear = new Date().getFullYear()
const groom = COUPLE.groom
const bride = COUPLE.bride

const instagramUrl = computed(() => {
  const ig = WEBSITE_OWNER.instagram
  return ig ? `https://instagram.com/${ig.replace('@', '')}` : '#'
})
</script>

<template>
  <footer class="relative">
    <!-- Wave Pattern -->
    <div class="absolute top-0 left-0 w-full -mt-8 pointer-events-none">
      <svg class="w-full h-8" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#fafaf9" d="M0,224 L48,213.3 C96,203 192,181 288,181.3 C384,181 480,203 576,224 C672,245 768,267 864,250.7 C960,235 1056,181 1152,165.3 C1248,149 1344,171 1392,181.3 L1440,192 L1440,320 L0,320 Z"></path>
      </svg>
    </div>

    <div class="bg-stone-50 pt-6 pb-4">
      <div class="max-w-md mx-auto px-4">
        
        <!-- Small Promo Card -->
        <Motion
          :initial="{ opacity: 0, y: 10 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
          :viewport="{ once: true }"
        >
          <div class="bg-white rounded-xl p-3 shadow-sm border border-stone-100">
            <div class="flex items-center justify-between gap-3">
              <!-- Couple -->
              <div class="text-xs text-stone-500">
                <span class="font-medium text-stone-600">{{ bride }} & {{ groom }}</span>
              </div>
              
              <!-- Divider -->
              <div class="h-4 w-px bg-stone-200"></div>
              
              <!-- Promo -->
              <div class="flex items-center gap-2">
                <a :href="instagramUrl" target="_blank" class="p-1.5 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 text-white">
                  <Instagram class="w-3 h-3" />
                </a>
                <a :href="`mailto:${WEBSITE_OWNER.email}`" class="p-1.5 rounded-lg bg-stone-600 text-white">
                  <Mail class="w-3 h-3" />
                </a>
                <a :href="`https://wa.me/${WEBSITE_OWNER.whatsapp}`" target="_blank" class="p-1.5 rounded-lg bg-green-500 text-white">
                  <MessageCircle class="w-3 h-3" />
                </a>
                <a :href="WEBSITE_OWNER.website" target="_blank" class="p-1.5 rounded-lg bg-amber-500 text-white">
                  <Globe class="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </Motion>

        <!-- Copyright -->
        <Motion
          :initial="{ opacity: 0 }"
          :whileInView="{ opacity: 1 }"
          :transition="{ duration: 0.5, delay: 0.2 }"
          :viewport="{ once: true }"
          class="mt-3 text-center"
        >
          <p class="text-[10px] text-stone-400">
            © {{ currentYear }} {{ bride }} & {{ groom }} • 
            <a :href="WEBSITE_OWNER.website" target="_blank" class="text-amber-600">{{ WEBSITE_OWNER.name }}</a>
          </p>
        </Motion>
      </div>
    </div>
  </footer>
</template>
