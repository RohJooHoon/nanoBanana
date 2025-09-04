import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { EditImageParams, Angle } from '../types';

export const translateText = async (apiKey: string, text: string): Promise<string> => {
    if (!text.trim()) {
        return "";
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following text to English. If it is already in English, simply return the original text without any modification or extra phrases. Text: "${text}"`,
            config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        return response.text.trim();
    } catch (error) {
        console.error("Translation Error:", error);
        // Fallback to original text if translation fails
        return text;
    }
};

const dataUrlToBase64 = (dataUrl: string): string => {
    return dataUrl.split(',')[1];
};

const getAngleInstruction = (angle: Angle): string => {
    const instructions: Record<Angle & string, string> = {
        'zoom-in': 'Perform a tight zoom-in on the main subject. The result should look like a close-up shot, significantly magnifying the central focus of the original image while maintaining detail.',
        'zoom-out': "Your primary task is to outpaint the provided image. The original image content must be perfectly preserved in the center. Expand the scene around it, generating new, contextually appropriate details to fill a larger canvas. The final image should be a seamless, wider view of the original scene.",
        'low-angle': 'Recreate the scene from a dramatic low angle, looking up at the subject.',
        'high-angle': 'Recreate the scene from a high angle, looking down upon the subject.',
        'turn-around': 'Show the subject from the opposite side, as if they have turned around 180 degrees.',
    };
    return angle ? instructions[angle] : '';
};

const generateSingleImage = async (ai: GoogleGenAI, parts: any[]): Promise<GenerateContentResponse> => {
    return ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
}

export const editImage = async (apiKey: string, params: EditImageParams): Promise<string[]> => {
    const { baseImage, prompt, styleImages, poseDrawing, poseImages, angle } = params;

    const ai = new GoogleGenAI({ apiKey });

    const parts: any[] = [];
    
    let fullPrompt = `You are an expert AI image editor. Edit the base image according to the following instructions.`;
    if (prompt) {
        fullPrompt += ` Main instruction: "${prompt}".`;
    }
    if (angle) {
        fullPrompt += ` Camera Angle instruction: ${getAngleInstruction(angle)}.`;
    }
    
    parts.push({ text: fullPrompt });

    parts.push({
        inlineData: {
            mimeType: baseImage.file.type,
            data: dataUrlToBase64(baseImage.dataUrl),
        },
    });

    if (styleImages.length > 0) {
        parts.push({ text: "Use the following images as style references:" });
        styleImages.forEach(styleImage => {
            parts.push({
                inlineData: {
                    mimeType: styleImage.file.type,
                    data: dataUrlToBase64(styleImage.dataUrl),
                },
            });
        });
    }

    if (poseDrawing) {
        parts.push({ text: "Use this sketch as a pose reference:" });
        parts.push({
            inlineData: {
                mimeType: 'image/png',
                data: dataUrlToBase64(poseDrawing),
            },
        });
    }

    if (poseImages.length > 0) {
        parts.push({ text: "Use the following images as pose references:" });
        poseImages.forEach(poseImage => {
            parts.push({
                inlineData: {
                    mimeType: poseImage.file.type,
                    data: dataUrlToBase64(poseImage.dataUrl),
                },
            });
        });
    }

    try {
        const generationPromises = Array(4).fill(0).map(() => generateSingleImage(ai, parts));
        const responses = await Promise.all(generationPromises);

        const imageUrls = responses.map((response, index) => {
            const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

            if (imagePart && imagePart.inlineData) {
                const mimeType = imagePart.inlineData.mimeType;
                const base64Data = imagePart.inlineData.data;
                return `data:${mimeType};base64,${base64Data}`;
            } else {
                 const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
                if (textPart?.text) {
                    console.warn(`API call ${index + 1} returned text: ${textPart.text}`);
                }
                if (response.candidates?.[0]?.finishReason === 'SAFETY') {
                     throw new Error(`Image ${index + 1} failed due to safety settings. Please adjust your prompt or images.`);
                }
                throw new Error(`Image ${index + 1} could not be generated. The API did not return an image.`);
            }
        });
        
        return imageUrls;

    } catch (error) {
        console.error("Gemini API Error:", error);
        if(error instanceof Error) {
            throw new Error(`[Gemini API] ${error.message}`);
        }
        throw new Error('An unexpected error occurred while contacting the Gemini API.');
    }
};
