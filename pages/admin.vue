<script setup lang="ts">
import { Users, CheckCircle, XCircle, HelpCircle, ArrowLeft } from 'lucide-vue-next';

const { data: rsvpData, refresh: refreshRSVP } = await useFetch<{ rsvps: any[], stats: { total: number, attending: number, notAttending: number, uncertain: number, totalGuests: number } }>('/api/rsvp');
const { data: wishesData, refresh: refreshWishes } = await useFetch<any[]>('/api/wishes');

const activeTab = ref('rsvp');
const deleteWish = async (id: number) => {
  if (!confirm('Apakah Anda yakin ingin menghapus ucapan ini?')) return;
  
  try {
    await $fetch('/api/wishes', {
      method: 'DELETE' as any,
      body: { id }
    });
    await refreshWishes();
  } catch (e) {
    alert('Gagal menghapus ucapan');
  }
};

const refreshAll = () => {
  refreshRSVP();
  refreshWishes();
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <NuxtLink to="/" class="flex items-center gap-2 text-slate-500 hover:text-primary mb-2 transition-colors">
            <ArrowLeft :size="18" />
            <span>Kembali ke Undangan</span>
          </NuxtLink>
          <h1 class="text-3xl font-display font-bold text-slate-900">Dashboard Admin</h1>
          <p class="text-slate-500 text-sm">Kelola daftar tamu dan ucapan doa</p>
        </div>
        <button 
          @click="refreshAll" 
          class="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
        >
          Refresh Data
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex gap-4 mb-8">
        <button 
          @click="activeTab = 'rsvp'"
          :class="['px-6 py-2 rounded-xl font-bold transition-all', activeTab === 'rsvp' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100']"
        >
          RSVP & Kehadiran
        </button>
        <button 
          @click="activeTab = 'wishes'"
          :class="['px-6 py-2 rounded-xl font-bold transition-all', activeTab === 'wishes' ? 'bg-primary text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-100']"
        >
          Ucapan & Doa
        </button>
      </div>

      <!-- RSVP Section -->
      <div v-if="activeTab === 'rsvp'">
        <!-- Stats Grid -->
        <div v-if="rsvpData?.stats" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users :size="24" />
              </div>
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Tamu (Hadir)</p>
                <p class="text-2xl font-bold text-slate-900">{{ rsvpData?.stats?.attending ?? 0 }} Orang</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle :size="24" />
              </div>
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Konfirmasi Hadir</p>
                <p class="text-2xl font-bold text-slate-900">{{ rsvpData?.rsvps?.filter((r: any) => r.attendance === 'Hadir').length || 0 }} Data</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-red-50 text-red-600 rounded-xl">
                <XCircle :size="24" />
              </div>
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tidak Hadir</p>
                <p class="text-2xl font-bold text-slate-900">{{ rsvpData?.stats?.notAttending ?? 0 }} Data</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <HelpCircle :size="24" />
              </div>
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Ragu-ragu</p>
                <p class="text-2xl font-bold text-slate-900">{{ rsvpData?.stats?.uncertain ?? 0 }} Data</p>
              </div>
            </div>
          </div>
        </div>

        <!-- RSVP Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-6 border-bottom border-slate-100 flex items-center justify-between">
            <h3 class="font-bold text-slate-900">Daftar Konfirmasi</h3>
            <span class="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
              Total {{ rsvpData?.rsvps?.length || 0 }} Entri
            </span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th class="px-6 py-4 font-semibold">Nama</th>
                  <th class="px-6 py-4 font-semibold">Status</th>
                  <th class="px-6 py-4 font-semibold">Jumlah</th>
                  <th class="px-6 py-4 font-semibold">Waktu Konfirmasi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="rsvp in rsvpData?.rsvps" :key="rsvp.id" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <p class="font-bold text-slate-900">{{ rsvp.name }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <span 
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-bold',
                        rsvp.attendance === 'Hadir' ? 'bg-emerald-100 text-emerald-700' : 
                        rsvp.attendance === 'Tidak Hadir' ? 'bg-red-100 text-red-700' : 
                        'bg-amber-100 text-amber-700'
                      ]"
                    >
                      {{ rsvp.attendance }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-slate-600 font-medium">{{ rsvp.guests }} Orang</span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="text-slate-400 text-sm">{{ formatDate(rsvp.created_at) }}</span>
                  </td>
                </tr>
                <tr v-if="!rsvpData?.rsvps?.length">
                  <td colspan="4" class="px-6 py-12 text-center text-slate-400 italic">
                    Belum ada data konfirmasi kehadiran.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Wishes Section -->
      <div v-if="activeTab === 'wishes'">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="wish in wishesData" :key="wish.id" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-4">
                <h4 class="font-bold text-slate-900">{{ wish.name }}</h4>
                <button 
                  @click="deleteWish(wish.id)"
                  class="text-red-400 hover:text-red-600 transition-colors p-1"
                  title="Hapus Ucapan"
                >
                  <XCircle :size="18" />
                </button>
              </div>
              <p class="text-slate-600 text-sm italic mb-4">"{{ wish.message }}"</p>
            </div>
            <p class="text-slate-400 text-[10px]">{{ formatDate(wish.created_at) }}</p>
          </div>
          <div v-if="!wishesData?.length" class="col-span-full bg-white p-12 rounded-2xl border border-slate-100 text-center text-slate-400 italic">
            Belum ada ucapan doa dari tamu.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

