<script setup lang="ts">
const { toasts } = useToast()
</script>

<template>
  <div
    class="fixed bottom-4 right-4 z-100 flex flex-col gap-2 pointer-events-none"
    aria-live="polite"
    aria-atomic="true"
  >
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-full opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :role="toast.type === 'error' ? 'alert' : 'status'"
        class="pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white min-w-70 max-w-95"
        :class="{
          'bg-emerald-600': toast.type === 'success',
          'bg-red-600': toast.type === 'error',
        }"
      >
        {{ toast.message }}
      </div>    
    </TransitionGroup>
  </div>
</template>