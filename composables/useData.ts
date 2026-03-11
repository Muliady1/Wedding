import { CircleCheck, CircleX, CircleHelp } from 'lucide-vue-next'

// ===== TEMPLATE DATA - Each template has its own unique data =====

// Classic & Elegant Templates
export const stories = [
  { year: "2022", title: "Pertemuan Pertama", desc: "Di sebuah sore yang indah, takdir mempertemukan kami. Dari situlah segalanya dimulai." },
  { year: "2024", title: "Komitmen", desc: "Setelah dua tahun berbagi cerita, tawa, dan air mata, kami memutuskan untuk melangkah ke jenjang yang lebih serius." },
  { year: "2026", title: "Hari Bahagia", desc: "Hari ini, kami mengundang Anda untuk menjadi saksi janji suci kami. Sebuah awal baru yang kami tunggu." }
];

export const galleryImages = [
  { src: "https://picsum.photos/seed/classic1/600/800", alt: "Gallery 1" },
  { src: "https://picsum.photos/seed/classic2/800/600", alt: "Gallery 2" },
  { src: "https://picsum.photos/seed/classic3/600/600", alt: "Gallery 3" },
  { src: "https://picsum.photos/seed/classic4/800/1000", alt: "Gallery 4" },
  { src: "https://picsum.photos/seed/classic5/600/800", alt: "Gallery 5" },
  { src: "https://picsum.photos/seed/classic6/800/600", alt: "Gallery 6" }
];

// Modern Minimalist Template Data
export const modernMinimalistData = {
  stories: [
    { year: "2022", title: "Pertemuan Pertama", desc: "Di sebuah sore yang indah, takdir mempertemukan kami. Dari situlah segalanya dimulai." },
    { year: "2024", title: "Komitmen", desc: "Setelah dua tahun berbagi cerita, tawa, dan air mata, kami memutuskan untuk melangkah ke jenjang yang lebih serius." },
    { year: "2026", title: "Hari Bahagia", desc: "Hari ini, kami mengundang Anda untuk menjadi saksi janji suci kami." }
  ],
  galleryImages: [
    { src: "https://picsum.photos/seed/minimal1/600/800", alt: "Gallery 1" },
    { src: "https://picsum.photos/seed/minimal2/800/600", alt: "Gallery 2" },
    { src: "https://picsum.photos/seed/minimal3/600/600", alt: "Gallery 3" },
    { src: "https://picsum.photos/seed/minimal4/800/1000", alt: "Gallery 4" },
    { src: "https://picsum.photos/seed/minimal5/600/800", alt: "Gallery 5" },
    { src: "https://picsum.photos/seed/minimal6/800/600", alt: "Gallery 6" }
  ],
  accounts: [
    { bank: 'BCA', number: '1234567890', owner: 'Aris Setiawan', color: '#1a1a1a', logo: 'B' },
    { bank: 'Mandiri', number: '0987654321', owner: 'Siska Putri', color: '#333333', logo: 'M' }
  ],
  qrCodes: [
    { bank: 'DANA', number: '081234567890', owner: 'Aris Setiawan', color: '#1a1a1a', logo: 'D' },
    { bank: 'OVO', number: '081234567890', owner: 'Siska Putri', color: '#333333', logo: 'O' }
  ],
  eventLocations: {
    akad: { title: 'Akad Nikah', time: '08:00 - 10:00', location: 'Grand Ballroom, Jakarta', address: 'Jl. Sudirman No. 1, Jakarta Pusat' },
    resepsi: { title: 'Resepsi', time: '10:00 - 14:00', location: 'Grand Ballroom, Jakarta', address: 'Jl. Sudirman No. 1, Jakarta Pusat' }
  }
};

