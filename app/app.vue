<template>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
</template>
<style lang="scss">
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
