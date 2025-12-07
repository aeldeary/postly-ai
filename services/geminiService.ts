import { GoogleGenAI, Type, Schema, Modality, GenerateContentResponse, GenerateContentParameters } from "@google/genai";
import { 
  PostGeneration, ReelResponse, AdGeneration, 
  WebsiteGeneration, BrandKit, CreativeIdea, ChatMessage 
} from "../types";

// Helper to get a fresh client instance. 
// This ensures that if the API_KEY environment variable changes (or if we implement key switching),
// we always use the current one.
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Improved JSON Cleaner
const cleanJson = (text: string): string => {
  if (!text) return '';
  // Try to match code blocks with or without "json" tag
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (match) return match[1].trim();
  // Fallback: Remove all code block markers and trim
  return text.replace(/```(?:json)?/g, '').replace(/```/g, '').trim();
};

const SAFETY_MESSAGE = "عذراً، لم يتم تنفيذ طلبك لأنه يحتوي على محتوى مخالف للآداب العامة وسياسات الاستخدام";

const safeErrorHandler = (error: any): string => {
    console.error("Gemini API Error:", error);
    const msg = error.message || String(error);

    if (msg.includes("SAFETY") || msg.includes("IMAGE_SAFETY") || msg.includes("BLOCK_ONLY_HIGH") || msg.includes("policy") || msg.includes("blocked")) {
        return SAFETY_MESSAGE;
    }
    if (msg.includes("IMAGE_OTHER")) {
        return SAFETY_MESSAGE;
    }
    if (msg.includes("429") || msg.includes("quota")) {
        return "⚠️ Quota exceeded. Please try again later.";
    }
    if (msg.includes("500") || msg.includes("Internal error") || msg.includes("INTERNAL")) {
        return "⚠️ Service temporarily unavailable (Internal Error). Please try again shortly.";
    }
    if (msg.includes("text only") || msg.includes("text instead")) {
         return "⚠️ Generation failed: The model returned text instead of an image. Please try again.";
    }
    if (msg.includes("JSON")) {
        return "⚠️ Failed to parse AI response. Please try again.";
    }
    
    return msg || "An unknown error occurred.";
};

// --- Retry Logic for Stability ---
const retry = async <T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> => {
    try {
        return await fn();
    } catch (err: any) {
        const msg = err.message || JSON.stringify(err);
        const isInternal = 
            msg.includes("Internal error") || 
            msg.includes("500") || 
            err.code === 500 || 
            err.status === 500 || 
            err.status === 'INTERNAL';
            
        if (retries > 0 && isInternal) {
            console.warn(`[Gemini Service] Internal Error (500). Retrying in ${delay}ms... (${retries} attempts left)`);
            await new Promise(res => setTimeout(res, delay));
            return retry(fn, retries - 1, delay * 2); // Exponential backoff
        }
        throw err;
    }
};

// Helper to map custom aspect ratio keys to API supported values
const getSafeAspectRatio = (ratio: string): string => {
    // Check for standard ratios with suffixes (e.g., '16:9_YouTube')
    if (ratio.startsWith('1:1')) return '1:1';
    if (ratio.startsWith('16:9')) return '16:9';
    if (ratio.startsWith('9:16')) return '9:16';
    if (ratio.startsWith('3:4')) return '3:4';
    if (ratio.startsWith('4:3')) return '4:3';

    switch (ratio) {
        // Print
        case 'A4_V': case 'A3_V': case 'A5_V': return '3:4'; // Portrait Paper roughly maps to 3:4
        case 'A4_H': case 'A3_H': case 'A5_H': return '4:3'; // Landscape Paper roughly maps to 4:3
        case 'BizCard': return '16:9'; // Approx 1.8 ratio
        
        // Banners
        case 'Rollup_S': case 'Rollup_M': case 'Rollup_L': return '9:16'; // Vertical Banners
        case 'Banner_H': // Legacy support
        case 'Banner_H_Wall': 
        case 'Banner_H_Road': 
        case 'Banner_H_Store': 
            return '16:9'; // Horizontal Banners
        case 'Backdrop': return '4:3'; // Standard Backdrop
        
        default: return '1:1';
    }
};

// Wrappers
const generateContent = (params: GenerateContentParameters): Promise<GenerateContentResponse> => {
    const ai = getClient();
    return retry(() => ai.models.generateContent(params));
};