// Romantic Garden Template Data
export const romanticGardenData = {
  stories: [
    { year: "2022", title: "Pertemuan Pertama", desc: "Di sebuah taman yang indah, takdir mempertemukan kami. Dari situlah segalanya dimulai." },
    { year: "2024", title: "Komitmen", desc: "Setelah dua tahun berbagi cerita, tawa, dan air mata, kami memutuskan untuk melangkah ke jenjang yang lebih serius." },
    { year: "2026", title: "Hari Bahagia", desc: "Hari ini, kami mengundang Anda untuk menjadi saksi janji suci kami." }
  ],
  galleryImages: [
    { src: "https://picsum.photos/seed/garden1/600/800", alt: "Gallery 1" },
    { src: "https://picsum.photos/seed/garden2/800/600", alt: "Gallery 2" },
    { src: "https://picsum.photos/seed/garden3/600/600", alt: "Gallery 3" },
    { src: "https://picsum.photos/seed/garden4/800/1000", alt: "Gallery 4" },
    { src: "https://picsum.photos/seed/garden5/600/800", alt: "Gallery 5" },
    { src: "https://picsum.photos/seed/garden6/800/600", alt: "Gallery 6" }
  ],
  accounts: [
    { bank: 'BCA', number: '1234567890', owner: 'Aris Setiawan', color: '#5D8A66', logo: 'B' },
    { bank: 'Mandiri', number: '0987654321', owner: 'Siska Putri', color: '#7BA05B', logo: 'M' }
  ],
  qrCodes: [
    { bank: 'DANA', number: '081234567890', owner: 'Aris Setiawan', color: '#5D8A66', logo: 'D' },
    { bank: 'OVO', number: '081234567890', owner: 'Siska Putri', color: '#7BA05B', logo: 'O' }
  ],
  eventLocations: {
    akad: { title: 'Akad Nikah', time: '08:00 - 10:00', location: 'Taman Botanica, Jakarta', address: 'Jl. Kemang Raya No. 1, Jakarta Selatan' },
    resepsi: { title: 'Resepsi', time: '10:00 - 14:00', location: 'Taman Botanica, Jakarta', address: 'Jl. Kemang Raya No. 1, Jakarta Selatan' }
  }
};

// Vintage Bohemian Template Data
export const vintageBohemianData = {
  stories: [
    { year: "2022", title: "Pertemuan Pertama", desc: "Di sebuah sore yang penuh warna, takdir mempertemukan kami. Dari situlah segalanya dimulai." },
    { year: "2024", title: "Komitmen", desc: "Setelah dua tahun berbagi cerita, tawa, dan air mata, kami memutuskan untuk melangkah ke jenjang yang lebih serius." },
    { year: "2026", title: "Hari Bahagia", desc: "Hari ini, kami mengundang Anda untuk menjadi saksi janji suci kami." }
  ],
  galleryImages: [
    { src: "https://picsum.photos/seed/boho1/600/800", alt: "Gallery 1" },
    { src: "https://picsum.photos/seed/boho2/800/600", alt: "Gallery 2" },
    { src: "https://picsum.photos/seed/boho3/600/600", alt: "Gallery 3" },
    { src: "https://picsum.photos/seed/boho4/800/1000", alt: "Gallery 4" },
    { src: "https://picsum.photos/seed/boho5/600/800", alt: "Gallery 5" },
    { src: "https://picsum.photos/seed/boho6/800/600", alt: "Gallery 6" }
  ],
  accounts: [
    { bank: 'BCA', number: '1234567890', owner: 'Aris Setiawan', color: '#8B4513', logo: 'B' },
    { bank: 'Mandiri', number: '0987654321', owner: 'Siska Putri', color: '#A0522D', logo: 'M' }
  ],
  qrCodes: [
    { bank: 'DANA', number: '081234567890', owner: 'Aris Setiawan', color: '#8B4513', logo: 'D' },
    { bank: 'OVO', number: '081234567890', owner: 'Siska Putri', color: '#A0522D', logo: 'O' }
  ],
  eventLocations: {
    akad: { title: 'Akad Nikah', time: '08:00 - 10:00', location: 'Hutan Raya, Jakarta', address: 'Jl. RM Harsono No. 1, Jakarta Selatan' },
    resepsi: { title: 'Resepsi', time: '10:00 - 14:00', location: 'Hutan Raya, Jakarta', address: 'Jl. RM Harsono No. 1, Jakarta Selatan' }
  }
};

