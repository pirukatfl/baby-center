// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxt/image'],
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
  // Desativa o SSR para que o app se comporte como um SPA/Static dentro do celular
  ssr: false, 
  
  // Garante que o comando 'generate' funcione corretamente
  nitro: {
    prerender: {
      crawlLinks: true
    }
  },

  // Ajuste para evitar problemas de caminhos no Android/iOS
  app: {
    baseURL: './',
    head: {
      htmlAttrs: {
        lang: 'pt-BR',
      },
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
  }
})