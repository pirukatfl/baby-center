// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxt/image', '@vite-pwa/nuxt'],
  
  // 1. DESATIVAR PRERENDER TOTALMENTE
  // Isso impede que a Vercel tente "rodar" o app durante o build
  nitro: {
    prerender: {
      crawlLinks: false, // Mude para false
      routes: []
    }
  },

  // 2. FORÇAR CLIENT-SIDE NA RAIZ
  routeRules: {
    '/': { ssr: false }
  },

  supabase: {
    redirect: false,
    // Remova ou comente a linha abaixo se o arquivo não existir para sumir o aviso de "file not found"
    // types: '~/types/database.types.ts', 
  },

  // 3. CORREÇÃO RUNTIME CONFIG
  // O módulo @nuxtjs/supabase já lê SUPABASE_URL e SUPABASE_KEY automaticamente.
  // Declarar manualmente aqui as vezes causa conflito se os nomes forem iguais.
  runtimeConfig: {
    public: {
      // Deixe vazio se não for usar em outros lugares, 
      // o módulo já injeta o $supabase automaticamente.
    }
  },

  image: {
    inject: true,
    quality: 100,
    format: ['webp', 'jpeg', 'jpg', 'png', 'gif', 'svg'],
    screens: {
      'sm': 640, 'md': 768, 'lg': 1024, 'xl': 1280, '2xl': 1536,
    },
    ipx: {
      baseURL: '/images',
    }
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true, 

  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      meta: [{ name: 'theme-color', content: '#10b981' }],
      link: [{ rel: 'manifest', href: '/manifest.webmanifest' }]
    },
  },

  pwa: {
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Baby Center',
      short_name: 'Timeline',
      theme_color: '#10b981',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/login',
      icons: [
        { src: '/images/logo-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/images/logo-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: { installPrompt: true },
    devOptions: {
      enabled: true,
      type: 'classic',
    },
  },
})