// Luxe Gold Template Data
export const luxeGoldData = {
  stories: [
    { year: "2022", title: "Pertemuan Pertama", desc: "Di momen yang sempurna, kami dipertemukan. Sebuah awal yang indah." },
    { year: "2024", title: "Komitmen", desc: "Dengan cinta dan kesetiaan, kami memutuskan untuk bersama selamanya." },
    { year: "2026", title: "Hari Bahagia", desc: "Hari dimana mimpi menjadi kenyataan." }
  ],
  galleryImages: [
    { src: "https://picsum.photos/seed/luxe1/600/800", alt: "Gallery 1" },
    { src: "https://picsum.photos/seed/luxe2/800/600", alt: "Gallery 2" },
    { src: "https://picsum.photos/seed/luxe3/600/600", alt: "Gallery 3" },
    { src: "https://picsum.photos/seed/luxe4/800/1000", alt: "Gallery 4" },
    { src: "https://picsum.photos/seed/luxe5/600/800", alt: "Gallery 5" },
    { src: "https://picsum.photos/seed/luxe6/800/600", alt: "Gallery 6" }
  ],
  accounts: [
    { bank: 'BCA', number: '1234567890', owner: 'Aris Setiawan', color: '#D4AF37', logo: 'B' },
    { bank: 'Mandiri', number: '0987654321', owner: 'Siska Putri', color: '#C5A028', logo: 'M' }
  ],
  qrCodes: [
    { bank: 'DANA', number: '081234567890', owner: 'Aris Setiawan', color: '#D4AF37', logo: 'D' },
    { bank: 'OVO', number: '081234567890', owner: 'Siska Putri', color: '#C5A028', logo: 'O' }
  ],
  eventLocations: {
    akad: { title: 'Akad Nikah', time: '08:00 - 10:00', location: 'The Luxury Hall, Jakarta', address: 'Jl. Thamrin No. 1, Jakarta Pusat' },
    resepsi: { title: 'Resepsi', time: '10:00 - 14:00', location: 'The Luxury Hall, Jakarta', address: 'Jl. Thamrin No. 1, Jakarta Pusat' }
  }
};

// Tropical Paradise Template Data
export const tropicalParadiseData = {
  stories: [
    { year: "2022", title: "Pertemuan Pertama", desc: "Di bawah sinar matahari tropis, kami dipertemukan." },
    { year: "2024", title: "Komitmen", desc: "Dengan hati yang hangat, kami誓言 berkomitmen untuk bersama." },
    { year: "2026", title: "Hari Bahagia", desc: "Rayakan cinta kami disurga tropis ini." }
  ],
  galleryImages: [
    { src: "https://picsum.photos/seed/tropical1/600/800", alt: "Gallery 1" },
    { src: "https://picsum.photos/seed/tropical2/800/600", alt: "Gallery 2" },
    { src: "https://picsum.photos/seed/tropical3/600/600", alt: "Gallery 3" },
    { src: "https://picsum.photos/seed/tropical4/800/1000", alt: "Gallery 4" },
    { src: "https://picsum.photos/seed/tropical5/600/800", alt: "Gallery 5" },
    { src: "https://picsum.photos/seed/tropical6/800/600", alt: "Gallery 6" }
  ],
  accounts: [
    { bank: 'BCA', number: '1234567890', owner: 'Aris Setiawan', color: '#FF6B35', logo: 'B' },
    { bank: 'Mandiri', number: '0987654321', owner: 'Siska Putri', color: '#F7C59F', logo: 'M' }
  ],
  qrCodes: [
    { bank: 'DANA', number: '081234567890', owner: 'Aris Setiawan', color: '#FF6B35', logo: 'D' },
    { bank: 'OVO', number: '081234567890', owner: 'Siska Putri', color: '#F7C59F', logo: 'O' }
  ],
  eventLocations: {
    akad: { title: 'Akad Nikah', time: '08:00 - 10:00', location: 'Pantai Paradise, Bali', address: 'Jl. Pantai Kuta No. 1, Bali' },
    resepsi: { title: 'Resepsi', time: '10:00 - 14:00', location: 'Pantai Paradise, Bali', address: 'Jl. Pantai Kuta No. 1, Bali' }
  }
};

