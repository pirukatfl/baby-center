<template>
    <button v-if="showButton" class="install-app" @click="installApp">
      Instalar Central do Bebê
    </button>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
</template>
<script setup lang="ts">
const { $pwa } = useNuxtApp()
const deferredPrompt = ref<any>(null)
const showButton = ref(false)

onMounted(() => {
    // Escuta o evento que o navegador dispara quando o PWA é instalável
    window.addEventListener('beforeinstallprompt', (e) => {
        // Impede o banner automático (nós vamos mostrar o nosso botão)
        e.preventDefault()
        // Guarda o evento para usar depois
        deferredPrompt.value = e
        showButton.value = true
        console.log('✅ Evento beforeinstallprompt capturado!')
    })

    window.addEventListener('appinstalled', () => {
        // Esconde o botão se o usuário já instalou
        showButton.value = false
        deferredPrompt.value = null
        console.log('🎉 PWA instalado com sucesso!')
    })
})

async function installApp() {
    if (!deferredPrompt.value) {
        // Se o evento manual não pegou, tentamos o do plugin como fallback
        if ($pwa?.install) await $pwa.install()
        return
    }
    
    // Mostra o prompt nativo do navegador
    deferredPrompt.value.prompt()
    
    // Espera a resposta do usuário
    const { outcome } = await deferredPrompt.value.userChoice
    console.log(`Usuário escolheu: ${outcome}`)
    
    // Limpa o evento, pois ele só pode ser usado uma vez
    deferredPrompt.value = null
    showButton.value = false
}
</script>
<style lang="scss">
.install-app {
  position: fixed;
  right: 0;
  top: 0;
  margin: 15px 15px 0 0;
}
button {
    padding: 3px 5px;
    outline: none;
    border: none;
    font-size: 1.2rem;
    display: flex;
    background: rgba(#a0d7ee, .8);
    transition: .2s ease-in-out;
    color: #fff;
    cursor: pointer;
    border: 1px solid rgba(#000, .5);

    @media (max-width: 769px) {
        background: rgba(#a0d7ee, 1);
    }

    &:hover {
        background: rgba(#a0d7ee, 1);
    }
}
//verde menta claro
// Cor Primária (Ação e Marca)
// Usada para botões principais (CTAs), barras de progresso ativas e ícones importantes.
$primary: #A8D0B3;

//azul bebê para fundo e estruturas
// Cor Secundária (Fundo e Estrutura)
// Usada para fundos de cabeçalhos, cartões de agrupamento de informações e como cor alternativa suave.
$secondary: #c5e5f3;

//amarelo ouro suave
// Cor de Ênfase e Alerta (Destaque e Sucesso)
// Usada para celebrar marcos atingidos, alertas de sucesso, ou para dar um toque de alegria.
$tertiary: #F9C74F;

$bg: #FEFFFF;
$text: #4A4A4A;
$border: #E5E5E5;

// Cores para Gráficos e Dados (Opcional)Se o seu app tiver gráficos de peso,
// altura ou outros dados de crescimento, você pode usar estas cores para
// diferenciar as curvas:
// Roxo Suave#B19CD9 Curva de Peso (Ex: WHO Percentile)
// Verde Água#84C7B4 Curva de Altura
// Vermelho Suave #F08080 Alerta Suave (Ex: Feito há muito tempo)


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-size: 62,5%;
  font-family: sans-serif;
}

body {
  background-color: $secondary;
  color: $text;
}

.bold {
  font-weight: bold;
}

/* 1. Tamanho da barra (largura para vertical, altura para horizontal) */
::-webkit-scrollbar {
  width: 10px;
}

/* 2. O fundo da barra (track) */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
  border-radius: 10px;
}
 
/* 3. O "botão" que desliza (thumb) */
::-webkit-scrollbar-thumb {
  background: #888888; 
  border-radius: 10px;
}

/* 4. O botão quando o usuário passa o mouse */
::-webkit-scrollbar-thumb:hover {
  background: #777777;
}
</style>
