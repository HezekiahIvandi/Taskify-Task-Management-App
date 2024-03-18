document.addEventListener("DOMContentLoaded", () => {
  // Pilih semua task yang dapat di drag
  const draggableTasks = document.querySelectorAll(".task");
  // Pilih semua area yang dapat di drop
  const dropAreas = document.querySelectorAll(".taskify-col");
  // Menyimpan referensi task yang sedang di drag
  let draggedTask = null;

  const startDrag = function () {
    draggedTask = this;
    setTimeout(() => (this.style.opacity = "0.5"), 0); // Mengurangi opasitas untuk memberikan efek drag
  };

  const endDrag = function () {
    // Menampilkan kembali task yang sedang di drag
    draggedTask.style.opacity = "1"; // Mengembalikan opasitas ke nilai aslinya
    draggedTask = null; // Mereset referensi
  };

  const overArea = function (event) {
    event.preventDefault(); // Agar browser memperbolehkan drop task di area
  };

  const enterArea = function (event) {
    event.preventDefault(); // Agar browser memperbolehkan drop task di area
  };

  const dropArea = function () {
    this.appendChild(draggedTask); // Menempatkan task di dalam area
  };

  // Event listener untuk setiap task dalam draggableTasks
  draggableTasks.forEach(task => {
    task.addEventListener("dragstart", startDrag);
    task.addEventListener("dragend", endDrag);
  });

  // Event listener untuk setiap area dalam dropAreas
  dropAreas.forEach(area => {
    area.addEventListener("dragover", overArea); // Task di atas area
    area.addEventListener("dragenter", enterArea); // Task masuk ke dalam area
    area.addEventListener("drop", dropArea); // Task dilepas di dalam area
  });
});
