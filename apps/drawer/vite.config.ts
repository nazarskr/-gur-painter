import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/drawer.ts',
      name: 'Drawer',
      fileName: 'drawer',
      formats: ['es']
    }
  }
});
