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

document.addEventListener("DOMContentLoaded", () => {
  const dropdownButtons = document.querySelectorAll(".dropdown-button");

  dropdownButtons.forEach(button => {
    button.addEventListener("click", () => {
      const dropdownContent = button.nextElementSibling;
      dropdownContent.classList.toggle("show");
    });
  });

  // Close the dropdown menu if the user clicks outside of it
  window.addEventListener("click", (event) => {
    if (!event.target.matches('.dropdown-button')) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let dropdown of dropdowns) {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      }
    }
  });
});

// Define loadTasksFromServer function
async function loadTasksFromServer() {
  try {
    // Kirim permintaan ke server untuk mendapatkan data task
    const response = await fetch("/project");
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const columns = await response.json();

    // Bersihkan konten sebelum menambahkan task baru
    columnsContainer.innerHTML = "";

    // Iterasi melalui setiap kolom dan setiap task di dalamnya
    columns.forEach(column => {
      const columnElement = document.createElement("div");
      columnElement.classList.add("column");

      const columnTitle = document.createElement("h2");
      columnTitle.textContent = column.title;
      columnElement.appendChild(columnTitle);


      columnsContainer.appendChild(columnElement);
    });
  } catch (error) {
    throw error;
  }
}

let columnsContainer; // Variabel untuk menyimpan referensi ke container kolom

document.addEventListener("DOMContentLoaded", async () => {
  // Panggil fungsi untuk memuat ulang data tugas dari server saat halaman dimuat
  await loadTasksFromServer().catch(error => {
    console.error("Error loading tasks:", error);
  });

  // Variabel untuk menyimpan referensi ke container kolom
  columnsContainer = document.querySelector(".taskify-tasks");

  // Pilih tombol untuk menampilkan form
  const addTaskButtons = document.querySelectorAll(".add-task-button");

  addTaskButtons.forEach(addTaskButton => {
    addTaskButton.addEventListener("click", () => {
      const modal = document.getElementById("taskFormModal");
      modal.style.display = "block";
    });
  });

  // Pilih modal form
  const modal = document.getElementById("taskFormModal");
  // Pilih tombol close dalam modal
  const closeButton = document.querySelector("#taskFormModal .close");

  // Tambahkan event listener untuk tombol close di dalam form
  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Tambahkan event listener untuk menutup form jika area di luar form diklik
  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");

  // Event listener untuk submit form
  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Mencegah pengiriman default form

    // Ambil nilai dari setiap input
    const title = document.getElementById("title").value;
    const tag = document.getElementById("tag").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const comments = document.getElementById("comments").value;
    const owner = document.getElementById("owner").value;

    // Buat objek data task
    const newTask = {
      title,
      tag,
      description,
      date,
      comments,
      owner
    };

    try {
      // Kirim data ke server
      const response = await fetch("/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
      });
      Swal.fire({
        title: "Success!",
        text: "Data berhasil ditambahkan",
        icon: "success",
        confirmButtonText: "OK"
      });

    } catch (error) {
      console.error("Error adding task:", error);
      // Tampilkan popup SweetAlert2 jika terjadi kesalahan
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat menambahkan data",
        icon: "error",
        confirmButtonText: "OK"
      });
    }
    modal.style.display = "none"; // Pastikan variabel modal didefinisikan sebelum digunakan
  });
});
