# Frontend Setup & Run Instructions

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and fill in your actual values for each variable.
   - Required variables:
     - `VITE_API_BASE_URL` — Base URL for backend API (e.g. https://your-backend-url)
     - `VITE_DEFAULT_LLM_MODEL` — Default LLM model (e.g. gemini-2.5-flash)

3. **Start the development server**

   ```bash
   npm run dev
   ```

   - App runs at http://localhost:3000

4. **Build for production**
   ```bash
   npm run build
   ```
