<script setup lang="ts">
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

// 設定ウィンドウを開く
async function openSettings() {
  const settingsWindow = await WebviewWindow.getByLabel("settings");

  if (settingsWindow) {
    await settingsWindow.show();
    await settingsWindow.setFocus();
  } else {
    new WebviewWindow("settings", {
      url: "/settings.html",
      title: "Settings",
      width: 600,
      height: 500,
      resizable: true,
    });
  }
}

// 右クリックでメニューを表示
function handleContextMenu(event: MouseEvent) {
  event.preventDefault();
  openSettings();
}
</script>

<template>
  <div
    class="main-window"
    data-tauri-drag-region
    @contextmenu="handleContextMenu"
  >
    <div class="mascot-container">
      <div class="mascot-placeholder">
        <!-- マスコット画像がここに表示される -->
        <div class="mascot-text">🐱</div>
      </div>
      <button class="settings-btn" @click="openSettings">⚙️</button>
    </div>
  </div>
</template>

<style scoped>
.main-window {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
}

.mascot-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mascot-placeholder {
  font-size: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.mascot-text {
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.settings-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.settings-btn:hover {
  opacity: 1;
}
</style>

<style>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: transparent;
}

#app {
  width: 100vw;
  height: 100vh;
}
</style>