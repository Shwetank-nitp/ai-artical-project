# Article Creating AI Assistant

Welcome to the Article Creating AI Assistant! This project is designed to help users generate and optimize articles using AI. Below is a guide to set up the project locally on your machine.

---

## Local Setup Guide

Follow these steps to set up and run the project locally:

### 1. Get Google Studio API Key

- Visit [Google Ai Studio](https://ai.google.dev/aistudio).
- Create a new project or select an existing one.
- Enable the necessary APIs for the project (e.g., Generative AI API).
- Generate an API key from the "Credentials" section.
- Copy the API key for use in the next steps.

### 2. Rename the `example.env` File

- Navigate to the `/apps/http` directory in the project.
- Locate the `example.env` file.
- Rename it to `.env`.

### 3. Paste the API Key

- Open the newly renamed `.env` file.
- Paste your Google Studio API key into the appropriate field:
  ```env
  KEY=your_api_key_here
  ```

### 4. Install Dependencies

- Go back to the root directory of the project.
- If you don't have `pnpm` installed, follow the installation guide at [pnpm.io/installation](https://pnpm.io/installation).
- Open a terminal or command prompt in the root directory.
- Run the following command to install dependencies:
  ```bash
  pnpm install
  ```

### 5. Run the Project

- Once the dependencies are installed, start the development server by running (important run these command Root level of the project to start both backend and frontend at once):

  ```bash
  pnpm run dev
  ```

  or, if you prefer using npm:

  ```bash
  npm run dev
  ```

- The application should now be running locally. Open your browser and navigate to the provided local server URL
  frontend (usually `http://localhost:3000`).

---

## Additional Notes

- Ensure you have Node.js installed (version 16 or higher recommended).
- If you encounter any issues during setup, check the terminal logs for error messages.
- For more information about the project structure, refer to the project documentation.

---
