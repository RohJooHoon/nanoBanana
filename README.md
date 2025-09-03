# AI Image Reference Editor

An advanced web application that utilizes the Google Gemini API (`gemini-2.5-flash-image-preview`) to perform complex image editing tasks. Users can edit a base image by providing a combination of text prompts, style reference images, and pose reference sketches or images. User authentication is securely handled via Google Sign-In.

---

## ✨ Features

- **Multi-Modal Input**: Combine multiple sources of information to guide the AI.
- **Text-Based Editing**: Modify images by describing the desired changes in natural language.
- **Style Transfer**: Apply the artistic style of one or more reference images to your base image.
- **Pose Replication**: Guide the subject's pose using a simple hand-drawn sketch or reference photos.
- **Camera Angle Control**: Adjust the perspective with intuitive controls like 'Zoom In', 'Low Angle', and 'Turn Around'.
- **User-Friendly Setup**: Configure your API keys directly in the app on first launch. No code editing required.
- **Secure Authentication**: User access is managed through a seamless Google Sign-In flow.
- **Responsive UI**: A clean, modern, and responsive interface built with React and Tailwind CSS.
- **Multiple Generations**: Generates four image variations for each request, offering more creative choices.

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A package manager like `npm` or `yarn`

### 🛠️ Setup and Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-image-editor.git
    cd ai-image-editor
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev 
    ```
    Open your browser and navigate to the local URL provided by your development server.

### 📝 First-Time Configuration

The first time you run the application, you will be prompted to enter two keys:

1.  **Gemini API Key**: This key allows the application to make calls to the Gemini AI model.
    *   You can get a free API key from [**Google AI Studio**](https://aistudio.google.com/).

2.  **Google Client ID**: This ID is required for the "Sign in with Google" functionality to work.
    *   You can obtain one from the [**Google Cloud Console**](https://console.cloud.google.com/).

After you save these keys, they will be stored in your browser's local storage for future sessions.

## 🕹️ How to Use the App

1.  **Configure Keys**: On first use, enter your Gemini API Key and Google Client ID.
2.  **Sign In**: Click the "Sign in with Google" button to authenticate.
3.  **Upload Base Image**: Start by uploading the main image you want to edit. This is a required step.
4.  **Provide Instructions**: Use any combination of the following optional inputs:
    *   **Prompt**: Describe the changes you want to see (e.g., "turn the cat into an astronaut").
    *   **Style References**: Upload one or more images to define the artistic style.
    *   **Pose References**: Draw a stick figure in the canvas or upload images to guide the subject's pose.
    *   **Camera Angle**: Select an option like "Zoom In" or "High Angle" for a different perspective.
5.  **Generate**: Click the **"Generate Images"** button.
6.  **View and Download**: The AI will generate four edited images. You can preview them and hover over any image to download it.

## 💻 Tech Stack

-   **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Model**: [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash-image-preview`)
-   **Authentication**: [Google Identity Services](https://developers.google.com/identity/gsi/web)