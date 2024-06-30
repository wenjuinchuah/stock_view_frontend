<script setup lang="ts">
import { useNotificationStore } from '@/stores/NotificationStore'

const store = useNotificationStore()
</script>

<template>
    <template v-if="store.notification != undefined">
        <v-snackbar
            color="white"
            position="relative"
            v-model="store.isToggled"
            rounded="lg"
            location="top"
            :timeout="store.timeout"
            :key="store.notification.message"
        >
            <v-row no-gutters>
                <v-col cols="auto" align-self="center"
                    ><v-icon
                        :icon="
                            store.notification.isError
                                ? 'error_outline'
                                : 'notifications'
                        "
                        :color="store.notification.isError ? 'red' : 'black'"
                        size="normal"
                        start
                    ></v-icon
                ></v-col>
                <v-col class="text-subtitle-1 font-weight-bold"
                    >{{
                        store.notification.title
                            ? store.notification.title
                            : store.notification.isError
                              ? 'Oops! Something went wrong'
                              : 'Notification'
                    }}
                </v-col>
                <v-col cols="1" align="end"
                    ><v-btn
                        icon="close"
                        variant="plain"
                        density="compact"
                        @click.down="store.isToggled = false"
                    ></v-btn
                ></v-col>
            </v-row>
            <template v-if="store.notification.message">
                <v-row no-gutters class="mt-2">
                    <v-col cols="auto" class="mr-1"
                        >[{{ store.notification.date }}]</v-col
                    >
                    <v-col cols="auto"
                        >{{ store.notification.message.split('.')[0] }}.</v-col
                    >
                </v-row>
            </template>
        </v-snackbar>
    </template>
</template>

<style>
.v-snackbar__content {
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1) !important;
}
</style>
