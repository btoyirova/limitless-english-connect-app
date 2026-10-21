import { SpeakingEvaluation } from '../types';

export interface EvaluateSpeechParams {
  audioBlob: Blob;
  question: string;
  topicTitle: string;
  expectedLevel?: string;
}

/**
 * Converts a Blob to a base64 encoded data string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Sends student audio recording to the server-side speech evaluation endpoint powered by Gemini AI
 */
export async function evaluateStudentSpeech(
  params: EvaluateSpeechParams
): Promise<SpeakingEvaluation> {
  const base64DataUri = await blobToBase64(params.audioBlob);

  const response = await fetch('/api/evaluate-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      audioBase64: base64DataUri,
      mimeType: params.audioBlob.type || 'audio/webm',
      question: params.question,
      topicTitle: params.topicTitle,
      expectedLevel: params.expectedLevel || 'Pre-A1 to A1 beginner',
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message = errData.details
      ? `${errData.error || 'Evaluation failed'}: ${errData.details}`
      : (errData.error || `Evaluation request failed with status ${response.status}`);
    throw new Error(message);
  }

  const result: SpeakingEvaluation = await response.json();
  return result;
}
