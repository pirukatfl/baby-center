<template>
    <div class="modal">
        <div class="box">
            <div class="header">
                <div class="title">ATENÇÃO</div>
                <div class="close">
                    <IconSvg icon="close" />
                </div>
            </div>
            <div class="body">
                <div class="text"><slot></slot></div>
            </div>
            <div class="actions">
                <BaseButton class="cancel" @click="emits('close')">Cancelar</BaseButton>
                <BaseButton :action="action">ok</BaseButton>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    interface Props {
        action?: (payload: PointerEvent) => void
    }
    const { 
        action = () => {}, 
    } = defineProps<Props>()

    const emits = defineEmits(['close'])
</script>
<style lang="scss" scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #000000, $alpha: .2);
    justify-content: center;
    z-index: 998;
    display: flex;
    align-items: flex-start;

    .box {
        width: 380px;
        margin-top: 100px;
        background-color: #f4f4f4;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #c5e5f3;
            padding: 5px 15px;
            border-radius: 15px 15px 0 0;
        }

        .body {
            display: flex;
            padding: 15px;
        }

        .actions {
            display: flex;
            justify-content: flex-end;
            background-color: #c5e5f3;
            padding: 5px 15px;
            border-radius: 0 0 15px 15px;

            button {
                margin-left: 5px;
            }
        }
    }
}
.cancel {
    background-color: transparent;
    border: 1px solid rgba($color: #ff0000, $alpha: .7);
    color: rgba($color: #ff0000, $alpha: .7);
    transition: .2s ease-in-out;
    opacity: .7;

    &:hover {
        color: white;
        background-color: rgba($color: #ff0000, $alpha: .7);
        opacity: 1;
    }
}
</style>