import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",

  build: {
    outDir: "../dist",
    
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        
        trivia: resolve(__dirname, "src/quiz/index.html"),
        
        history: resolve(__dirname, "src/history/index.html"),
      },
    },
  },

  server: {
    port: 3000, 
  }
});