const generateVideosWrapper = (params: any) => {
    const ai = getClient();
    return retry(() => ai.models.generateVideos(params));
};

export const generatePost = async (topic: string, dialect: string, language: string, industry: string, tone: string, useUserStyle: boolean): Promise<PostGeneration[]> => {
    const prompt = `Generate 4 variations of social media posts about "${topic}".
    Language: ${language}, Dialect: ${dialect}.
    Industry: ${industry}, Tone: ${tone}.
    ${useUserStyle ? "Use the user's personal style provided in context." : ""}
    IMPORTANT: The 'imagePrompt' field MUST be written in the SAME language as the post content (e.g. if Post is Arabic, imagePrompt must be Arabic).
    Return JSON array of objects: { version, post, shortVersion, cta, hashtags, tone, imagePrompt, hooks }.`;

    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '[]');
        return JSON.parse(clean);
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const generateAdvancedReelScript = async (
    topic: string, 
    language: string, 
    dialect: string, 
    industry: string, 
    mode: string, 
    isVoiceoverOnly: boolean, 
    platform?: string, 
    duration?: string
): Promise<ReelResponse> => {
    const prompt = `Act as a world-class viral video scriptwriter for short-form content.
    Create a highly engaging Reel/TikTok script.
    
    Topic: "${topic}"
    Target Platform: ${platform || 'TikTok/Reels'}
    Target Duration: ${duration || '30 seconds'}
    Language: ${language}
    Dialect: ${dialect}
    Industry: ${industry}
    Content Style: ${mode}
    Format: ${isVoiceoverOnly ? 'Voiceover driven' : 'Direct-to-camera / Skit / Mixed'}

    Requirements:
    1. **The Hook (First 3s):** Must be visually and audibly arresting to stop the scroll immediately.
    2. **Pacing:** Fast, dynamic, keeping retention high.
    3. **Music:** Suggest specific trending audio vibes or types.
    4. **Output:** A scene-by-scene breakdown.

    Return JSON with 'versions' array (provide 2 distinct versions) containing objects with:
    - style (e.g. 'Energetic', 'Storytelling', 'Trend')
    - title (Catchy internal title)
    - platform (The platform optimization)
    - estimatedDuration (e.g. "28s")
    - hook (The text of the hook)
    - musicSuggestion (Description of audio vibe)
    - scenes: Array of objects {
        time: "0:00-0:03", 
        visual: "Detailed visual description for camera", 
        camera: "Camera angle/movement", 
        audio: "Spoken script or sound effect", 
        ost: "On-Screen Text overlay (if any)"
      }
    - bRoll: Array of strings (suggestions for cuts)
    - closingLine: Strong ending
    - cta: Clear Call to Action
    - caption: Optimized social media caption
    - hashtags: Array of relevant hashtags
    `;
    
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '{}');
        return JSON.parse(clean);
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const generateAd = async (topic: string, platform: string, tone: string, language: string, dialect: string): Promise<AdGeneration[]> => {
    const prompt = `Generate 4 ad variations for ${platform} about "${topic}".
    Language: ${language}, Dialect: ${dialect}, Tone: ${tone}.
    Return JSON array: { platform, primaryText, headline, description, cta, targeting }.`;
    
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '[]');
        return JSON.parse(clean);
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const smartEdit = async (text: string, action: string): Promise<string> => {
    const prompt = `Perform the following action on the text: "${action}".
    Text: "${text}"`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const translateToEnglish = async (text: string): Promise<string> => {
    const prompt = `Translate the following text to English.
    IMPORTANT: Output ONLY the translated text. Do not add any introductory phrases, quotes, or conversational filler.
    Text to translate: "${text}"`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return response.text?.trim() || "";
    } catch (e) { return text; }
};

