<script setup lang="ts">
import { MessageCircle, Globe, Instagram, Mail } from 'lucide-vue-next'
import { WEBSITE_OWNER } from '~/composables/useData'
import { Motion } from 'motion-v'


const instagramUrl = computed(() => {
  const ig = WEBSITE_OWNER.instagram
  return ig ? `https://instagram.com/${ig.replace('@', '')}` : '#'
})
</script>

<template>
  <footer class="relative">
    <div class="pt-6 pb-4">
      <div class="max-w-md mx-auto px-4">
        <Motion :initial="{ opacity: 0, y: 10 }" :whileInView="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }"
          :viewport="{ once: true }">
          <div class="bg-white rounded-xl p-4 shadow-sm border border-stone-100 text-center">
            <!-- Promo Text -->
            <p class="text-xs text-stone-600 mb-3">
              Ingin punya website undangan pernikahan seperti ini?<br />
              <span class="text-amber-600 font-medium">Pesan sekarang ke kami!</span>
            </p>

            <!-- Icons Row -->
            <div class="flex items-center justify-center gap-2">
              <a :href="instagramUrl" target="_blank"
                class="p-2 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 text-white hover:opacity-80">
                <Instagram class="w-4 h-4" />
              </a>
              <a :href="`mailto:${WEBSITE_OWNER.email}`"
                class="p-2 rounded-lg bg-stone-600 text-white hover:bg-stone-700">
                <Mail class="w-4 h-4" />
              </a>
              <a :href="`https://wa.me/${WEBSITE_OWNER.whatsapp}`" target="_blank"
                class="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
                <MessageCircle class="w-4 h-4" />
              </a>
              <a :href="WEBSITE_OWNER.website" target="_blank"
                class="p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600">
                <Globe class="w-4 h-4" />
              </a>
            </div>
          </div>
        </Motion>
        <Motion :initial="{ opacity: 0 }" :whileInView="{ opacity: 1 }" :transition="{ duration: 0.5, delay: 0.2 }"
          :viewport="{ once: true }" class="mt-3 text-center">
          <p class="text-[10px] text-stone-400">
            ©
            <a :href="WEBSITE_OWNER.website" target="_blank" class="text-amber-600">{{ WEBSITE_OWNER.name }}</a>
          </p>
        </Motion>
      </div>
    </div>
  </footer>
</template>
