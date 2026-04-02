document.addEventListener('DOMContentLoaded', function() {
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = '';
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('is-open');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        if (modalId === 'addMovieModal') {
            const form = document.getElementById('addMovieForm');
            if (form) form.reset();
            const posterPreview = document.getElementById('posterPreview');
            if (posterPreview) posterPreview.style.display = 'none';
            const messageDiv = document.getElementById('movieFormMessage');
            if (messageDiv) messageDiv.style.display = 'none';
        }
        if (modalId === 'editMovieModal') {
            const form = document.getElementById('editMovieForm');
            if (form) form.reset();
            const posterPreview = document.getElementById('edit_poster_preview');
            if (posterPreview) posterPreview.style.display = 'none';
            const messageDiv = document.getElementById('editMovieFormMessage');
            if (messageDiv) messageDiv.style.display = 'none';
        }
    };

    window.switchTab = function(tab) {
        const tabs = ['movies', 'games', 'bookings', 'users'];
        tabs.forEach((name) => {
            const content = document.getElementById(`${name}Tab`);
            const btn = document.getElementById(`${name}TabBtn`);
            const isActive = name === tab;
            if (content) content.classList.toggle('d-none', !isActive);
            if (btn) btn.classList.toggle('is-active', isActive);
        });
    };

    let pendingDeleteUrl = null;
    let pendingDeleteButton = null;

    const deleteModal = document.getElementById('deleteConfirmModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const closeDeleteBtn = document.getElementById('closeDeleteModal');

    function openDeleteModal(url, button) {
        if (!deleteModal) return;
        pendingDeleteUrl = url;
        pendingDeleteButton = button;
        deleteModal.classList.add('is-open');
    }

    function closeDeleteModal() {
        if (!deleteModal) return;
        deleteModal.classList.remove('is-open');
        pendingDeleteUrl = null;
        pendingDeleteButton = null;
    }

    if (closeDeleteBtn) closeDeleteBtn.onclick = closeDeleteModal;
    if (cancelDeleteBtn) cancelDeleteBtn.onclick = closeDeleteModal;
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === deleteModal) closeDeleteModal();
        });
    }
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            if (!pendingDeleteUrl || !pendingDeleteButton) return;

            const btn = pendingDeleteButton;

            const original = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = 'Deleting...';
            fetch(pendingDeleteUrl, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json'
                },
                credentials: 'include' 
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const row = btn.closest('tr');
                    if (row) row.remove();
                    showToast('Deleted successfully', 'success');
                } else {
                    showToast(data.message || 'Delete failed', 'error');
                }
            })
            .catch(() => showToast('Server error', 'error'))
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = original;
                closeDeleteModal();
            });
        });
    }

    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.delete-btn');
        if (!btn) return;
        e.preventDefault();
        const url = btn.getAttribute('data-url');
        if (url) openDeleteModal(url, btn);
    });

    const addMovieForm = document.getElementById('addMovieForm');
    if (addMovieForm) {
        addMovieForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = document.getElementById('submitMovieBtn');
            const messageDiv = document.getElementById('movieFormMessage');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            messageDiv.style.display = 'none';
            const formData = new FormData(this);
            try {
                const response = await fetch('/api/admin-api/movies', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    messageDiv.style.display = 'block';
                    messageDiv.style.background = 'rgba(74, 222, 128, 0.2)';
                    messageDiv.style.border = '1px solid rgba(74, 222, 128, 0.3)';
                    messageDiv.style.color = '#4ade80';
                    messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> ' + data.message;
                    addMovieForm.reset();
                    setTimeout(() => {
                        closeModal('addMovieModal');
                        location.reload();
                    }, 2000);
                } else {
                    messageDiv.style.display = 'block';
                    messageDiv.style.background = 'rgba(251, 113, 133, 0.2)';
                    messageDiv.style.border = '1px solid rgba(251, 113, 133, 0.3)';
                    messageDiv.style.color = '#fb7185';
                    messageDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + (data.message || 'Failed to add movie');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            } catch (error) {
                messageDiv.style.display = 'block';
                messageDiv.style.background = 'rgba(251, 113, 133, 0.2)';
                messageDiv.style.border = '1px solid rgba(251, 113, 133, 0.3)';
                messageDiv.style.color = '#fb7185';
                messageDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Network error. Please try again.';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    
    const posterInput = document.getElementById('posterInput');
    const posterPreview = document.getElementById('posterPreview');
    const posterPreviewImg = document.getElementById('posterPreviewImg');
    const posterFileName = document.getElementById('posterFileName');
    if (posterInput) {
        posterInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    posterPreviewImg.src = e.target.result;
                    posterPreview.style.display = 'block';
                    posterFileName.textContent = file.name;
                };
                reader.readAsDataURL(file);
            } else {
                posterPreview.style.display = 'none';
            }
        });
    }

    
    window.openEditMovieModal = function(movieId, title, description, genres, cast, duration, trailerLink, rating, posterUrl) {
        document.getElementById('edit_movie_id').value = movieId;
        document.getElementById('edit_title').value = title;
        document.getElementById('edit_description').value = description;
        document.getElementById('edit_genres').value = genres;
        document.getElementById('edit_cast').value = cast;
        document.getElementById('edit_duration').value = duration;
        document.getElementById('edit_trailer_link').value = trailerLink || '';
        document.getElementById('edit_rating_slider').value = rating;
        document.getElementById('edit_rating_number').value = rating;
        const previewDiv = document.getElementById('edit_poster_preview');
        previewDiv.style.display = 'none';
        document.getElementById('edit_poster_input').value = '';
        window.currentPosterUrl = posterUrl;
        openModal('editMovieModal');
    };

    const ratingSlider = document.getElementById('edit_rating_slider');
    const ratingNumber = document.getElementById('edit_rating_number');
    if (ratingSlider && ratingNumber) {
        ratingSlider.addEventListener('input', function() { ratingNumber.value = this.value; });
        ratingNumber.addEventListener('input', function() { ratingSlider.value = this.value; });
    }

    const editMovieForm = document.getElementById('editMovieForm');
    if (editMovieForm) {
        editMovieForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const movieId = document.getElementById('edit_movie_id').value;
            const submitBtn = document.getElementById('submitEditMovieBtn');
            const messageDiv = document.getElementById('editMovieFormMessage');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
            messageDiv.style.display = 'none';
            const formData = new FormData(this);
            formData.append('_method', 'PUT');
            try {
                const response = await fetch(`/api/admin-api/movies/${movieId}`, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: formData
                });
                const data = await response.json();
                if (data.success) {
                    messageDiv.style.display = 'block';
                    messageDiv.style.background = 'rgba(74, 222, 128, 0.2)';
                    messageDiv.style.border = '1px solid rgba(74, 222, 128, 0.3)';
                    messageDiv.style.color = '#4ade80';
                    messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> ' + data.message;
                    setTimeout(() => {
                        closeModal('editMovieModal');
                        location.reload();
                    }, 2000);
                } else {
                    messageDiv.style.display = 'block';
                    messageDiv.style.background = 'rgba(251, 113, 133, 0.2)';
                    messageDiv.style.border = '1px solid rgba(251, 113, 133, 0.3)';
                    messageDiv.style.color = '#fb7185';
                    messageDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + (data.message || 'Failed to update movie');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            } catch (error) {
                messageDiv.style.display = 'block';
                messageDiv.style.background = 'rgba(251, 113, 133, 0.2)';
                messageDiv.style.border = '1px solid rgba(251, 113, 133, 0.3)';
                messageDiv.style.color = '#fb7185';
                messageDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Network error. Please try again.';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    const editPosterInput = document.getElementById('edit_poster_input');
    const editPosterPreview = document.getElementById('edit_poster_preview');
    const editPosterPreviewImg = document.getElementById('edit_poster_preview_img');
    const editPosterFileName = document.getElementById('edit_poster_file_name');
    if (editPosterInput) {
        editPosterInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    editPosterPreviewImg.src = e.target.result;
                    editPosterPreview.style.display = 'block';
                    editPosterFileName.textContent = file.name;
                };
                reader.readAsDataURL(file);
            } else {
                editPosterPreview.style.display = 'none';
            }
        });
    }

    switchTab('movies');
});