export const generateSingleImagePrompt = async (topic: string, language: string): Promise<string> => {
    const prompt = `Generate a single, creative, high-quality image generation prompt for the topic: "${topic}".
    Language: ${language}.
    Output ONLY the prompt text. No JSON, no labels.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text?.trim() || "";
    } catch (e) { return topic; }
};

export const generateWebsiteContent = async (topic: string, language: string, industry: string, tone: string): Promise<WebsiteGeneration[]> => {
    const prompt = `
    Role: You are a Senior Creative Copywriter and Editor-in-Chief.
    Task: Write exceptional website content for the topic: "${topic}".
    Context: Industry: ${industry}, Tone: ${tone}, Language: ${language}.
    
    Output a JSON ARRAY containing exactly 2 objects (versions).
    Each object MUST follow this schema exactly:
    {
      "version": number,
      "metaDescription": "string",
      "seoKeywords": ["string", "string"],
      "pageContent": "HTML string (Use <h1>, <h2>, <p>, <ul>, <li> tags)"
    }
    `;
    
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '[]');
        return JSON.parse(clean);
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const generateBrandKit = async (name: string, industry: string, description: string): Promise<BrandKit> => {
    const prompt = `Create a Brand Kit for "${name}" (${industry}). Description: ${description}.
    Return JSON: { brandName, slogan, mission, colors (array of {name, hex}), fontPairing, toneOfVoice, socialBio }.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '{}');
        return JSON.parse(clean);
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const generateCreativeIdeas = async (topic: string, industry: string, language: string, dialect: string, targetAudience: string, type: string): Promise<CreativeIdea[]> => {
    const prompt = `Generate 5 creative ideas for "${topic}".
    Industry: ${industry}, Language: ${language}, Audience: ${targetAudience}, Type: ${type}.
    IMPORTANT: Ensure 'imagePrompt' and 'textPrompt' are written in ${language}.
    Return JSON array: { title, description, platform, targetAudienceAnalysis, textPrompt, imagePrompt, difficulty }.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '[]');
        return JSON.parse(clean);
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const generateRawContent = async (prompt: string): Promise<string> => {
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const generateImagePromptVariations = async (topic: string): Promise<string[]> => {
    const prompt = `Generate 3 detailed image prompts for: ${topic}. Return JSON array of strings.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '[]');
        return JSON.parse(clean);
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const generateImage = async (
    prompt: string, 
    model: string, 
    aspectRatio: string, 
    style: string, 
    referenceImages?: {data: string, mimeType: string}[], 
    negativePrompt?: string, 
    isHD?: boolean, 
    visualSettings?: any
): Promise<string> => {
    const selectedModel = model || (isHD ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image');
    
    // Explicit instruction to generate an image to prevent chatty responses
    let finalPrompt = `Generate an image representing: ${prompt}`;
    
    // Map custom aspect ratio to API supported value
    const apiAspectRatio = getSafeAspectRatio(aspectRatio);
    
    const technicals = [];
    if (style) technicals.push(`**Art Style**: ${style}`);
    if (visualSettings?.angle) technicals.push(`**Camera Angle**: ${visualSettings.angle}`);
    if (visualSettings?.lighting) technicals.push(`**Lighting**: ${visualSettings.lighting}`);
    if (visualSettings?.scene) technicals.push(`**Environment**: ${visualSettings.scene}`);
    
    if (technicals.length > 0) {
        finalPrompt += "\n\n" + technicals.join(".\n") + ".";
    }
    
    if (isHD) finalPrompt += " High Quality, 8k, Photorealistic, HDR, Sharp focus.";
    
    // Anti-chatter directive
    finalPrompt += "\n\n(Output ONLY the generated image, no text description or preamble).";

    const parts: any[] = [{ text: finalPrompt }];
    if (referenceImages) {
        referenceImages.forEach(img => {
            parts.push({ inlineData: { data: img.data, mimeType: img.mimeType } });
        });
    }

    try {
        const response = await generateContent({
            model: selectedModel,
            contents: { parts },
            config: {
                imageConfig: {
                    aspectRatio: apiAspectRatio as any,
                    imageSize: (selectedModel === 'gemini-3-pro-image-preview' && isHD) ? '2K' : undefined
                }
            }
        });
        
        // Safety Check
        if (response.candidates?.[0]?.finishReason === 'SAFETY') {
             throw new Error(SAFETY_MESSAGE);
        }

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) return part.inlineData.data;
        }
        
        const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text)?.text;
        
        // If text is returned but no image, it often means the model refused or failed silently.
        if (textPart) {
             console.warn("Gemini returned text instead of image:", textPart);
             throw new Error(`Generation failed. The model responded with text: "${textPart.substring(0, 60)}..." instead of an image. Please try again or simplify the prompt.`);
        }

        throw new Error("No image generated.");
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const processImageEdit = async (
    imageData: string,
    mimeType: string,
    prompt: string,
    aspectRatio: string = '1:1'
): Promise<string> => {
    // Add instruction to force image output
    const finalPrompt = `${prompt}\n\n(Generate an image. Output ONLY the generated image, no text description or preamble).`;

    // Uses the image editing capability (prompt + image)
    const parts = [
        { inlineData: { data: imageData, mimeType: mimeType } },
        { text: finalPrompt }
    ];

    const requestConfig: any = {};
        
    // Only apply aspect ratio constraint if it's NOT 'original'
    if (aspectRatio && aspectRatio !== 'original') {
         const apiAspectRatio = getSafeAspectRatio(aspectRatio);
         requestConfig.imageConfig = { aspectRatio: apiAspectRatio as any };
    }

    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash-image', // Best for editing
            contents: { parts },
            config: requestConfig
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) return part.inlineData.data;
        }
        
        throw new Error("No edited image generated.");
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const generateProductScene = async (
    productImage: string,
    mimeType: string,
    settings: {
        projectType: string;
        storeName: string;
        sceneStyle: string;
        angle: string;
        lighting: string;
        realism: string;
        removeBg: boolean;
        effects: string[];
        customPrompt?: string;
        aspectRatio?: string;
    }
): Promise<string> => {
    let prompt = `Professional Product Photography Transformation.
    Subject: The main product in the provided image.
    ${settings.removeBg ? "Action: Place the product into a completely new environment, seamlessly blended." : "Action: Enhance the existing scene professionally."}
    
    Context:
    - Industry/Type: ${settings.projectType}
    - Scene Style: ${settings.sceneStyle} (Create a fitting high-end background)
    - Camera Angle: ${settings.angle}
    - Lighting: ${settings.lighting}
    - Realism Level: ${settings.realism}
    - Special Effects: ${settings.effects.join(', ')}
    `;

    if (settings.customPrompt) {
        prompt += `\n- Additional User Instructions: ${settings.customPrompt}`;
    }

    if (settings.storeName) {
        prompt += `\n- Branding: Add the text "${settings.storeName}" in a subtle, elegant way in the corner using a clean RB Regular font style if possible.`;
    }

    prompt += `\n\nQuality Requirements: Masterpiece, 8k resolution, cinematic depth of field, perfect composition, sharp focus on product, commercial grade quality.`;

    return generateImage(
        prompt, 
        'gemini-3-pro-image-preview', 
        settings.aspectRatio || '1:1', 
        'Cinematic', 
        [{data: productImage, mimeType}], 
        undefined, 
        true 
    );
};

