<script setup lang="ts">
import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import type { Settings } from "./types/settings";
import { DEFAULT_SETTINGS } from "./types/settings";

const settings = ref<Settings>({ ...DEFAULT_SETTINGS });
const isSaving = ref(false);

// 設定の読み込み
async function loadSettings() {
  try {
    const loadedSettings = await invoke<Settings>("get_settings");
    if (loadedSettings) {
      settings.value = loadedSettings;
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
}

// 設定の保存
async function saveSettings() {
  isSaving.value = true;
  try {
    await invoke("save_settings", { settings: settings.value });
    console.log("Settings saved successfully");
  } catch (error) {
    console.error("Failed to save settings:", error);
  } finally {
    isSaving.value = false;
  }
}

// 設定のリセット
async function resetSettings() {
  try {
    await invoke("reset_settings");
    settings.value = { ...DEFAULT_SETTINGS };
    console.log("Settings reset successfully");
  } catch (error) {
    console.error("Failed to reset settings:", error);
  }
}

// 画像ファイルの選択
async function selectImage(imageType: "typing1" | "typing2" | "idle") {
  try {
    const selected = await open({
      multiple: false,
      filters: [
        {
          name: "Image",
          extensions: ["png", "jpg", "jpeg"],
        },
      ],
    });

    if (selected && typeof selected === "string") {
      settings.value.images[imageType] = selected;
    }
  } catch (error) {
    console.error("Failed to select image:", error);
  }
}

onMounted(() => {
  loadSettings();
});
</script>

<template>
  <div class="settings-window">
    <h1>Desktop Mascot Settings</h1>

    <div class="settings-section">
      <h2>Mascot Images</h2>
      <div class="image-settings">
        <div class="image-item">
          <label>Typing Image 1:</label>
          <div class="image-input-group">
            <InputText
              v-model="settings.images.typing1"
              placeholder="No image selected"
              readonly
            />
            <Button label="Select" @click="selectImage('typing1')" />
          </div>
        </div>

        <div class="image-item">
          <label>Typing Image 2:</label>
          <div class="image-input-group">
            <InputText
              v-model="settings.images.typing2"
              placeholder="No image selected"
              readonly
            />
            <Button label="Select" @click="selectImage('typing2')" />
          </div>
        </div>

        <div class="image-item">
          <label>Idle Image:</label>
          <div class="image-input-group">
            <InputText
              v-model="settings.images.idle"
              placeholder="No image selected"
              readonly
            />
            <Button label="Select" @click="selectImage('idle')" />
          </div>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h2>Animation Settings</h2>
      <div class="slider-container">
        <label>Animation Speed (ms/frame): {{ settings.animationSpeed }}</label>
        <Slider
          v-model="settings.animationSpeed"
          :min="50"
          :max="500"
          :step="10"
        />
      </div>

      <div class="slider-container">
        <label>Opacity: {{ settings.opacity.toFixed(2) }}</label>
        <Slider
          v-model="settings.opacity"
          :min="0"
          :max="1"
          :step="0.01"
        />
      </div>
    </div>

    <div class="settings-section">
      <h2>Window Settings</h2>
      <div class="window-settings">
        <div class="checkbox-item">
          <Checkbox
            v-model="settings.alwaysOnTop"
            :binary="true"
            inputId="alwaysOnTop"
          />
          <label for="alwaysOnTop">Always on Top</label>
        </div>

        <div class="position-settings">
          <div class="input-group">
            <label>X Position:</label>
            <InputNumber v-model="settings.windowPosition.x" />
          </div>
          <div class="input-group">
            <label>Y Position:</label>
            <InputNumber v-model="settings.windowPosition.y" />
          </div>
        </div>

        <div class="position-settings">
          <div class="input-group">
            <label>Width:</label>
            <InputNumber v-model="settings.windowSize.width" :min="100" />
          </div>
          <div class="input-group">
            <label>Height:</label>
            <InputNumber v-model="settings.windowSize.height" :min="100" />
          </div>
        </div>
      </div>
    </div>

    <div class="actions">
      <Button
        label="Save Settings"
        icon="pi pi-save"
        @click="saveSettings"
        :loading="isSaving"
      />
      <Button
        label="Reset to Default"
        icon="pi pi-refresh"
        severity="secondary"
        @click="resetSettings"
      />
    </div>
  </div>
</template>

<style scoped>
.settings-window {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

h2 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #555;
}

.settings-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.image-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.image-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.image-item label {
  font-weight: 500;
  color: #666;
}

.image-input-group {
  display: flex;
  gap: 10px;
}

.slider-container {
  margin-bottom: 20px;
}

.slider-container label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #666;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.window-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.position-settings {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-group label {
  font-weight: 500;
  color: #666;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>

<style>
body {
  margin: 0;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  background: #fff;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