// Rustic Chic Template Data
export const rusticChicData = {
  stories: [
    { year: "2022", title: "Pertemuan Pertama", desc: "Di tengah keindahan alam, kami dipertemukan." },
    { year: "2024", title: "Komitmen", desc: "Dengan kesederhanaan, kami memilih untuk bersama." },
    { year: "2026", title: "Hari Bahagia", desc: "Rayakan cinta kami di tengah alam yang asri." }
  ],
  galleryImages: [
    { src: "https://picsum.photos/seed/rustic1/600/800", alt: "Gallery 1" },
    { src: "https://picsum.photos/seed/rustic2/800/600", alt: "Gallery 2" },
    { src: "https://picsum.photos/seed/rustic3/600/600", alt: "Gallery 3" },
    { src: "https://picsum.photos/seed/rustic4/800/1000", alt: "Gallery 4" },
    { src: "https://picsum.photos/seed/rustic5/600/800", alt: "Gallery 5" },
    { src: "https://picsum.photos/seed/rustic6/800/600", alt: "Gallery 6" }
  ],
  accounts: [
    { bank: 'BCA', number: '1234567890', owner: 'Aris Setiawan', color: '#8B7355', logo: 'B' },
    { bank: 'Mandiri', number: '0987654321', owner: 'Siska Putri', color: '#6B8E23', logo: 'M' }
  ],
  qrCodes: [
    { bank: 'DANA', number: '081234567890', owner: 'Aris Setiawan', color: '#8B7355', logo: 'D' },
    { bank: 'OVO', number: '081234567890', owner: 'Siska Putri', color: '#6B8E23', logo: 'O' }
  ],
  eventLocations: {
    akad: { title: 'Akad Nikah', time: '08:00 - 10:00', location: 'Villa Nusantara, Bandung', address: 'Jl. Dago No. 1, Bandung' },
    resepsi: { title: 'Resepsi', time: '10:00 - 14:00', location: 'Villa Nusantara, Bandung', address: 'Jl. Dago No. 1, Bandung' }
  }
};

// Fairy Tale Template Data
export const fairyTaleData = {
  stories: [
    { year: "2022", title: "Pertemuan Pertama", desc: "Seperti dongeng, kami dipertemukan oleh takdir." },
    { year: "2024", title: "Komitmen", desc: "Dengan janji yang tulus, kami memulai perjalanan." },
    { year: "2026", title: "Hari Bahagia", desc: "Mimpi menjadi kenyataan di istana cinta kami." }
  ],
  galleryImages: [
    { src: "https://picsum.photos/seed/fairy1/600/800", alt: "Gallery 1" },
    { src: "https://picsum.photos/seed/fairy2/800/600", alt: "Gallery 2" },
    { src: "https://picsum.photos/seed/fairy3/600/600", alt: "Gallery 3" },
    { src: "https://picsum.photos/seed/fairy4/800/1000", alt: "Gallery 4" },
    { src: "https://picsum.photos/seed/fairy5/600/800", alt: "Gallery 5" },
    { src: "https://picsum.photos/seed/fairy6/800/600", alt: "Gallery 6" }
  ],
  accounts: [
    { bank: 'BCA', number: '1234567890', owner: 'Aris Setiawan', color: '#9B59B6', logo: 'B' },
    { bank: 'Mandiri', number: '0987654321', owner: 'Siska Putri', color: '#8E44AD', logo: 'M' }
  ],
  qrCodes: [
    { bank: 'DANA', number: '081234567890', owner: 'Aris Setiawan', color: '#9B59B6', logo: 'D' },
    { bank: 'OVO', number: '081234567890', owner: 'Siska Putri', color: '#8E44AD', logo: 'O' }
  ],
  eventLocations: {
    akad: { title: 'Akad Nikah', time: '08:00 - 10:00', location: 'Castle Garden, Jakarta', address: 'Jl. Kemang Raya No. 1, Jakarta' },
    resepsi: { title: 'Resepsi', time: '10:00 - 14:00', location: 'Castle Garden, Jakarta', address: 'Jl. Kemang Raya No. 1, Jakarta' }
  }
};

