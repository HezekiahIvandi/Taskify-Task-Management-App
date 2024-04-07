document.addEventListener("DOMContentLoaded", () => {
  // Pilih semua task yang dapat di drag
  const draggableTasks = document.querySelectorAll(".task");
  // Pilih semua area yang dapat di drop
  const dropAreas = document.querySelectorAll(".taskify-col");
  // Menyimpan referensi task yang sedang di drag
  let draggedTask = null;

  // Function untuk memulai drag
  const startDrag = function () {
    draggedTask = this;
    // Mengatur opasitas untuk memberikan efek drag
    setTimeout(() => (this.style.opacity = "0.5"), 0);
  };

  // Function untuk mengakhiri drag
  const endDrag = function () {
    // Mengembalikan opasitas ke nilai aslinya
    draggedTask.style.opacity = "1";
    // Mereset referensi task yang sedang di drag
    draggedTask = null;
  };

  // Function untuk event saat mouse berada di atas area drop
  const overArea = function (event) {
    event.preventDefault(); // Mencegah default action browser
  };

  // Function untuk event saat task masuk ke dalam area drop
  const enterArea = function (event) {
    event.preventDefault(); // Mencegah default action browser
  };

  // Function untuk event saat task dilepas di dalam area drop
  const dropArea = function () {
    this.appendChild(draggedTask); // Menempatkan task di dalam area drop
  };

  // Menambahkan event listener untuk setiap task yang dapat di drag
  draggableTasks.forEach((task) => {
    task.addEventListener("dragstart", startDrag);
    task.addEventListener("dragend", endDrag);
  });

  // Menambahkan event listener untuk setiap area yang dapat di drop
  dropAreas.forEach((area) => {
    area.addEventListener("dragover", overArea); // Task di atas area
    area.addEventListener("dragenter", enterArea); // Task masuk ke dalam area
    area.addEventListener("drop", dropArea); // Task dilepas di dalam area
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const dropdownButtons = document.querySelectorAll(".dropdown-button");

  dropdownButtons.forEach((button) => {
    // Menambahkan event listener untuk setiap tombol dropdown
    button.addEventListener("click", () => {
      const dropdownContent = button.nextElementSibling;
      dropdownContent.classList.toggle("show");
    });
  });

  // Menutup dropdown menu jika user mengklik di luar dropdown
  window.addEventListener("click", (event) => {
    if (!event.target.matches(".dropdown-button")) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let dropdown of dropdowns) {
        if (dropdown.classList.contains("show")) {
          dropdown.classList.remove("show");
        }
      }
    }
  });
});

// Define loadTasksFromServer function
async function loadTasksFromServer() {
  try {
    // Mengirim permintaan ke server untuk mendapatkan data task
    const response = await fetch("/project");
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const columns = await response.json();

    // Membersihkan konten sebelum menambahkan task baru
    columnsContainer.innerHTML = "";

    // Iterasi melalui setiap kolom dan setiap task di dalamnya
    columns.forEach((column) => {
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
  // Memuat ulang data tugas dari server saat halaman dimuat
  await loadTasksFromServer().catch((error) => {
    console.error("Error loading tasks:", error);
  });

  // Menyimpan referensi ke container kolom
  columnsContainer = document.querySelector(".taskify-tasks");

  // Menambahkan event listener untuk tombol tambah task
  const addTaskButtons = document.querySelectorAll(".add-task-button");

  addTaskButtons.forEach((addTaskButton) => {
    addTaskButton.addEventListener("click", () => {
      const modal = document.getElementById("taskFormModal");
      modal.style.display = "block";
    });
  });

  // Menambahkan event listener untuk menutup modal saat tombol close di klik
  const modal = document.getElementById("taskFormModal");
  const closeButton = document.querySelector("#taskFormModal .close");

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Menutup modal jika area di luar modal diklik
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

    // Mendapatkan nilai dari dropdown title
    const titleDropdown = document.getElementById("title");
    const title = titleDropdown.value;

    // Mendapatkan nilai dari input lainnya
    const tag = document.getElementById("tag").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const collaborators = document.getElementById("collaborators").value;
    const ownerName = document.getElementById("owner").value;
    const owner = ownerName.charAt(0).toUpperCase();

    // Membuat objek data task
    const newTask = {
      title,
      tag,
      description,
      date,
      collaborators,
      owner,
    };

    try {
      // Mengirim data ke server
      const response = await fetch("/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        // Menampilkan pesan sukses jika request berhasil dengan jeda waktu
        Swal.fire({
          title: "Success!",
          text: "Data berhasil ditambahkan",
          icon: "success",
          confirmButtonText: "OK",
          timer: 2000 
        }).then(() => {
          // Setelah jeda waktu selesai, reset form dan redirect
          taskForm.reset();
          window.location.href = '/project';
        });
       
      } else {
        // Menampilkan pesan kesalahan jika request gagal
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      // Menampilkan pesan kesalahan jika terjadi kesalahan saat mengirim data ke server
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat menambahkan data",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  });
});
