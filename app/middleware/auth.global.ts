
export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return
  const familyId = localStorage.getItem('family_id')
  if (!familyId && to.path === '/confirm') return
  if (!familyId && to.path !== '/login') {
    return navigateTo('/login')
  }
})