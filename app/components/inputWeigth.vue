<template>
    <input 
        type="text" 
        :value="model" 
        @input="handleInput"
        placeholder="0,00 kg"
    >
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';

const model = defineModel<string | number>();

// Formatador configurado para peso (2 casas decimais)
const weightFormatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const formatWeight = (val: any) => {
    if (!val && val !== 0) return '';
    
    // Remove tudo que não é dígito
    const cleanValue = String(val).replace(/\D/g, '');
    
    if (cleanValue === '') return '';

    // Transforma em decimal (ex: 8550 vira 85.50) e formata
    const formatted = weightFormatter.format(Number(cleanValue) / 100);
    return `${formatted} kg`;
}

const handleInput = (e: Event) => {
    const input = e.target as HTMLInputElement;
    model.value = formatWeight(input.value);
};

// Formata o valor inicial caso venha do banco de dados/pai
onMounted(() => {
    if (model.value) {
        model.value = formatWeight(model.value);
    }
});

// Watch opcional caso o valor mude externamente (via código)
watch(() => model.value, (newVal, oldVal) => {
    const cleanNew = String(newVal).replace(/[^\d]/g, '');
    const cleanOld = String(oldVal).replace(/[^\d]/g, '');
    
    if (cleanNew !== cleanOld) {
        model.value = formatWeight(newVal);
    }
}, { immediate: false });
</script>