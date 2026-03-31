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

    let pendingDeleteUrl = null;
    let pendingDeleteButton = null;

    const modal = document.getElementById('deleteConfirmModal');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    const closeBtn = document.getElementById('closeDeleteModal');

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        pendingDeleteUrl = null;
        pendingDeleteButton = null;
    }

    function showModal(url, button) {
        if (!modal) return;
        pendingDeleteUrl = url;
        pendingDeleteButton = button;
        modal.classList.add('is-open');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            if (!pendingDeleteUrl || !pendingDeleteButton) return;

            const deleteBtn = pendingDeleteButton;
            const url = pendingDeleteUrl;
             const originalHtml = deleteBtn.innerHTML;
           

            fetch(url, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const row = deleteBtn.closest('tr');
                    if (row) row.remove();
                    showToast('Item deleted successfully', 'success');
                } else {
                    showToast(data.message || 'Delete failed', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('An error occurred while deleting.', 'error');
            })
            .finally(() => {
                deleteBtn.disabled = false;
                deleteBtn.innerHTML = originalHtml;
                closeModal();
            });
        });
    }

   document.addEventListener('click', function(e) {
        const deleteBtn = e.target.closest('.delete-btn');
        if (!deleteBtn) return;

        e.preventDefault();
        e.stopPropagation();

        const url = deleteBtn.getAttribute('data-url');
        if (!url) return;

        showModal(url, deleteBtn);
    });
});