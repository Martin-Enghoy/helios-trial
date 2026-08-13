<script setup lang="ts">
import { APPLICATION_STATUSES, STATUS_LABELS } from '~~/server/database/schema';
import type { ApplicationStatus } from '~~/server/database/schema';

const props = defineProps<{
  applicationId: number;
  initialStatus: ApplicationStatus;
}>();

const toast = useToast();

const currentStatus = ref<ApplicationStatus>(props.initialStatus);
const isUpdating = ref(false);

const colorClasses: Record<ApplicationStatus, string> = {
  new: 'bg-emerald-100 text-emerald-800 border-emerald-200 focus:ring-emerald-500',
  contacted: 'bg-blue-100 text-blue-800 border-blue-200 focus:ring-blue-500',
  qualified: 'bg-orange-100 text-orange-800 border-orange-200 focus:ring-orange-500',
  approved: 'bg-purple-100 text-purple-800 border-purple-200 focus:ring-purple-500',
  cancelled: 'bg-red-100 text-red-800 border-red-200 focus:ring-red-500',
};

async function updateStatus(event: Event) {
  const select = event.target as HTMLSelectElement;
  const newStatus = select.value as ApplicationStatus;
  const previousStatus = currentStatus.value;
  
  if (newStatus === previousStatus) {
    return;
  }
  
  currentStatus.value = newStatus;
  isUpdating.value = true;
  
  try {
    await $fetch(`/api/applications/${props.applicationId}`, {
      method: 'PATCH',
      body: { status: newStatus },
    });
    
    toast.success(`Status updated to ${STATUS_LABELS[newStatus]}`);
  } catch (error) {
    // Revert on failure
    currentStatus.value = previousStatus;
    toast.error('Failed to update status. Please try again.');
  } finally {
    isUpdating.value = false;
  }
}
</script>

<template>
  <div class="relative inline-block w-32">
    <select
      :value="currentStatus"
      :disabled="isUpdating"
      @change="updateStatus"
      class="block w-full pl-3 pr-8 py-1 text-xs font-semibold rounded-full border appearance-none transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait"
      :class="colorClasses[currentStatus]"
    >
      <option
        v-for="status in APPLICATION_STATUSES"
        :key="status"
        :value="status"
        class="bg-white text-gray-900 font-normal text-center"
      >
        {{ STATUS_LABELS[status] }}
      </option>
    </select>
    
    <!-- Custom Dropdown Arrow -->
    <div
      class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2"
      :class="colorClasses[currentStatus].split(' ')[1]"
    >
      <svg class="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
</template>