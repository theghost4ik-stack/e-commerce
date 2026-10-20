<template>
  <label class="custom-checkbox" :class="{ 'custom-checkbox--disabled': disabled }">
    <input
      class="custom-checkbox__input"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', $event.target.checked)"
    />
    <span class="custom-checkbox__box">
      <i class="mdi mdi-check"></i>
    </span>
    <span class="custom-checkbox__label">
      <slot />
    </span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.custom-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  user-select: none;

  &__input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &__box {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    border: 1px solid $color-border;
    border-radius: 5px;
    background-color: $color-surface;
    color: $color-surface;
    font-size: 0.95rem;
    transition: background-color 0.15s, border-color 0.15s;
  }

  &__input:checked + &__box {
    background-color: $color-primary;
    border-color: $color-primary;
  }

  &__input:focus-visible + &__box {
    box-shadow: 0 0 0 3px $color-primary-soft;
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
