export interface ImageData {
  file: File;
  dataUrl: string;
}

export type Angle = 'zoom-in' | 'zoom-out' | 'low-angle' | 'high-angle' | 'turn-around' | null;

export interface EditImageParams {
  baseImage: ImageData;
  prompt: string;
  styleImages: ImageData[];
  poseDrawing: string | null;
  poseImages: ImageData[];
  angle: Angle;
}

export interface AngleOption {
    id: Angle;
    label: string;
    icon: (className: string) => React.ReactNode;
}