export const enhanceImage = async (base64: string, mimeType: string, type: 'General' | 'Deblur' | 'Restore', level: string, aspectRatio: string): Promise<string> => {
    let prompt = "";
    if (type === 'Deblur') {
        prompt = `Fix this blurred image. Sharpen details significantly, bring subject into clear focus, remove blur, high definition, retain original content but make it crisp and clear.`;
    } else if (type === 'Restore') {
        prompt = `Restore this old photo. Fix tears, scratches, and noise. Improve clarity and faces. If black and white, subtly colorize. Make it look like a high quality restored photograph.`;
    } else {
        prompt = `Enhance this image quality. Level: ${level}. Improve lighting, texture, and details while keeping the original composition.`;
    }
    return generateImage(prompt, 'gemini-2.5-flash-image', aspectRatio, 'Enhanced', [{data: base64, mimeType}]);
};

export const smartEditImage = async (base64: string, mimeType: string, editPrompt: string, aspectRatio: string): Promise<string> => {
    return generateImage(editPrompt, 'gemini-2.5-flash-image', aspectRatio, 'Edited', [{data: base64, mimeType}]);
};

export const analyzeForFilters = async (base64: string, mimeType: string): Promise<any> => {
    const prompt = `Analyze this image and suggest CSS filter values to improve it. Return JSON.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, { inlineData: { data: base64, mimeType } }] },
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '{}');
        return JSON.parse(clean);
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const blendImages = async (images: any[], description: string, aspectRatio: string): Promise<string> => {
    const prompt = `Blend these images. ${description}. Create a cohesive composition.`;
    const parts: any[] = [{ text: prompt }];
    images.forEach(img => {
        if (img.role !== 'Not Used') {
            parts.push({ text: `[Role: ${img.role}]` });
            parts.push({ inlineData: { data: img.data, mimeType: img.mime } });
        }
    });
    try {
        // Map custom ratio
        const apiRatio = getSafeAspectRatio(aspectRatio);
        const response = await generateContent({
            model: 'gemini-2.5-flash-image', 
            contents: { parts },
            config: { imageConfig: { aspectRatio: apiRatio as any } }
        });
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) return part.inlineData.data;
        }
        throw new Error("No blended image generated.");
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const extractTextFromImage = async (base64: string, mimeType: string): Promise<string> => {
    const prompt = "Extract all text from this image.";
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, { inlineData: { data: base64, mimeType } }] }
        });
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const analyzeStyle = async (text: string): Promise<string> => {
    const prompt = `Analyze the writing style of this text. Provide a detailed style profile.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: `${prompt}\n\n${text}`
        });
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const detectStyle = async (base64: string, mimeType: string, language: string = 'English'): Promise<any> => {
    const prompt = `Analyze the visual style of this image. Return a JSON object with these keys: "mood", "lighting", "keywords" (array of strings).
    IMPORTANT: The values for "mood", "lighting", and "keywords" MUST be translated to ${language}.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, { inlineData: { data: base64, mimeType } }] },
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '{}');
        return JSON.parse(clean);
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const analyzeScene = async (base64: string, mimeType: string, language: string = 'English'): Promise<string> => {
    const prompt = `Act as a professional photographer. Analyze this image focusing on lighting, composition, camera angle, and subject. Provide a constructive critique and suggestions.
    Output Language: ${language}.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, { inlineData: { data: base64, mimeType } }] }
        });
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const visualWizardAnalysis = async (base64: string, mimeType: string): Promise<string> => {
    const prompt = `Act as a visual design wizard. Suggest improvements for this image's composition and elements.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, { inlineData: { data: base64, mimeType } }] }
        });
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const suggestBlenderDescription = async (images: any[], isRetry: boolean = false): Promise<string> => {
    let prompt = `Analyze these images and their assigned roles. Create a single, cohesive, and creative scene description that blends them together seamlessly.`;
    if (isRetry) prompt += `\n\nIMPORTANT: Provide a DIFFERENT, alternative interpretation.`;
    const parts: any[] = [{ text: prompt }];
    images.forEach(img => {
        parts.push({ text: `Role: ${img.role}` });
        parts.push({ inlineData: { data: img.data, mimeType: img.mime } });
    });
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts }
        });
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const suggestLogoPrompt = async (name: string, industry: string, description: string): Promise<string> => {
    const prompt = `Suggest a detailed logo design prompt for "${name}" in ${industry}. Description: ${description}.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const generateLogoConcepts = async (prompt: string): Promise<string[]> => {
    // IMPORTANT: Enforce "Icon Only" to prevent AI from struggling with Arabic Text
    const forcedConstraints = " . Icon, symbol, or pictorial mark ONLY. Minimalist vector style. Do NOT include any text or letters inside the image. White background.";
    const safePrompt = prompt + forcedConstraints;

    // Use Promise.allSettled to allow partial success if some images fail
    const promises = [
        generateImage(safePrompt, 'gemini-2.5-flash-image', '1:1', 'Logo Design'),
        generateImage(safePrompt + " Variation 2", 'gemini-2.5-flash-image', '1:1', 'Logo Design'),
        generateImage(safePrompt + " Variation 3", 'gemini-2.5-flash-image', '1:1', 'Logo Design')
    ];

    const results = await Promise.allSettled(promises);
    
    // Extract successful images
    const validImages = results
        .filter(r => r.status === 'fulfilled')
        .map(r => (r as PromiseFulfilledResult<string>).value)
        .map(b64 => `data:image/jpeg;base64,${b64}`);

    // If no images were generated, throw the error from the first rejected promise
    if (validImages.length === 0) {
        const firstError = results.find(r => r.status === 'rejected');
        throw new Error((firstError as PromiseRejectedResult)?.reason?.message || "Failed to generate logos");
    }

    return validImages;
};

export const enhanceGraphicDesignPrompt = async (prompt: string, style: string, colors: string[], isArabic: boolean, type: string): Promise<string> => {
    const context = `Enhance this graphic design prompt. Style: ${style}. Colors: ${colors.join(', ')}. Type: ${type}. ${isArabic ? "The design is for Arabic audience." : ""}`;
    return enhancePrompt(prompt, context);
};

export const enhancePrompt = async (prompt: string, context: string): Promise<string> => {
    const fullPrompt = `Enhance this prompt for AI generation. Original: "${prompt}". Context: ${context}. Return only the enhanced prompt.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt
        });
        return response.text || prompt;
    } catch (e) { return prompt; }
};

export const generateVideo = async (prompt: string, resolution: '720p' | '1080p', aspectRatio: '16:9' | '9:16', sourceImage?: {data: string, mimeType: string}): Promise<string> => {
    const ai = getClient();
    try {
        const model = 'veo-3.1-fast-generate-preview';
        let operation;
        const config: any = { numberOfVideos: 1, resolution, aspectRatio };

        if (sourceImage) {
            operation = await generateVideosWrapper({ model, prompt, image: { imageBytes: sourceImage.data, mimeType: sourceImage.mimeType }, config });
        } else {
            operation = await generateVideosWrapper({ model, prompt, config });
        }

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
        }

        if (operation.error) {
            throw new Error(`Video generation error: ${operation.error.message}`);
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) throw new Error("Video generation failed: No video URI returned.");
        
        const videoRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        const blob = await videoRes.blob();
        return URL.createObjectURL(blob);
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const generateSpeech = async (text: string, voice: string, language: string): Promise<string> => {
    try {
        const response = await generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: ['AUDIO'], // Changed from Modality.AUDIO to 'AUDIO'
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } }
            }
        });
        
        const candidate = response.candidates?.[0];
        if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
             if (candidate.finishReason === 'SAFETY') throw new Error(SAFETY_MESSAGE);
             throw new Error(`Speech generation blocked: ${candidate.finishReason}`);
        }

        const audioData = candidate?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) throw new Error("No audio generated. The model returned an empty response.");
        return audioData;
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const optimizeTextForAudio = async (text: string, lang: string, dialect: string, tone: string, tashkeel: boolean, isChild: boolean): Promise<string> => {
    const prompt = `Rewrite/Optimize this text for speech synthesis (TTS).
    Language: ${lang}, Dialect: ${dialect}, Tone: ${tone}.
    ${tashkeel ? "Ensure full Arabic diacritics (Tashkeel)." : ""}
    ${isChild ? "Make simple for child voice." : ""}
    Text: "${text}"`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || text;
    } catch (e) { return text; }
};

export const improveTextForAudio = async (text: string, lang: string, dialect: string, tone: string, isChild: boolean): Promise<string> => {
    const prompt = `Improve and refine this text for natural speech synthesis (TTS).
    Target Language: ${lang}
    Dialect: ${dialect}
    Tone: ${tone}
    ${isChild ? "Style: Simple, clear, suitable for a child character." : ""}
    
    Make it sound natural, conversational, and polished. Output ONLY the improved text.
    
    Original Text: "${text}"`;
    
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || text;
    } catch (e) { return text; }
};

export const addTashkeel = async (text: string): Promise<string> => {
    const prompt = `Add full, grammatically correct Arabic diacritics (Tashkeel) to the following text. 
    Ensure high accuracy for TTS pronunciation. Output ONLY the vocalized text.
    
    Text: "${text}"`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || text;
    } catch (e) { return text; }
};

export const translateText = async (text: string, targetLang: string): Promise<string> => {
    const prompt = `Translate the following text to ${targetLang}. 
    Ensure the translation is natural and suitable for speech. Output ONLY the translated text.
    
    Text: "${text}"`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || text;
    } catch (e) { return text; }
};

export const sendChatMessage = async (history: ChatMessage[], message: string): Promise<string> => {
    const ai = getClient();
    try {
        const chatHistory = history.slice(0, -1).map(h => ({ role: h.role, parts: [{ text: h.text }] }));
        const chat = ai.chats.create({ model: 'gemini-2.5-flash', history: chatHistory });
        const response = await retry(() => chat.sendMessage({ message })) as GenerateContentResponse;
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const summarizeContent = async (text: string, file?: {data: string, mimeType: string}, language?: string, title?: string): Promise<string> => {
    // Enhanced prompt for strict, source-based summary
    let prompt = `
    Role: Precision Analyst & Content Extractor.
    Task: Analyze the provided content/URL and generate a specific, factual summary based **EXCLUSIVELY** on the source material.

    STRICT CONSTRAINTS (MUST FOLLOW):
    1. **NO EXTERNAL INFO:** Do NOT add general knowledge, definitions, or background information that is not explicitly present in the source.
    2. **NO FLUFF:** Avoid vague phrases like "This article discusses..." or "The video talks about important topics." State the specific points directly.
    3. **URL HANDLING:** If a URL is provided, you MUST access and read its specific content. Do not guess based on the URL keywords. If you cannot access the page, state "Unable to access specific page content" rather than making up a summary.
    4. **SPECIFICITY:** Capture names, numbers, dates, and specific arguments found in the source.
    5. **Language:** Output strictly in ${language || 'Arabic'}.

    ${title ? `Context/Title: "${title}"` : ''}

    Output Format:
    - **Core Thesis:** 1 sentence stating exactly what the source says.
    - **Key Details:** Bullet points of specific facts/arguments extracted from the source.
    - **Deep Dive:** A concise explanation of the main arguments found *in the source text*.
    `;
    
    const parts: any[] = [{ text: prompt }];
    if (text) parts.push({ text: `Content/URL to Analyze: ${text}` });
    if (file) parts.push({ inlineData: { data: file.data, mimeType: file.mimeType } });
    
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
                // Enable search to help with URLs if provided in text
                tools: [{googleSearch: {}}] 
            }
        });
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const repurposeContent = async (summary: string, format: string, language: string): Promise<string> => {
    const prompt = `Repurpose this summary into a ${format}. Language: ${language}. Summary: "${summary}"`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const analyzeSEO = async (text: string, file?: {data: string, mimeType: string}, language?: string): Promise<any> => {
    const prompt = `Perform a comprehensive SEO analysis. Language: ${language || 'English'}. Return JSON with score, keywords, metaDescription, titleSuggestion, readability, suggestions.`;
    const parts: any[] = [{ text: prompt }];
    if (text) parts.push({ text: `Content Text: "${text.substring(0, 20000)}"` });
    if (file) parts.push({ inlineData: { data: file.data, mimeType: file.mimeType } });
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '{}');
        return JSON.parse(clean);
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const generateTemplatePrompt = async (industry: string): Promise<any> => {
    const prompt = `Generate high-quality image prompt for graphic design template: ${industry}. Suggest emoji icon. Return JSON: { prompt, icon }.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '{}');
        return JSON.parse(clean);
    } catch (e) { return { prompt: industry, icon: '✨' }; }
};

