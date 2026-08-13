interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
};

const toasts = ref<Toast[]>([]);
let nextId = 0;

export function useToast() {
  function addToast(message: string, type: "success" | "error" = "success") {
    const id = nextId++;
    toasts.value.push({ id, message, type });
    
    setTimeout(() => {
      toasts.value = toasts.value.filter((toast) => toast.id !== id);
    }, 3500);
  }
  
  function success(message: string) {
    addToast(message, "success");
  }
  
  function error(message: string) {
    addToast(message, "error");
  }
  
  return {
    toasts: readonly(toasts),
    success,
    error,
  };
}