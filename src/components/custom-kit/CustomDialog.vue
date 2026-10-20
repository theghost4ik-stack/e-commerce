<template>
  <Teleport to="body">
    <div v-if="modelValue" class="custom-dialog" @click.self="close">
      <div class="custom-dialog__panel" role="dialog" aria-modal="true">
        <div class="custom-dialog__header">
          <h3 class="custom-dialog__title">{{ title }}</h3>
          <button
            v-if="closable"
            class="custom-dialog__close"
            type="button"
            @click="close"
          >
            <i class="mdi mdi-close"></i>
          </button>
        </div>
        <div class="custom-dialog__body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="custom-dialog__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  closable: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue'])

function close() {
  if (props.closable) {
    emit('update:modelValue', false)
  }
}

function onKeydown(event) {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.custom-dialog {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: $color-overlay;

  &__panel {
    width: 100%;
    max-width: 440px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    background-color: $color-surface;
    border-radius: $radius-lg;
    box-shadow: 0 20px 50px $color-shadow-strong;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 20px 0;
  }

  &__title {
    font-size: 1.15rem;
    font-weight: 700;
  }

  &__close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: $radius-sm;
    background-color: $color-transparent;
    color: $color-muted;
    font-size: 1.2rem;
    cursor: pointer;

    &:hover {
      background-color: $color-primary-soft;
      color: $color-primary;
    }
  }

  &__body {
    padding: 14px 20px;
    overflow-y: auto;
    color: $color-muted;
    line-height: 1.5;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 0 20px 18px;
  }
}
</style>