// Modern Geometric Template Data
export const modernGeometricData = {
  stories: [
    { year: "2022", title: "Pertemuan Pertama", desc: "Di momen yang sempurna, kami dipertemukan." },
    { year: "2024", title: "Komitmen", desc: "Dengan cinta, kami memilih untuk bersama." },
    { year: "2026", title: "Hari Bahagia", desc: "Rayakan cinta kami." }
  ],
  galleryImages: [
    { src: "https://picsum.photos/seed/geo1/600/800", alt: "Gallery 1" },
    { src: "https://picsum.photos/seed/geo2/800/600", alt: "Gallery 2" },
    { src: "https://picsum.photos/seed/geo3/600/600", alt: "Gallery 3" },
    { src: "https://picsum.photos/seed/geo4/800/1000", alt: "Gallery 4" },
    { src: "https://picsum.photos/seed/geo5/600/800", alt: "Gallery 5" },
    { src: "https://picsum.photos/seed/geo6/800/600", alt: "Gallery 6" }
  ],
  accounts: [
    { bank: 'BCA', number: '1234567890', owner: 'Aris Setiawan', color: '#2C3E50', logo: 'B' },
    { bank: 'Mandiri', number: '0987654321', owner: 'Siska Putri', color: '#E74C3C', logo: 'M' }
  ],
  qrCodes: [
    { bank: 'DANA', number: '081234567890', owner: 'Aris Setiawan', color: '#2C3E50', logo: 'D' },
    { bank: 'OVO', number: '081234567890', owner: 'Siska Putri', color: '#E74C3C', logo: 'O' }
  ],
  eventLocations: {
    akad: { title: 'Akad Nikah', time: '08:00 - 10:00', location: 'The Geometric Hall', address: 'Jakarta' },
    resepsi: { title: 'Resepsi', time: '10:00 - 14:00', location: 'The Geometric Hall', address: 'Jakarta' }
  }
};

// Soft Pastel Template Data
export const softPastelData = {
  stories: [
    { year: "2022", title: "Pertemuan", desc: "Awalan cerita indah kami" },
    { year: "2024", title: "Komitmen", desc: "Janji yang kami buat" },
    { year: "2026", title: "Bahagia", desc: "Harapan terkabul" }
  ],
  galleryImages: [
    { src: "https://picsum.photos/seed/pastel1/600/800", alt: "Gallery 1" },
    { src: "https://picsum.photos/seed/pastel2/800/600", alt: "Gallery 2" },
    { src: "https://picsum.photos/seed/pastel3/600/600", alt: "Gallery 3" },
    { src: "https://picsum.photos/seed/pastel4/800/1000", alt: "Gallery 4" },
    { src: "https://picsum.photos/seed/pastel5/600/800", alt: "Gallery 5" },
    { src: "https://picsum.photos/seed/pastel6/800/600", alt: "Gallery 6" }
  ],
  accounts: [
    { bank: 'BCA', number: '1234567890', owner: 'Aris', color: '#FFB6C1', logo: 'B' }
  ],
  qrCodes: [],
  eventLocations: {
    akad: { title: 'Akad Nikah', time: '08:00 - 10:00', location: 'Jakarta', address: 'Jakarta' },
    resepsi: { title: 'Resepsi', time: '10:00 - 14:00', location: 'Jakarta', address: 'Jakarta' }
  }
};

