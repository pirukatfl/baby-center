<template>
  <Teleport to="body">
    <div v-if="isOpen" class="premium-modal-overlay">
      <div class="premium-modal">
        <div class="close-btn" @click="$emit('close')">
          <IconSvg icon="cancel" />
        </div>
        
        <div class="modal-content">
          <div class="badge">Premium</div>
          <h2>Desbloqueie o Baby Center Premium</h2>
          <p class="subtitle">Guarde os melhores momentos do seu bebê sem limites.</p>
          
          <div class="features">
            <div class="feature-item">
              <IconSvg icon="check" /> <!-- Assuming there is a check icon, or can just use text -->
              <span>Eventos ilimitados (fim do limite de 30 eventos)</span>
            </div>
            <div class="feature-item">
              <IconSvg icon="check" />
              <span>Upload de múltiplas fotos por evento</span>
            </div>
            <div class="feature-item">
              <IconSvg icon="check" />
              <span>Acesso vitalício</span>
            </div>
          </div>
          
          <div class="price-container">
            <span class="currency">R$</span>
            <span class="price">19,90</span>
            <span class="period">/ único</span>
          </div>
          
          <button class="subscribe-btn" @click="goToCheckout">
            Assinar Agora
          </button>
          <p class="secure-text">Pagamento 100% seguro via Stripe</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const router = useRouter()

function goToCheckout() {
  emit('close')
  router.push('/checkout')
}
</script>

<style lang="scss" scoped>
.premium-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.premium-modal {
  background: white;
  width: 90%;
  max-width: 450px;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transform: scale(1);
  animation: modal-enter 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modal-enter {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  background: rgba(0,0,0,0.05);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(0,0,0,0.1);
  }
}

.modal-content {
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.badge {
  background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%);
  color: #D81B60;
  font-weight: bold;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 6px 12px;
  border-radius: 20px;
  margin-bottom: 20px;
  display: inline-block;
}

h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.2;
}

.subtitle {
  color: #666;
  font-size: 1rem;
  margin-bottom: 30px;
}

.features {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: #444;
  
  // A simple fallback dot if IconSvg isn't present
  &::before {
    content: '✓';
    color: #4CAF50;
    font-weight: bold;
  }
  
  span {
    flex: 1;
  }
  
  // Hide external IconSvg if we fall back, since we assume check mark is needed
  ::v-deep(svg) {
    display: none; 
  }
}

.price-container {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 30px;
  color: #333;
  
  .currency {
    font-size: 1.2rem;
    font-weight: bold;
    margin-right: 4px;
  }
  
  .price {
    font-size: 3rem;
    font-weight: 800;
  }
  
  .period {
    font-size: 1rem;
    color: #888;
    margin-left: 4px;
  }
}

.subscribe-btn {
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: white;
  border: none;
  border-radius: 30px;
  padding: 16px 40px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(118, 75, 162, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(118, 75, 162, 0.6);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.secure-text {
  font-size: 0.75rem;
  color: #999;
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &::before {
    content: '🔒';
  }
}
</style>
