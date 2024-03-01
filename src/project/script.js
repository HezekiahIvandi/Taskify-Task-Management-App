document.addEventListener('DOMContentLoaded', function() {
    // Pilih semua task yang dapat di drag
    const draggableTasks = document.querySelectorAll('.task');
    // Pilih semua area yang dapat di drop
    const dropAreas = document.querySelectorAll('.taskify-col');
    // Menyimpan referensi task yang sedang di drag
    var draggedTask = null; 

    // Event listener untuk setiap task dalam draggableTasks
    draggableTasks.forEach(task => {
        task.addEventListener('dragstart', startDrag);
        task.addEventListener('dragend', endDrag);
    });

    function startDrag() {
        draggedTask = this;
        // Menyembunyikan task yang sedang di drag untuk sementara
        this.classList.add('invisible');
        setTimeout(() => this.style.opacity = '0.5', 0); // Mengurangi opasitas untuk memberikan efek drag
    }

    function endDrag() {
        // Menampilkan kembali task yang sedang di drag
        draggedTask.classList.remove('invisible');
        draggedTask.style.opacity = '1'; // Mengembalikan opasitas ke nilai aslinya
        draggedTask = null; // Mereset referensi
    }

    // Event listener untuk setiap area dalam dropAreas
    dropAreas.forEach(area => {
        area.addEventListener('dragover', overArea); // Task di atas area
        area.addEventListener('dragenter', enterArea); // Task masuk ke dalam area
        area.addEventListener('dragleave', leaveArea); // Task meninggalkan area 
        area.addEventListener('drop', dropArea); // Task dilepas di dalam area 
    });

    function overArea(event) {
        event.preventDefault(); // Agar browser memperbolehkan drop task di area
    }

    function enterArea(event) {
        event.preventDefault();
        this.classList.add('hovered');
    }

    function leaveArea() {
        this.classList.remove('hovered');
    }

    function dropArea() {
        this.classList.remove('hovered');
        this.appendChild(draggedTask); // Menempatkan task di dalam area
    }
});