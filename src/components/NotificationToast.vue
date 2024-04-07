<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/NotificationStore'
import { Notification } from '@/classes/Notification'

const store = useNotificationStore()
const notification = computed<Notification | undefined>(
    () => store.notification
)
</script>

<template>
    <template v-if="notification != undefined">
        <v-snackbar
            color="white"
            position="relative"
            v-model="store.toggle"
            multi-line
            rounded="lg"
            location="top"
            timeout="3000"
            :key="notification.message"
        >
            <v-row no-gutters class="mb-2">
                <v-col cols="auto" align-self="center"
                    ><v-icon
                        :icon="
                            notification.isError
                                ? 'error_outline'
                                : 'notifications'
                        "
                        :color="notification.isError ? 'red' : 'black'"
                        size="normal"
                        start
                    ></v-icon
                ></v-col>
                <v-col class="text-subtitle-1 font-weight-bold"
                    >{{
                        notification.isError
                            ? 'Oops! Something went wrong'
                            : 'Notification'
                    }}
                </v-col>
                <v-col cols="1" align="end"
                    ><v-btn
                        icon="close"
                        variant="plain"
                        density="compact"
                        @click.down="store.toggle = false"
                    ></v-btn
                ></v-col>
            </v-row>
            <v-row no-gutters>
                <v-col cols="auto" class="mr-1"
                    >[{{ notification.date }}]</v-col
                >
                <v-col cols="auto"
                    >{{ notification.message.split('.')[0] }}.</v-col
                >
            </v-row>
        </v-snackbar>
    </template>
</template>

<style>
.v-snackbar__content {
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1) !important;
}
</style>
