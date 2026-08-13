<script setup lang="ts">
import { NOTICE_PERIODS } from '../types/application';

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const toast = useToast();

const form = reactive({
  name: "",
  currentWork: "",
  yearsOfExperience: null as number | null,
  noticePeriod: "",
  expectedSalary: null as number | null,
});

const errors = reactive({
  name: "",
  currentWork: "",
  yearsOfExperience: "",
  noticePeriod: "",
  expectedSalary: "",
});

const submitting = ref(false);

function validate(): boolean {
  let valid = true;
  
  errors.name = "";
  errors.currentWork = "";
  errors.yearsOfExperience = "";
  errors.noticePeriod = "";
  errors.expectedSalary = "";
  
  if (!form.name.trim()) {
    errors.name = "Name is required.";
    valid = false;
  }
  
  if (!form.currentWork.trim()) {
    errors.name = "Current work is required.";
    valid = false;
  }
  
  if (
    form.yearsOfExperience === null
    || !Number.isInteger(form.yearsOfExperience)
    || form.yearsOfExperience <= 0
  ) {
    errors.yearsOfExperience = "Must be a positive number.";
    valid = false;
  }
  
  if (!form.noticePeriod) {
    errors.noticePeriod = "Please select a notice period.";
    valid = false;
  }
  
  if (
    form.expectedSalary === null
    || !Number.isInteger(form.expectedSalary)
    || form.expectedSalary <= 0
  ) {
    errors.expectedSalary = "Must be a positive number.";
    valid = false;
  }
  
  return valid;
}

async function handleSubmit() {
  if (!validate()) {
    return;
  }
  
  submitting.value = true;
  
  try {
    await $fetch("/api/applications", {
      method: "POST",
      body: {
        name: form.name.trim(),
        currentWork: form.currentWork.trim(),
        yearsOfExperience: form.yearsOfExperience,
        noticePeriod: form.noticePeriod,
        expectedSalary: form.expectedSalary,
      },
    });
    
    toast.success("Application created successfully.");
    emit("created");
    emit("close");
  } catch (error) {
    toast.error("Failed to create application. Please try again.")
  } finally {
    submitting.value = false;
  }
}

function onBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit("close");
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      @click="onBackdropClick"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">New Application</h2>
          <button
            type="button"
            class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            @click="emit('close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5. 707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="px-6 py-5 space-y-4">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Full name"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              :class="{ 'border-red-400 focus:ring-red-500': errors.name }"
            />
            <p v-if="errors.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
          </div>
          
          <!-- Current Work -->
          <div>
            <label for="currentWork" class="block text-sm font-medium text-gray-700 mb-1">
              Current Work
            </label>
            <input
              id="currentWork"
              v-model="form.currentWork"
              type="text"
              placeholder="e.g. Software Engineer at Acme"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              :class="{ 'border-red-400 focus:ring-red-500': errors.currentWork }"
            />
            <p v-if="errors.currentWork" class="mt-1 text-xs text-red-500">{{ errors.currentWork }}</p>
          </div>
          
          <!-- Years of Experience -->
          <div>
            <label for="yearsOfExperience" class="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <input
              id="yearsOfExperience"
              v-model.number="form.yearsOfExperience"
              type="number"
              min="1"
              placeholder="e.g. 5"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              :class="{ 'border-red-400 focus:ring-red-500': errors.yearsOfExperience }"
            />
            <p v-if="errors.yearsOfExperience" class="mt-1 text-xs text-red-500">{{ errors.yearsOfExperience }}</p>
          </div>
          
          <!-- Notice Period -->
          <div>
            <label for="noticePeriod" class="block text-sm font-medium text-gray-700 mb-1">
              Notice Period
            </label>
            <select
              id="noticePeriod"
              v-model="form.noticePeriod"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white"
              :class="{ 'border-red-400 focus:ring-red-500': errors.noticePeriod }"
            >
              <option value="" disabled>Select notice period</option>
              <option
                v-for="period in NOTICE_PERIODS"
                :key="period.value"
                :value="period.value"
              >
                {{ period.label }}
              </option>            
            </select>
            <p v-if="errors.noticePeriod" class="mt-1 text-xs text-red-500">{{ errors.noticePeriod }}</p>
          </div>
          
          <!-- Expected Salary -->
          <div>
            <label for="expectedSalary" class="block text-sm font-medium text-gray-700 mb-1">
              Expected Salary
            </label>
            <input
              id="expectedSalary"
              v-model.number="form.expectedSalary"
              type="number"
              min="1"
              placeholder="e.g. 80000"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              :class="{ 'border-red-400 focus:ring-red-500': errors.expectedSalary }"
            />
            <p v-if="errors.expectedSalary" class="mt-1 text-xs text-red-500">{{ errors.expectedSalary }}</p>
          </div>
          
          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition cursor-pointer"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition cursor-pointer"
            >
              {{ submitting ? "Creating..." : "Create Application" }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
  </Teleport>
</template>