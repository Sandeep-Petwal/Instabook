# Steps for ShadCn -

## 1. Install tailwind

```javascript
npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init -p
```

## 1.2 . Edit index.css

``` javascript
@tailwind base;
@tailwind components;
@tailwind utilities;

```
## 1.2 . Edit tailwind.config.js

``` javascript
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
```

## 2. Creat jsconfig.json 
``` javascript
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@/*": [
                "./src/*"
            ]
        }
    }
}
```

## 3. Edit vite.config.js
``` javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

})
```

## 4. Run following command
``` javascript
npx shadcn@latest init
```

## 
``` javascript
```