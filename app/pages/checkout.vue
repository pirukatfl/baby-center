<template>
  <div class="checkout-page">
    <div class="checkout-container">
      <div class="header">
        <IconSvg class="lock-icon" icon="lock" /> <!-- Or any lock icon -->
        <h1>Finalizar Assinatura</h1>
        <p>Você está a um passo de desbloquear o Premium para sempre.</p>
      </div>

      <div class="summary-card">
        <div class="summary-item">
          <span>Plano:</span>
          <strong>Baby Center Premium (Vitalício)</strong>
        </div>
        <div class="summary-item">
          <span>Acesso:</span>
          <strong>Eventos & Fotos ilimitados</strong>
        </div>
        <div class="divider"></div>
        <div class="summary-item total">
          <span>Total:</span>
          <strong>R$ 19,90</strong>
        </div>
      </div>

      <div class="actions">
        <!-- Assuming we redirect to a Stripe Payment Link for now -->
        <a href="https://buy.stripe.com/test_placeholder" class="stripe-button" target="_blank">
          Pagar com Stripe
        </a>
        <button class="cancel-button" @click="goBack">
          Cancelar
        </button>
      </div>

      <div class="footer">
        <p>🔒 Ambiente de pagamento seguro. Seus dados são processados diretamente pelo Stripe.</p>
        <p>Em caso de dúvidas, entre em contato com o suporte.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.checkout-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7f9fc;
  padding: 20px;
}

.checkout-container {
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  text-align: center;
  margin-bottom: 30px;

  h1 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 8px;
    margin-top: 15px;
  }

  p {
    color: #666;
    font-size: 0.95rem;
  }
}

.summary-card {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #4a5568;

  strong {
    color: #2d3748;
  }

  &.total {
    margin-bottom: 0;
    font-size: 1.2rem;
    font-weight: bold;
    color: #1a202c;

    strong {
      color: #667EEA;
      font-size: 1.4rem;
    }
  }
}

.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 15px 0;
}

.actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 25px;
}

.stripe-button {
  background: #635bff;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 16px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  text-align: center;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
  
  &:hover {
    background: #544be6;
    transform: translateY(-2px);
  }
}

.cancel-button {
  background: transparent;
  color: #666;
  border: 1px solid #ccc;
  border-radius: 30px;
  padding: 14px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;

  &:hover {
    background: #f1f1f1;
  }
}

.footer {
  text-align: center;
  font-size: 0.8rem;
  color: #a0aec0;

  p {
    margin-bottom: 5px;
  }
}
</style>
