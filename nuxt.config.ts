// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxt/image', '@vite-pwa/nuxt'],
  image: {
    inject: true,
    quality: 100,
    format: ['webp', 'jpeg', 'jpg', 'png', 'gif', 'svg'],
    screens: {
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536,
    },
    presets: {
      avatar: {
        modifiers: {
          format: 'jpg',
          width: 50,
          height: 50
        }
      }
    },
    ipx: {
    baseURL: '/images',
  }
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true, 
  
  // Garante que o comando 'generate' funcione corretamente
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: []
    }
  },

  // Ajuste para evitar problemas de caminhos no Android/iOS
  app: {
    baseURL: '/',
    head: {
      htmlAttrs: {
        lang: 'pt-BR',
      },
      meta: [{ name: 'theme-color', content: '#10b981' }],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' }
      ]
    },
  },
  supabase: {
    // Opções de redirecionamento (true por padrão)
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/login'], // rotas públicas
    },
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    }
  },
  pwa: {
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Baby Center',
      short_name: 'Timeline',
      theme_color: '#10b981',
      background_color: '#ffffff',
      display: 'standalone', // FORÇA o modo de aplicativo
      orientation: 'portrait',
      start_url: '/login', // Importante para o navegador saber onde o app começa
      icons: [
        {
          src: '/images/logo-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/images/logo-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'], // Cache de arquivos estáticos
    },
    client: {
      installPrompt: true, // Facilita o aviso de instalação
    },
    devOptions: {
      enabled: true, // Permite testar o PWA durante o desenvolvimento
      type: 'classic',
    },
  },
})