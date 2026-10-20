<template>
  <label
    class="custom-input"
    :class="[attrs.class, { 'custom-input--error': error, 'custom-input--disabled': disabled }]"
    :style="attrs.style"
  >
    <span v-if="label" class="custom-input__label">{{ label }}</span>
    <span class="custom-input__field">
      <i v-if="icon" class="mdi custom-input__icon" :class="icon"></i>
      <input
        ref="control"
        class="custom-input__control"
        v-bind="getInputAttrs()"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onInput"
      />
    </span>
    <span v-if="error" class="custom-input__error">{{ error }}</span>
  </label>
</template>

<script setup>
import { nextTick, ref, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  icon: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()
const control = ref(null)

function getInputAttrs() {
  const result = {}
  for (const key of Object.keys(attrs)) {
    if (key !== 'class' && key !== 'style') {
      result[key] = attrs[key]
    }
  }
  return result
}

function syncControl() {
  if (control.value && control.value.value !== props.modelValue) {
    control.value.value = props.modelValue
  }
}

function onInput(event) {
  emit('update:modelValue', event.target.value)
  nextTick(syncControl)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.custom-input {
  display: flex;
  flex-direction: column;
  gap: 6px;

  &__label {
    font-size: 0.85rem;
    font-weight: 600;
    color: $color-muted;
  }

  &__field {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 12px;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:focus-within {
      border-color: $color-primary;
      box-shadow: 0 0 0 3px $color-primary-soft;
    }
  }

  &__icon {
    color: $color-muted;
    font-size: 1.1rem;
  }

  &__control {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    outline: none;
    background-color: $color-transparent;
    font-size: 0.95rem;
  }

  &__error {
    font-size: 0.8rem;
    color: $color-danger;
  }

  &--error &__field {
    border-color: $color-danger;
  }

  &--disabled {
    opacity: 0.6;
  }
}
</style>
