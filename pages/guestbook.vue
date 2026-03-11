<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { MessageSquare, Send, ArrowLeft, BookOpen, Heart, Check } from 'lucide-vue-next';
import { Motion, AnimatePresence } from 'motion-v';
import { COUPLE } from '~/composables/useData';

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

onMounted(fetchWishes);
</script>

<template>
  <div class="min-h-screen bg-[#fdfbf7] font-sans selection:bg-accent/30">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-4 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 text-slate-600 hover:text-accent transition-colors group">
          <ArrowLeft :size="20" class="group-hover:-translate-x-1 transition-transform" />
          <span class="font-medium">Kembali ke Undangan</span>
        </NuxtLink>
        <div class="flex items-center gap-2 text-accent font-display text-xl">
          <BookOpen :size="24" />
          <span>Guest Book</span>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-12">
      <div class="grid lg:grid-cols-12 gap-12">
        <!-- Left Side: Form -->
        <div class="lg:col-span-5">
          <Motion 
            :initial="{ opacity: 0, x: -20 }"
            :animate="{ opacity: 1, x: 0 }"
            class="sticky top-24"
          >
            <!-- Premium Wish Form Card -->
            <div class="bg-gradient-to-br from-white via-white to-rose-50/30 p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/60 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-100/40 to-transparent rounded-tr-3xl"></div>
              <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100/30 to-transparent rounded-bl-3xl"></div>
              
              <div class="relative z-10">
                <div class="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mb-4 shadow-lg shadow-rose-500/30">
                  <Heart :size="24" class="text-white" />
                </div>
                <h2 class="text-2xl font-serif text-slate-800 text-center mb-2">Buku Tamu Digital</h2>
                <p class="text-slate-500 text-center mb-6">Kehadiran Anda adalah hadiah terindah. Silakan tinggalkan pesan dan doa untuk kami.</p>

                <form @submit.prevent="handleWish" class="space-y-5">
                  <div>
                    <label class="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">Nama Lengkap</label>
                    <input 
                      name="name"
                      required
                      placeholder="Contoh: Budi Santoso"
                      class="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">Pesan & Doa</label>
                    <textarea 
                      name="message"
                      required
                      placeholder="Tuliskan pesan manis Anda di sini..."
                      rows="5"
                      class="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 focus:border-rose-300 focus:ring-4 focus:ring-rose-100/50 outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    :disabled="wishStatus !== 'idle'"
                    class="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-5 rounded-2xl font-bold hover:shadow-xl hover:shadow-rose-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <template v-if="wishStatus === 'loading'">
                      <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Mengirim...</span>
                    </template>
                    <template v-else-if="wishStatus === 'success'">
                      <Check :size="20" />
                      <span>Terkirim! ✨</span>
                    </template>
                    <template v-else>
                      <Send :size="20" />
                      <span>Kirim Pesan</span>
                    </template>
                  </button>
                </form>
              </div>
            </div>
          </Motion>
        </div>

        <!-- Right Side: Messages -->
        <div class="lg:col-span-7">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-bold text-slate-800">Pesan Terbaru</h2>
            <span class="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold">{{ wishes.length }} Pesan</span>
          </div>

          <div class="space-y-6">
            <AnimatePresence>
              <Motion 
                v-for="(wish, idx) in wishes"
                :key="wish.id"
                :initial="{ opacity: 0, y: 20 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ delay: idx * 0.05 }"
                class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div class="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div class="flex items-start gap-4 mb-4">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-accent font-bold text-lg">
                    {{ wish.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 text-lg">{{ wish.name }}</h4>
                    <p class="text-xs text-slate-400 flex items-center gap-1">
                      <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                      {{ new Date(wish.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}
                    </p>
                  </div>
                </div>
                
                <div class="relative">
                  <span class="absolute -top-2 -left-2 text-4xl text-accent/10 font-serif">"</span>
                  <p class="text-slate-600 leading-relaxed italic relative z-10 pl-2">
                    {{ wish.message }}
                  </p>
                </div>
              </Motion>
            </AnimatePresence>

            <div v-if="wishes.length === 0" class="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
              <MessageSquare class="mx-auto mb-4 text-slate-200" :size="48" />
              <p class="text-slate-400 font-medium">Belum ada pesan di buku tamu ini.</p>
              <p class="text-sm text-slate-300">Jadilah yang pertama memberikan ucapan!</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-12 border-t border-slate-100 text-center">
      <p class="text-slate-400 text-sm">© {{ COUPLE.date.split('-')[0] }} {{ COUPLE.groom }} & {{ COUPLE.bride }} Wedding. All rights reserved.</p>
    </footer>
  </div>
</template>

<style scoped>
.font-display {
  font-family: 'Playfair Display', serif;
}
</style>
