import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { DrawingCanvas } from './components/DrawingCanvas';
import { AngleControls } from './components/AngleControls';
import { Spinner } from './components/Spinner';
import { Icon } from './components/Icon';
import type { ImageData, Angle } from './types';
import { editImage } from './services/geminiService';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { user, isInitialized } = useAuth();

  const [baseImage, setBaseImage] = useState<ImageData | null>(null);
  const [styleImages, setStyleImages] = useState<ImageData[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [poseDrawing, setPoseDrawing] = useState<string | null>(null);
  const [poseImages, setPoseImages] = useState<ImageData[]>([]);
  const [activeAngle, setActiveAngle] = useState<Angle>(null);
  
  const [outputImages, setOutputImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleBaseImageChange = (images: ImageData[]) => {
    setBaseImage(images[0] || null);
  };

  const hasAtLeastOneInput = 
    prompt.trim() !== '' || 
    styleImages.length > 0 || 
    poseDrawing !== null || 
    poseImages.length > 0 ||
    activeAngle !== null;

  const isGenerationDisabled = !baseImage || !hasAtLeastOneInput || isLoading;

  const handleGenerate = useCallback(async () => {
    if (isGenerationDisabled) return;

    setIsLoading(true);
    setError(null);
    setOutputImages([]);

    try {
      if (!baseImage) {
        throw new Error("Base image is required.");
      }
      const results = await editImage({
        baseImage,
        prompt,
        styleImages,
        poseDrawing,
        poseImages,
        angle: activeAngle,
      });
      setOutputImages(results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error("Generation failed:", errorMessage);
      setError(`Generation failed. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [baseImage, prompt, styleImages, poseDrawing, poseImages, activeAngle, isGenerationDisabled]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Spinner className="w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <Header />
      {user ? (
        <main className="flex-grow container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel: Inputs */}
          <div className="flex flex-col gap-6 bg-gray-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-cyan-400 border-b border-gray-700 pb-3">Inputs</h2>
            
            <div>
              <label className="block text-lg font-semibold mb-2">1. Base Image (Required)</label>
              <ImageUploader onImageChange={handleBaseImageChange} />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">2. Prompt (Optional)</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Make the character a cyberpunk warrior..."
                className="w-full h-28 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">3. Style References (Optional)</label>
              <ImageUploader onImageChange={setStyleImages} multiple label="Upload style images"/>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">4. Pose References (Optional)</label>
              <p className="text-sm text-gray-400 mb-2 -mt-1">Draw a pose sketch and/or upload reference images.</p>
              <DrawingCanvas onDrawingChange={setPoseDrawing} />
              <div className="mt-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">Upload Pose Images:</label>
                  <ImageUploader onImageChange={setPoseImages} multiple label="Upload pose images" />
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">5. Camera Angle (Optional)</label>
              <AngleControls activeAngle={activeAngle} onAngleChange={setActiveAngle} />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerationDisabled}
              className={`w-full py-3 px-6 text-lg font-bold rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2
                ${isGenerationDisabled 
                  ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg transform hover:scale-105'}`}
            >
              {isLoading ? <Spinner /> : <Icon.Sparkles className="w-6 h-6" />}
              {isLoading ? 'Generating...' : 'Generate Images'}
            </button>
            {!baseImage && <p className="text-center text-yellow-400 text-sm">A Base Image is required to generate.</p>}
            {baseImage && !hasAtLeastOneInput && <p className="text-center text-yellow-400 text-sm">Please provide at least one input (Prompt, Style, Pose, or Angle).</p>}
          </div>

          {/* Right Panel: Output */}
          <div className="flex flex-col gap-4 bg-gray-800 p-6 rounded-2xl shadow-lg sticky top-8">
            <h2 className="text-2xl font-bold text-purple-400 border-b border-gray-700 pb-3">Output</h2>
            <div className="aspect-square w-full bg-gray-700/50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 p-2">
              {isLoading && (
                <div className="text-center">
                  <Spinner className="w-12 h-12 text-purple-400" />
                  <p className="mt-4 text-lg animate-pulse">AI is creating magic...</p>
                  <p className="text-sm text-gray-400">Generating 4 images for you.</p>
                </div>
              )}
              {error && (
                <div className="p-4 text-center text-red-400">
                  <Icon.AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              {!isLoading && !error && outputImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2 w-full h-full">
                  {outputImages.map((src, index) => (
                    <a
                      key={index}
                      href={src}
                      download={`generated-image-${index + 1}.png`}
                      className="relative group w-full h-full rounded-md overflow-hidden"
                      aria-label={`Download generated image ${index + 1}`}
                    >
                      <img src={src} alt={`Generated result ${index + 1}`} className="object-contain w-full h-full" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-center text-white">
                          <Icon.Download className="w-8 h-8 mx-auto" />
                          <span className="text-sm font-semibold">Download</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
              {!isLoading && !error && outputImages.length === 0 && (
                <div className="text-center text-gray-400 p-4">
                  <Icon.Image className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Your generated images will appear here</p>
                  <p className="text-sm">Provide a base image and at least one instruction to start.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      ) : (
         <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center text-center">
            <Icon.Logo className="w-24 h-24 text-cyan-400 mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Welcome to the AI Image Editor</h2>
            <p className="text-lg text-gray-400">Please sign in with your Google account to continue.</p>
        </main>
      )}
    </div>
  );
};

export default App;