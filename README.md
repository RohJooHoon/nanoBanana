# AI Image Reference Editor

An advanced web application that utilizes the Google Gemini API (`gemini-2.5-flash-image-preview`) to perform complex image editing tasks. Users can edit a base image by providing a combination of text prompts, style reference images, and pose reference sketches or images. User authentication is securely handled via Google Sign-In.

---

## ✨ Features

- **Multi-Modal Input**: Combine multiple sources of information to guide the AI.
- **Text-Based Editing**: Modify images by describing the desired changes in natural language.
- **Style Transfer**: Apply the artistic style of one or more reference images to your base image.
- **Pose Replication**: Guide the subject's pose using a simple hand-drawn sketch or reference photos.
- **Camera Angle Control**: Adjust the perspective with intuitive controls like 'Zoom In', 'Low Angle', and 'Turn Around'.
- **Secure Authentication**: User access is managed through a seamless Google Sign-In flow.
- **Responsive UI**: A clean, modern, and responsive interface built with React and Tailwind CSS.
- **Multiple Generations**: Generates four image variations for each request, offering more creative choices.

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A package manager like `npm` or `yarn`

### 🛠️ Setup and Configuration

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-image-editor.git
    cd ai-image-editor
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**

    You will need to get two different keys from Google Cloud:
    -   **Gemini API Key**: Authorizes your application to use the Gemini API.
    -   **Google Client ID**: Authorizes your application to use Google Sign-In.

    Create a file named `.env` in the root of your project and add the following variables:

    ```env
    # For authorizing calls to the Gemini API
    API_KEY=YOUR_GEMINI_API_KEY

    # For Google Sign-In authentication
    GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
    ```

    **How to get the keys:**

    *   **`API_KEY` (Gemini):**
        1.  Go to [Google AI Studio](https://aistudio.google.com/).
        2.  Click on **"Get API key"** and create a new API key in a project.
        3.  Copy the key and paste it into your `.env` file.

    *   **`GOOGLE_CLIENT_ID` (Google Sign-In):**
        1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
        2.  Create a new project or select an existing one.
        3.  Navigate to **"APIs & Services" > "Credentials"**.
        4.  Click **"+ CREATE CREDENTIALS"** and select **"OAuth client ID"**.
        5.  Choose **"Web application"** as the application type.
        6.  Under **"Authorized JavaScript origins"**, add your local development URL (e.g., `http://localhost:8080`, `http://localhost:3000`).
        7.  Click **"CREATE"**.
        8.  Copy the **Client ID** and paste it into your `.env` file.

4.  **Run the development server:**
    ```bash
    npm run dev 
    ```
    Open your browser and navigate to the local URL provided by your development server.

## 🕹️ How to Use the App

1.  **Sign In**: Click the "Sign in with Google" button to authenticate.
2.  **Upload Base Image**: Start by uploading the main image you want to edit. This is a required step.
3.  **Provide Instructions**: Use any combination of the following optional inputs:
    *   **Prompt**: Describe the changes you want to see (e.g., "turn the cat into an astronaut").
    *   **Style References**: Upload one or more images to define the artistic style.
    *   **Pose References**: Draw a stick figure in the canvas or upload images to guide the subject's pose.
    *   **Camera Angle**: Select an option like "Zoom In" or "High Angle" for a different perspective.
4.  **Generate**: Click the **"Generate Images"** button.
5.  **View and Download**: The AI will generate four edited images. You can preview them and hover over any image to download it.

## 💻 Tech Stack

-   **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Model**: [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash-image-preview`)
-   **Authentication**: [Google Identity Services](https://developers.google.com/identity/gsi/web)
