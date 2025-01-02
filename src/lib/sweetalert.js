import Swal from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});


export const Success = (title) => {
  Toast.fire({
    icon: "success",
    title: title,
  });
};

export const ErrorMessage = (title) => {
  Toast.fire({
    icon: "error",
    title: title,
  });
};