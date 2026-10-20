<template>
  <div class="login">
    <form class="login__card" @submit.prevent="onSubmit">
      <h1 class="login__title">{{ isRegister ? 'Create account' : 'Welcome back' }}</h1>

      <CustomInput v-if="isRegister" v-model="form.name" label="Name" icon="mdi-account-outline" placeholder="John Smith" />
      <CustomInput v-model="form.login" label="Login" icon="mdi-at" placeholder="Your login" />
      <CustomInput v-model="form.password" label="Password" type="password" icon="mdi-lock-outline" placeholder="Your password" />

      <p v-if="errorMessage" class="login__error">{{ errorMessage }}</p>

      <CustomButton type="submit" size="lg" block>
        {{ isRegister ? 'Register' : 'Login' }}
      </CustomButton>

      <p class="login__switch">
        {{ isRegister ? 'Already have an account?' : 'No account yet?' }}
        <button type="button" class="login__switch-button" @click="toggleMode">
          {{ isRegister ? 'Login' : 'Register' }}
        </button>
      </p>

      <p v-if="!isRegister" class="login__hint">
        Demo account: {{ $store.getters['auth/defaultLogin'] }} / {{ $store.getters['auth/defaultPassword'] }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CustomButton from '@/components/custom-kit/CustomButton.vue'
import CustomInput from '@/components/custom-kit/CustomInput.vue'

const router = useRouter()
const store = useStore()

const isRegister = ref(false)
const errorMessage = ref('')
const form = reactive({
  name: '',
  login: '',
  password: ''
})

function toggleMode() {
  isRegister.value = !isRegister.value
  errorMessage.value = ''
}

async function onSubmit() {
  const action = isRegister.value ? 'auth/register' : 'auth/login'
  const result = await store.dispatch(action, form)

  if (!result.ok) {
    errorMessage.value = result.message
    return
  }
  router.push({ name: 'catalog' })
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.login {
  display: flex;
  justify-content: center;
  padding-top: 32px;

  &__card {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    max-width: 400px;
    padding: 28px;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    box-shadow: 0 10px 30px $color-shadow;
  }

  &__title {
    font-size: 1.4rem;
  }

  &__error {
    padding: 10px 12px;
    border-radius: $radius-sm;
    background-color: $color-danger-soft;
    color: $color-danger;
    font-size: 0.88rem;
  }

  &__switch {
    text-align: center;
    font-size: 0.9rem;
    color: $color-muted;
  }

  &__switch-button {
    border: none;
    background-color: $color-transparent;
    color: $color-primary;
    font-weight: 700;
    cursor: pointer;
  }

  &__hint {
    text-align: center;
    font-size: 0.8rem;
    color: $color-muted;
  }
}
</style>
