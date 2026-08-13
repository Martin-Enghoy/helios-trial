<script setup lang="ts">
import { NOTICE_PERIOD_LABELS, STATUS_LABELS } from '~~/server/database/schema';
import type { ApplicationStatus } from '~~/server/database/schema';

const page = ref(1);
const sortBy = ref<'name' | 'createdAt' | 'status' | 'yearsOfExperience' | 'expectedSalary'>('createdAt');
const sortOrder = ref<'asc' | 'desc'>('desc');

const { data, pending, error, refresh } = await useFetch('/api/applications', {
  query: {
    page,
    sortBy,
    sortOrder,
  },
  watch: [page, sortBy, sortOrder],
});

defineExpose({ refresh });

function toggleSort(column: typeof sortBy.value) {
  if (sortBy.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortOrder.value = column === 'createdAt' || column === 'status' ? 'desc' : 'asc';
  }
  
  page.value = 1;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);  
}

function formatSalary(salary: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(salary);
}

/**
 * Pagination
 */
const totalPages = computed(() => data.value?.pagination?.totalPages || 1);
const currentPage = computed(() => data.value?.pagination?.page || 1);
const totalItems = computed(() => data.value?.pagination?.total || 0);

const pageNumbers = computed(() => {
  const maxPagesToShow = 5;
  const current = currentPage.value;
  const total = totalPages.value;
  
  if (total < maxPagesToShow) {
    return Array.from({ length: total }, (_, idx) => idx + 1);
  }
  
  let start = Math.max(1, current - Math.floor(maxPagesToShow / 2));
  let end = start + maxPagesToShow - 1;
  
  if (end > total) {
    end = total;
    start = Math.max(1, end - maxPagesToShow + 1);
  }
  
  return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
});
</script>

<template>
  <div class="bg-white shadow-sm ring-1 ring-gray-200 rounded-xl overflow-hidden">
    <!-- Error State -->
    <div v-if="error" class="p-8 text-center text-red-600">
      Failed to load applications. Please try refreshing the page.
    </div>
    
    <!--  Table Container -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <!-- Sortable Column Helper -->
            <th
              v-for="(col, key) in {
                name: 'Name',
                currentWork: 'Current Work',
                yearsOfExperience: 'Experience',
                noticePeriod: 'Notice',
                expectedSalary: 'Salary',
                status: 'Status',
                createdAt: 'Applied'
              }"
              :key="key"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
              :class="{ 'cursor-pointer hover:bg-gray-100 transition-colors select-none': ['name', 'createdAt', 'status', 'yearsOfExperience', 'expectedSalary'].includes(key) }"              
              @click="['name', 'createdAt', 'status', 'yearsOfExperience', 'expectedSalary'].includes(key) && toggleSort(key as any)"
            >
              <div class="flex items-center gap-1">
                {{ col }}
                <span v-if="sortBy === key" class="text-blue-500">
                  <svg v-if="sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </span>
                <span v-else-if="['name', 'createdAt', 'status', 'yearsOfExperience', 'expectedSalary'].includes(key)" class="text-gray-300 opacity-0 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        
        <tbody class="bg-white divide-y divide-gray-200 relative">
          <!-- Loading Overlay -->
          <div v-if="pending" class="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"/>
          </div>
          
          <!-- Empty State -->
          <tr v-if="!pending && (!data?.data || data.data.length === 0)">
            <td colspan="7" class="px-6 py-12 text-center text-gray-500">
              No applications found.
            </td>
          </tr>
          
          <!-- Data Rows -->
          <tr v-for="app in data?.data" :key="app.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ app.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ app.currentWork }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ app.yearsOfExperience }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ NOTICE_PERIOD_LABELS[app.noticePeriod as keyof typeof NOTICE_PERIOD_LABELS] }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatSalary(app.expectedSalary) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <!-- Placeholder for #8 -->
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                {{ STATUS_LABELS[app.status as keyof typeof STATUS_LABELS] }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(app.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Pagination Footer -->
    <div class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ totalItems === 0 ? 0 : ((currentPage - 1) * 20) + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(currentPage * 20, totalItems) }}</span>
            of
            <span class="font-medium">{{ totalItems }}</span>
            results
          </p>
        </div>
        
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <!-- Previous Button -->
            <button
              @click="page > 1 && page--"
              :disabled="page === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <!-- Page Numbers -->
            <button
              v-for="p in pageNumbers"
              :key="p"
              @click="page = p"
              class="relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors"
              :class="p === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
            >
              {{ p }}
            </button>
            
            <!-- Next Button -->
            <button
              @click="page < totalPages && page++"
              :disabled="page === totalPages || totalPages === 0"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>