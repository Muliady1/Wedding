export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['@/assets/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image'],
  app: {
      head: {
        link: [
          { rel: 'icon', type: 'image/png', href: '/favicon.ico' }
        ]
      }
    },
  runtimeConfig: {
    public: {
      websiteOwnerWhatsapp: '',
      websiteOwnerEmail: '',
      websiteOwnerWebsite: '',
      websiteOwnerInstagram: '',
    }
  }
})