// Dark Romance Template Data
export const darkRomanceData = {
  stories: [
    { year: "2022", title: "First Meeting", desc: "Our story began" },
    { year: "2024", title: "Commitment", desc: "We chose each other" },
    { year: "2026", title: "Forever", desc: "Our beginning" }
  ],
  galleryImages: [
    { src: "https://picsum.photos/seed/dark1/600/800", alt: "Gallery 1" },
    { src: "https://picsum.photos/seed/dark2/800/600", alt: "Gallery 2" },
    { src: "https://picsum.photos/seed/dark3/600/600", alt: "Gallery 3" },
    { src: "https://picsum.photos/seed/dark4/800/1000", alt: "Gallery 4" },
    { src: "https://picsum.photos/seed/dark5/600/800", alt: "Gallery 5" },
    { src: "https://picsum.photos/seed/dark6/800/600", alt: "Gallery 6" }
  ],
  accounts: [
    { bank: 'BCA', number: '1234567890', owner: 'Aris', color: '#DC143C', logo: 'B' }
  ],
  qrCodes: [],
  eventLocations: {
    akad: { title: 'Akad', time: '08:00', location: 'Venue', address: 'Jakarta' },
    resepsi: { title: 'Resepsi', time: '10:00', location: 'Venue', address: 'Jakarta' }
  }
};

// Default contacts
export const contacts = [
  { name: 'Keluarga Mempelai Pria', person: 'Bpk. Heru & Ibu Siti', phone: '6281234567890', type: 'WhatsApp' },
  { name: 'Keluarga Mempelai Wanita', person: 'Bpk. Ahmad & Ibu Aminah', phone: '6289876543210', type: 'WhatsApp' }
];

// Default bank accounts
export const accounts = [
  { bank: 'BCA', number: '1234567890', owner: 'Aris Setiawan', color: '#0288D1', logo: 'B' },
  { bank: 'Mandiri', number: '0987654321', owner: 'Siska Putri', color: '#1565C0', logo: 'M' },
  { bank: 'BNI', number: '1122334455', owner: 'Aris Setiawan', color: '#FF6F00', logo: 'N' },
  { bank: 'BRI', number: '6677889900', owner: 'Siska Putri', color: '#C62828', logo: 'R' }
];

// Default QR codes
export const qrCodes = [
  { bank: 'DANA', number: '081234567890', owner: 'Aris Setiawan', color: '#0072BC', logo: 'D' },
  { bank: 'GoPay', number: '081234567890', owner: 'Siska Putri', color: '#00AA12', logo: 'G' },
  { bank: 'OVO', number: '081234567890', owner: 'Aris Setiawan', color: '#5D3FD3', logo: 'O' }
];

// Wedding couple data
export const COUPLE = {
  groom: "Budi",
  bride: "Ani",
  date: "2026-06-15T08:00:00",
  location: "Grand Ballroom, Jakarta",
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.273891730426!2d106.8245840758682!3d-6.227560460989334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e4a43a6d33%3A0x401577556406630!2sJakarta!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid",
  guestName: "Tamu Undangan"
};

// Website owner contact info
export const WEBSITE_OWNER = {
  whatsapp: "6281234567890",
  website: "https://digitalsolutionsds.vercel.app/",
  email: "hello@digitalsolutions.com",
  instagram: "digitalsolutions",
  name: "Digital Solutions",
  description: "Jasa Pembuatan Website Undangan Pernikahan"
};

// Default event locations
export const eventLocations = {
  akad: { title: 'Akad Nikah', time: '08:00 - 10:00', location: 'Grand Ballroom, Jakarta', address: 'Jl. Sudirman No. 1, Jakarta Pusat', mapUrl: COUPLE.mapUrl },
  resepsi: { title: 'Resepsi', time: '10:00 - 14:00', location: 'Grand Ballroom, Jakarta', address: 'Jl. Sudirman No. 1, Jakarta Pusat', mapUrl: COUPLE.mapUrl }
};

// Attendance options
export const attendanceOptions = [
  { value: 'Hadir', label: 'Ya, Saya Hadir', desc: 'Dengan senang hati saya akan menghadiri', icon: CircleCheck },
  { value: 'Tidak Hadir', label: 'Maaf, Tidak Bisa', desc: 'Mohon maaf saya tidak dapat menghadiri', icon: CircleX },
  { value: 'Ragu-ragu', label: 'Masih Ragu', desc: 'Saya masih belum yakin apakah dapat menghadiri', icon: CircleHelp }
];
