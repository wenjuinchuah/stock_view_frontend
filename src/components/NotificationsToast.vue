<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Toast } from "bootstrap";

const notificationsMessage = ref("Oops, something went wrong...");

onMounted(() => {
    const notifications = document.getElementById("notifications");
    const notificationsToast = Toast.getOrCreateInstance(notifications);
    notificationsToast.show();
});
</script>

<template>
    <div
        id="notifications"
        class="toast align-items-center position-absolute bottom-0 end-0 m-4"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        data-bs-autohide="false"
    >
        <div class="toast-header gap-2">
            <i class="bi bi-bell"></i>
            <strong class="me-auto">Notifications</strong>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
            ></button>
        </div>
        <div class="toast-body">{{ notificationsMessage }}</div>
    </div>
</template>
