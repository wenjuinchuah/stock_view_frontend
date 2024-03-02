import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsMenuStore = defineStore('settingsMenu', () => {
  const isToggled = ref(false)

  const toggle = () => {
    isToggled.value = !isToggled.value
  }

  return {
    isToggled,
    toggle
  }
})
