<script setup lang="ts">
const showModal = ref(false);


// TODO: replace any type with appropriate type
const listRef = ref<any>(null);

function onApplicationCreated() {
  if (listRef.value) {
    listRef.value.refresh();
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NuxtRouteAnnouncer />
    
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 class="text-xl font-semibold text-gray-900">Applications Tracker</h1>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition cursor-pointer"
          @click="showModal = true"
        >
          + New Application
        </button>
      </div>
    </header>
    
    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ApplicationList ref="listRef" />
    </main>
    
    <!-- Modal -->
    <ApplicationModal
      v-if="showModal"
      @close="showModal = false"
      @created="onApplicationCreated"
    />
    
    <!-- Toasts -->
    <ToastContainer />
  </div>
</template>
