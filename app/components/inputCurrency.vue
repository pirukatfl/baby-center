<template>
    <input type="text" v-model="model">
</template>
<script setup lang="ts">
    const model = defineModel<Number | String>();

    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    const formatValue = (val: any) => {
        if (!val) return '';
        // Remove tudo que não é dígito e formata como centavos
        const cleanValue = String(val).replace(/\D/g, '');
        return formatter.format(Number(cleanValue) / 100 / 100);
    }

    watch(model, (val) => {
        model.value = String(formatter.format(Number(String(val).replace(/\D/g, '')) / 100))
    })

    onMounted(() => {
        if (model.value) {
            model.value = formatValue(model.value);
        }
    })
</script>