<template>
  <div ref="root" class="custom-select" :class="{ 'custom-select--open': open }">
    <span v-if="label" class="custom-select__label">{{ label }}</span>
    <button
      class="custom-select__trigger"
      type="button"
      :disabled="disabled"
      @click="open = !open"
    >
      <span class="custom-select__value">{{ selectedLabel }}</span>
      <i class="mdi mdi-chevron-down custom-select__arrow"></i>
    </button>
    <ul v-if="open" class="custom-select__list">
      <li
        v-for="option in options"
        :key="option.value"
        class="custom-select__option"
        :class="{ 'custom-select__option--active': option.value === modelValue }"
        @click="choose(option)"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Select' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const root = ref(null)
const open = ref(false)

const selectedLabel = computed(() => {
  const option = props.options.find(item => item.value === props.modelValue)
  return option ? option.label : props.placeholder
})

function choose(option) {
  emit('update:modelValue', option.value)
  open.value = false
}

function onDocumentClick(event) {
  if (root.value && !root.value.contains(event.target)) {
    open.value = false
  }
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.custom-select {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 160px;

  &__label {
    font-size: 0.85rem;
    font-weight: 600;
    color: $color-muted;
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    height: 40px;
    padding: 0 12px;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    font-size: 0.95rem;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:hover:not(:disabled) {
      border-color: $color-primary;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &--open &__trigger {
    border-color: $color-primary;
    box-shadow: 0 0 0 3px $color-primary-soft;
  }

  &__value {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    color: $color-muted;
    transition: transform 0.15s;
  }

  &--open &__arrow {
    transform: rotate(180deg);
  }

  &__list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 40;
    max-height: 320px;
    margin-top: 4px;
    padding: 4px;
    overflow-y: auto;
    list-style: none;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
    box-shadow: 0 10px 24px $color-shadow-strong;
  }

  &__option {
    padding: 8px 10px;
    border-radius: $radius-sm;
    font-size: 0.92rem;
    cursor: pointer;

    &:hover {
      background-color: $color-primary-soft;
    }

    &--active {
      color: $color-primary;
      font-weight: 700;
    }
  }
}
</style>
