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

document.addEventListener("DOMContentLoaded", async () => {
  // Panggil fungsi untuk memuat ulang data tugas dari server saat halaman dimuat
  await loadTasksFromServer().catch(error => {
    console.error("Error loading tasks:", error);
  });

  // Pilih tombol untuk menampilkan form
  const addTaskButton = document.querySelector(".add-task-button");
  // Pilih modal form
  const modal = document.getElementById("taskFormModal");
  // Pilih tombol close dalam modal
  const closeButton = document.querySelector("#taskFormModal .close");
  // Pilih form
  const taskForm = document.getElementById("taskForm");
  // Pilih container untuk menampilkan task
  const columnsContainer = document.querySelector(".taskify-tasks");

  // Tambahkan event listener untuk tombol menampilkan form
  addTaskButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

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

  // Tambahkan event listener untuk submit form
  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    // Ambil nilai dari form
    const tag = document.getElementById("tag").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const comments = document.getElementById("comments").value;
    const owner = document.getElementById("owner").value;

    // Buat objek task baru
    const newTask = {
      tag: tag,
      description: description,
      date: date,
      comments: comments,
      owner: owner
    };

    // Kirim data task baru ke server
    try {
      const response = await fetch("/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
      });

      if (response.ok) {
        // Tampilkan popup SweetAlert2 jika data berhasil ditambahkan
        Swal.fire({
          title: "Success!",
          text: "Data berhasil ditambahkan",
          icon: "success",
          confirmButtonText: "OK"
        });

        // Setelah task berhasil ditambahkan, tambahkan card task baru ke dalam halaman
        const newTaskCard = createTaskCard(newTask);
        columnsContainer.appendChild(newTaskCard);
      } else {
        throw new Error("Failed to add task");
      }
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

    // Tutup pop-up form setelah task ditambahkan
    modal.style.display = "none";
  });

  // Fungsi untuk membuat elemen card task baru
  function createTaskCard(taskData) {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task");
    taskCard.innerHTML = `
      <div class="task-tags">
        <span class="task-tag">${taskData.tag}</span>
        <!-- Tambahkan opsi dropdown di sini jika diperlukan -->
      </div>
      <p>${taskData.description}</p>
      <div class="task-desc">
        <span><i class="fas fa-calendar"></i> ${taskData.date}</span>
        <button class="comments">
          <span><i class="fas fa-comments"></i> ${taskData.comments}</span>
        </button>
        <span class="task-owner">${taskData.owner}</span>
      </div>
    `;
    return taskCard;
  }

  // Fungsi untuk memuat ulang data tugas dari server
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

        column.tasks.forEach(task => {
          const taskElement = createTaskCard(task);
          columnElement.appendChild(taskElement);
        });

        columnsContainer.appendChild(columnElement);
      });
    } catch (error) {
      throw error;
    }
  }
});
