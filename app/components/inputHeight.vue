<template>
    <input 
        type="text" 
        :value="model" 
        @input="handleInput"
        placeholder="0,00 m"
    >
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';

const model = defineModel<string | number>();

// Formatador numérico para o padrão brasileiro (1,75)
const heightFormatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const formatHeight = (val: any) => {
    if (!val && val !== 0) return '';
    
    // Remove qualquer caractere que não seja número
    const cleanValue = String(val).replace(/\D/g, '');
    
    if (cleanValue === '') return '';

    // Transforma em decimal (ex: 180 vira 1.80) e formata com vírgula
    const formatted = heightFormatter.format(Number(cleanValue) / 100);
    return `${formatted} m`;
}

const handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    // Atualiza o model com o valor formatado em tempo real
    model.value = formatHeight(input.value);
};

onMounted(() => {
    if (model.value) {
        model.value = formatHeight(model.value);
    }
});

// Garante que mudanças externas no model também sejam formatadas
watch(() => model.value, (newVal) => {
    const formatted = formatHeight(newVal);
    if (newVal !== formatted) {
        model.value = formatted;
    }
});
</script>