export const generateInfographicContent = async (topic: string, count: number, language: string): Promise<any[]> => {
    try {
        const prompt = `Generate ${count} infographic data points about "${topic}". Language: ${language}. Return JSON array: { title, description, icon }.`;
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '[]');
        return JSON.parse(clean);
    } catch (error) { throw new Error(safeErrorHandler(error)); }
};

export const generateInfographicPointsFromText = async (sourceText: string, count: number, language: string): Promise<any[]> => {
    try {
        const prompt = `Analyze text and extract ${count} infographic points. Language: ${language}. Return JSON array: { title, description, icon }.`;
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, { text: `Source: ${sourceText.substring(0, 10000)}` }] },
            config: { responseMimeType: 'application/json' }
        });
        const clean = cleanJson(response.text || '[]');
        return JSON.parse(clean);
    } catch (error) { throw new Error(safeErrorHandler(error)); }
};

export const generateInfographic = async (points: any[], style: string, layout: string, colors: string[], aspectRatio: string, langCode: string, renderText: boolean): Promise<string> => {
    try {
        let prompt = `Create infographic. Layout: ${layout}. Style: ${style}. Colors: ${colors.join(', ')}.`;
        points.forEach((p: any, i: number) => { prompt += `\n${i+1}. [Icon: ${p.icon}] Title: "${p.title}", Desc: "${p.description}".`; });
        if (renderText) prompt += `\nRender exact text. Language: ${langCode}.`; else prompt += `\nNo text rendering.`;
        
        let apiRatio = getSafeAspectRatio(aspectRatio);

        const base64 = await generateImage(prompt, 'gemini-3-pro-image-preview', apiRatio, style);
        return `data:image/jpeg;base64,${base64}`;
    } catch (error) { throw new Error(safeErrorHandler(error)); }
};