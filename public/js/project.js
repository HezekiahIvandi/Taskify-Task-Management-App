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

document.addEventListener('DOMContentLoaded', function () {
  // Memilih semua tombol delete
  var deleteButtons = document.querySelectorAll('.delete-option');

  // Menambahkan event listener ke setiap tombol delete
  deleteButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();

      // Mengambil nama koleksi dari atribut title pada elemen <h1> yang sesuai
      var taskElement = button.closest('.taskify-col');
      var collectionName = taskElement.querySelector('.taskify-col-header-title').getAttribute('title');

      // Mengambil deskripsi data dari atribut description pada elemen <p> yang sesuai
      var dataDescription = taskElement.querySelector('p').getAttribute('description');

      // Mengirim permintaan penghapusan ke backend
      fetch('/delete-task?collection=' + collectionName + '&data=' + dataDescription, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
        // Jika berhasil, perbarui tampilan frontend atau lakukan tindakan lain yang sesuai
        console.log('Task deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Memilih semua tombol delete
  var deleteButtons = document.querySelectorAll('.delete-option');

  // Menambahkan event listener ke setiap tombol delete
  deleteButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();

      // Mengambil nama koleksi dari atribut title pada elemen <h1> yang sesuai
      var taskElement = button.closest('.taskify-col');
      var collectionName = taskElement.querySelector('.taskify-col-header-title').getAttribute('title');

      // Mengambil deskripsi data dari atribut description pada elemen <p> yang sesuai
      var dataDescription = taskElement.querySelector('p').getAttribute('description');

      // Mengirim permintaan penghapusan ke backend
      fetch('/delete-task?collection=' + collectionName + '&data=' + dataDescription, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
        // Jika berhasil, perbarui tampilan frontend atau lakukan tindakan lain yang sesuai
        console.log('Task deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
    });
  });
});

// Tambahkan event listener untuk setiap tombol "Edit"
document.querySelectorAll('.edit-option').forEach(button => {
  button.addEventListener('click', function(event) {
    event.preventDefault(); // Menghentikan default behavior dari link
    
    // Ambil informasi tugas terkait
    const taskElement = this.closest('.task');
    const taskTitle = document.querySelector('.taskify-col-header-title').getAttribute('title');
    const taskTag = taskElement.querySelector('.task-tag').textContent;
    const taskDescription = taskElement.querySelector('p').getAttribute('description');
    const taskDate = taskElement.querySelector('.task-desc span:first-child').textContent.trim();
    const taskComments = taskElement.querySelector('.comments span').textContent.trim();
    const taskOwner = taskElement.querySelector('.task-owner').textContent.trim();
    
    // Isi formulir edit dengan informasi tugas yang diambil
    document.getElementById('title').value = taskTitle;
    document.getElementById('tag').value = taskTag;
    document.getElementById('description').value = taskDescription;
    document.getElementById('date').value = taskDate;
    document.getElementById('comments').value = taskComments;
    document.getElementById('owner').value = taskOwner;

    // Tampilkan modal form edit
    const modal = document.getElementById('taskFormModal');
    modal.style.display = "block";

    // Ubah title modal
    document.querySelector('#taskFormModal h2').textContent = "Edit Current Task";
    
    // Ubah teks tombol submit
    document.querySelector('#taskForm button[type="submit"]').textContent = "Edit Task";
  });
});

// Tambahkan event listener untuk tombol close pada modal
document.querySelectorAll('.close').forEach(button => {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    const modal = this.closest('.modal');
    modal.style.display = "none";
  });
});


// Tambahkan event listener untuk tombol submit pada form
document.getElementById('taskForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Ambil data dari formulir
  const formData = new FormData(this);
  const updatedData = {};
  formData.forEach((value, key) => {
    updatedData[key] = value;
  });

  // Ambil title dari formulir untuk menentukan koleksi yang akan diperbarui
  const title = document.getElementById('title').value;

  // Kirim data ke endpoint update-task di backend
  fetch('/update-task', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title,
      description: updatedData.description,
      updatedData: updatedData
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
    // Jika berhasil, perbarui tampilan frontend atau lakukan tindakan lain yang sesuai
    console.log('Task updated successfully');
    // Anda mungkin ingin menambahkan logika di sini untuk memperbarui tampilan frontend jika diperlukan
  })
  .catch(error => {
    console.error('Error updating task:', error);
  });
});
