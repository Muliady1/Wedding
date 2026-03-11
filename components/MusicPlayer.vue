<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { Music, Volume2, VolumeX, SkipForward, SkipBack, ListMusic } from 'lucide-vue-next';
import { Motion, AnimatePresence } from 'motion-v';

const isPlaying = ref(false);
const audioRef = ref<HTMLAudioElement | null>(null);
const isOpened = useState('isOpened');
const showPlaylist = ref(false);
const playPromise = ref<Promise<void> | null>(null);
const isMenuOpen = ref(false);

const playlist = [
  { title: 'Anugerah Terindah - Andmesh', src: '/music/ANDMESH - ANUGERAH TERINDAH (OFFICIAL MUSIC VIDEO).mp3' },
  { title: 'Nanti Kita Seperti Ini - Batas Senja', src: '/music/BATAS SENJA - NANTI KITA SEPERTI INI ( official video lirik ).mp3' }
];

const currentSongIndex = ref(0);

const toggleMusic = async () => {
  if (!audioRef.value) return;
  
  try {
    if (isPlaying.value) {
      await playPromise.value;
      audioRef.value.pause();
      isPlaying.value = false;
    } else {
      playPromise.value = audioRef.value.play();
      await playPromise.value;
      isPlaying.value = true;
    }
  } catch (err: unknown) {
    console.error("Playback error:", err);
  }
};

const playCurrentSong = async () => {
  if (!audioRef.value) return;
  
  try {
    audioRef.value.pause();
    await nextTick();
    audioRef.value.load();
    
    playPromise.value = audioRef.value.play();
    await playPromise.value;
    isPlaying.value = true;
  } catch (err: unknown) {
    if (err instanceof Error && err.name !== 'AbortError') {
      console.error("Error playing song:", err);
    }
  }
};

const nextSong = () => {
  currentSongIndex.value = (currentSongIndex.value + 1) % playlist.length;
  playCurrentSong();
};

const prevSong = () => {
  currentSongIndex.value = (currentSongIndex.value - 1 + playlist.length) % playlist.length;
  playCurrentSong();
};

const selectSong = (index: number) => {
  currentSongIndex.value = index;
  showPlaylist.value = false;
  playCurrentSong();
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (!isMenuOpen.value) {
    showPlaylist.value = false;
  }
};

// Auto play when invitation is opened
watch(isOpened, async (val) => {
  if (val && audioRef.value) {
    try {
      playPromise.value = audioRef.value.play();
      await playPromise.value;
      isPlaying.value = true;
    } catch (err: unknown) {
      console.log("Autoplay blocked or interrupted");
    }
  }
});

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.volume = 0.4;
  }
});
</script>

<template>
  <div class="fixed bottom-24 right-6 z-[70] flex flex-col items-end gap-3">
    <audio 
      ref="audioRef" 
      :src="playlist[currentSongIndex]?.src" 
      loop
    ></audio>
    
    <AnimatePresence>
      <Motion 
        v-if="isOpened" 
        drag
        :dragConstraints="{ left: -300, right: 0, top: -500, bottom: 0 }"
        class="flex flex-col items-end gap-3 touch-none"
      >
        <!-- Playlist Menu -->
        <Motion
          v-if="showPlaylist && isMenuOpen"
          :initial="{ opacity: 0, y: 10, scale: 0.95 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :exit="{ opacity: 0, y: 10, scale: 0.95 }"
          class="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 p-3 min-w-[200px] mb-2 cursor-default"
          @pointerdown.stop
        >
          <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 px-2">Pilih Lagu</p>
          <div class="flex flex-col gap-1">
            <button 
              v-for="(song, index) in playlist" 
              :key="index"
              @click="selectSong(index)"
              :class="[
                'text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between',
                currentSongIndex === index ? 'bg-primary text-white' : 'hover:bg-slate-100 text-slate-700'
              ]"
            >
              <span>{{ song.title }}</span>
              <Music v-if="currentSongIndex === index" :size="12" />
            </button>
          </div>
        </Motion>

        <!-- Controls Container -->
        <div class="flex flex-col items-center gap-3 cursor-move">
          <!-- Expanded Controls -->
          <AnimatePresence>
            <Motion
              v-if="isMenuOpen"
              :initial="{ opacity: 0, y: 20, scale: 0.8 }"
              :animate="{ opacity: 1, y: 0, scale: 1 }"
              :exit="{ opacity: 0, y: 20, scale: 0.8 }"
              class="flex flex-col items-center gap-3"
            >
              <button 
                @click="showPlaylist = !showPlaylist"
                @pointerdown.stop
                :class="[
                  'w-10 h-10 rounded-full backdrop-blur-md shadow-lg border transition-all flex items-center justify-center active:scale-95',
                  showPlaylist ? 'bg-primary text-white border-primary' : 'bg-white/90 text-slate-600 border-slate-200'
                ]"
                title="Daftar Lagu"
              >
                <ListMusic :size="16" />
              </button>

              <!-- Previous Button -->
              <button 
                @click="prevSong"
                @pointerdown.stop
                class="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary transition-colors active:scale-95"
                title="Lagu Sebelumnya"
              >
                <SkipBack :size="16" />
              </button>

              <!-- Next Button -->
              <button 
                @click="nextSong"
                @pointerdown.stop
                class="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary transition-colors active:scale-95"
                title="Lagu Berikutnya"
              >
                <SkipForward :size="16" />
              </button>

              <!-- Play/Pause Button -->
              <button 
                @click="toggleMusic"
                @pointerdown.stop
                class="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-slate-200 flex items-center justify-center text-slate-800 hover:scale-110 transition-transform group relative active:scale-95"
              >
                <Volume2 v-if="isPlaying" :size="16" />
                <VolumeX v-else :size="16" class="text-slate-400" />
              </button>
            </Motion>
          </AnimatePresence>

          <!-- Main Trigger Button -->
          <button 
            @click="toggleMenu"
            @pointerdown.stop
            class="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md shadow-2xl border border-slate-200 flex items-center justify-center text-slate-800 hover:scale-105 transition-transform group relative active:scale-95"
          >
            <div v-if="isPlaying" class="absolute inset-0 rounded-full bg-accent/20 animate-ping"></div>
            
            <div v-if="isMenuOpen" class="text-primary">
              <Music :size="24" class="animate-pulse" />
            </div>
            <div v-else class="relative">
              <Music :size="24" :class="isPlaying ? 'text-primary' : 'text-slate-400'" />
              <div v-if="isPlaying" class="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
                <Motion 
                  v-for="i in 2" 
                  :key="i"
                  :animate="{ y: [-5, -15, -5], opacity: [0, 1, 0] }"
                  :transition="{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }"
                >
                  <Music :size="10" class="text-accent" />
                </Motion>
              </div>
            </div>
          </button>
        </div>
      </Motion>
    </AnimatePresence>
  </div>
</template>
