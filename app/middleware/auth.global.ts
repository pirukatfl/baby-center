export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  // 1. Aguarda a sessão ser recuperada/renovada antes de decidir a rota
  // Isso evita o erro de JWT expirado no primeiro carregamento
  const { data: { session } } = await client.auth.getSession()

  // 2. Se não houver usuário logado e não estiver na página de login, manda para o login
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // 3. Verificação do family_id (Lógica do seu projeto)
  // No SSR, o localStorage não existe, então usamos apenas no cliente
  if (process.client) {
    const familyId = localStorage.getItem('family_id')

    // Se estiver logado mas sem familyId (exceto na página de confirmação/seleção)
    if (user.value && !familyId && to.path !== '/confirm' && to.path !== '/login') {
      return navigateTo('/confirm')
    }
  }
})