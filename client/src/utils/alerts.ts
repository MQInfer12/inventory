import Swal from "sweetalert2";

export const successAlert = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "Éxito",
    text: message,
  });
};

export const errorAlert = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
  });
};

export const confirmAlert = async (
  onConfirm: Function,
  options?: {
    title?: string;
    type?: "warning" | "question";
    text?: string;
  }
) => {
  const result = await Swal.fire({
    title: options?.title || "¿Estás seguro?",
    text: options?.text || "Se eliminará este elemento permanentemente.",
    icon: options?.type || "warning",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Confirmar",
  });
  if (result.isConfirmed) {
    onConfirm();
    return true;
  } else {
    return false;
  }
};
