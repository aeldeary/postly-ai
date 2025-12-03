
import { GoogleGenAI, Type, Schema, Modality, GenerateContentResponse, GenerateContentParameters } from "@google/genai";
import { 
  PostGeneration, ReelResponse, AdGeneration, 
  WebsiteGeneration, BrandKit, CreativeIdea, ChatMessage 
} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJson = (text: string): string => {
  return text.replace(/```json\s*|\s*```/g, '').trim();
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

// Wrappers
const generateContent = (params: GenerateContentParameters): Promise<GenerateContentResponse> => retry(() => ai.models.generateContent(params));
const generateVideosWrapper = (params: any) => retry(() => ai.models.generateVideos(params));

// --- Text Generation Functions ---

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
        return JSON.parse(cleanJson(response.text || '[]'));
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
        return JSON.parse(cleanJson(response.text || '{}'));
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
        return JSON.parse(cleanJson(response.text || '[]'));
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
    // UPDATED PROMPT FOR HUMAN-LIKE, EXPERT, AND CREATIVE OUTPUT
    const prompt = `
    Role: You are a Senior Creative Copywriter and Editor-in-Chief with 25+ years of experience in high-end branding, digital storytelling, and persuasion psychology. You have written for top global brands and won awards for your engaging, human-centric copy.

    Task: Write exceptional website content for the topic: "${topic}".

    **Context:**
    - Industry: ${industry}
    - Tone: ${tone} (Adjust your voice perfectly to match this).
    - Language: ${language} (CRITICAL: If Arabic, use eloquent, fluid, modern Arabic. Avoid "Google Translate" style. Use rich vocabulary, emotional resonance, and correct grammar).

    **Strict Writing Rules (The "Human" Filter):**
    1. **NO AI CLICHÉS:** Banish phrases like "In today's digital world," "Unlock your potential," "We are a leading company," "Meticulously crafted," "Seamlessly integrated," "Elevate your business." These are robotic.
    2. **Start Strong:** The first sentence must be a hook. A question, a bold statement, or a vivid scene. Never start with a definition.
    3. **Show, Don't Tell:** Instead of saying "We are professional," describe *how* you work. Instead of "High quality," describe the texture or the result.
    4. **Be Conversational yet Authoritative:** Write *to* the reader (Use "You"), not *at* them. Empathize with their pain points.
    5. **Sentence Variety:** Mix short, punchy sentences with longer, flowing ones. This creates rhythm.

    **Versions Required:**
    1. **Version 1 (The Storyteller):** Focus on the narrative, the "Why," and the emotional transformation. Use metaphors and evocative language.
    2. **Version 2 (The Strategist):** Focus on clarity, direct benefits, authority, and trust. Crisp, confident, and results-oriented.

    **Structure for Each Version:**
    - **Headline:** Catchy, benefit-driven, max 8 words.
    - **Sub-headline:** Explains the promise clearly.
    - **Introduction:** Captures attention immediately.
    - **Body Content:** Substantial, detailed paragraphs (3-4 paragraphs). Not just bullet points. Flow logically.
    - **Call to Action:** Compelling and urgent.

    **Output JSON Format**:
    [
      {
        "version": 1,
        "metaDescription": "Click-worthy summary (150 chars).",
        "seoKeywords": ["keyword1", "keyword2", ...],
        "pageContent": "<h2>[Headline]</h2><p class='lead'>[Sub-headline]</p><p>[Body Paragraph 1...]</p><h3>[Section Header]</h3><p>[Body Paragraph 2...]</p>..."
      },
      {
        "version": 2,
        "metaDescription": "...",
        "seoKeywords": ["..."],
        "pageContent": "..."
      }
    ]
    `;
    
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(cleanJson(response.text || '[]'));
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
        return JSON.parse(cleanJson(response.text || '{}'));
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
        return JSON.parse(cleanJson(response.text || '[]'));
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
        return JSON.parse(cleanJson(response.text || '[]'));
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

// --- Image Functions ---

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
    // Model selection logic handled by caller or fallback
    const selectedModel = model || (isHD ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image');
    
    // Construct Prompt with strong emphasis on visual settings
    let finalPrompt = prompt;
    
    // Append technical details as a strong suffix for better adherence
    const technicals = [];
    if (style) technicals.push(`**Art Style**: ${style}`);
    if (visualSettings?.angle) technicals.push(`**Camera Angle**: ${visualSettings.angle}`);
    if (visualSettings?.lighting) technicals.push(`**Lighting**: ${visualSettings.lighting}`);
    if (visualSettings?.scene) technicals.push(`**Environment**: ${visualSettings.scene}`);
    
    if (technicals.length > 0) {
        finalPrompt += "\n\n" + technicals.join(".\n") + ".";
    }
    
    if (isHD) finalPrompt += " High Quality, 8k, Photorealistic, HDR, Sharp focus.";

    // Payload
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
                    aspectRatio: aspectRatio as any,
                    // imageSize is only for gemini-3-pro-image-preview
                    imageSize: (selectedModel === 'gemini-3-pro-image-preview' && isHD) ? '2K' : undefined
                }
            }
        });
        
        // Extract image
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image generated.");
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const enhanceImage = async (base64: string, mimeType: string, type: 'General' | 'Deblur' | 'Restore', level: string, aspectRatio: string): Promise<string> => {
    let prompt = "";
    
    if (type === 'Deblur') {
        prompt = `Fix this blurred image. Sharpen details significantly, bring subject into clear focus, remove blur, high definition, retain original content but make it crisp and clear.`;
    } else if (type === 'Restore') {
        prompt = `Restore this old photo. Fix tears, scratches, and noise. Improve clarity and faces. If black and white, subtly colorize. Make it look like a high quality restored photograph.`;
    } else {
        // General enhancement
        prompt = `Enhance this image quality. Level: ${level}. Improve lighting, texture, and details while keeping the original composition.`;
    }

    return generateImage(prompt, 'gemini-2.5-flash-image', aspectRatio, 'Enhanced', [{data: base64, mimeType}]);
};

export const smartEditImage = async (base64: string, mimeType: string, editPrompt: string, aspectRatio: string): Promise<string> => {
    // Use flash-image for editing via prompt + image
    return generateImage(editPrompt, 'gemini-2.5-flash-image', aspectRatio, 'Edited', [{data: base64, mimeType}]);
};

export const analyzeForFilters = async (base64: string, mimeType: string): Promise<any> => {
    const prompt = `Analyze this image and suggest CSS filter values to improve it.
    Return JSON: { brightness (0-200), contrast (0-200), saturate (0-200), hue (0-360), blur (0-10), sepia (0-100) }. Defaults are brightness:100, contrast:100, saturate:100, others 0.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, { inlineData: { data: base64, mimeType } }] },
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(cleanJson(response.text || '{}'));
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
        const response = await generateContent({
            model: 'gemini-2.5-flash-image', 
            contents: { parts },
            config: { imageConfig: { aspectRatio: aspectRatio as any } }
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

// ... existing helper functions (analyzeStyle, detectStyle, etc.) remain unchanged
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

export const detectStyle = async (base64: string, mimeType: string): Promise<any> => {
    const prompt = `Analyze the visual style of this image. Return JSON: { mood, lighting, keywords (array) }.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [{ text: prompt }, { inlineData: { data: base64, mimeType } }] },
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(cleanJson(response.text || '{}'));
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const analyzeScene = async (base64: string, mimeType: string): Promise<string> => {
    const prompt = `Analyze this scene for a photographer. Discuss lighting, composition, and angles.`;
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
    let prompt = `Analyze these images and their assigned roles. Create a single, cohesive, and creative scene description that blends them together seamlessly.
    Roles guide:
    - Subject: The main element.
    - Background: The setting.
    - Style/Color/Lighting: The aesthetic references.
    
    Output strictly ONE paragraph describing the final image. Do not use lists. Do not use introductory text like "Here is a description".`;

    if (isRetry) {
        prompt += `\n\nIMPORTANT: Provide a DIFFERENT, alternative interpretation or composition than the obvious one. Be more creative or change the mood/lighting focus. Output ONLY the description.`;
    }

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
    // Generate 3 images sequentially or in parallel
    const p1 = generateImage(prompt, 'gemini-2.5-flash-image', '1:1', 'Logo Design');
    const p2 = generateImage(prompt + " Variation 2", 'gemini-2.5-flash-image', '1:1', 'Logo Design');
    const p3 = generateImage(prompt + " Variation 3", 'gemini-2.5-flash-image', '1:1', 'Logo Design');
    const results = await Promise.all([p1, p2, p3]);
    return results.map(b64 => `data:image/jpeg;base64,${b64}`);
};

export const enhanceGraphicDesignPrompt = async (prompt: string, style: string, colors: string[], isArabic: boolean, type: string): Promise<string> => {
    const context = `Enhance this graphic design prompt. Style: ${style}. Colors: ${colors.join(', ')}. Type: ${type}. ${isArabic ? "The design is for Arabic audience." : ""}`;
    return enhancePrompt(prompt, context);
};

export const enhancePrompt = async (prompt: string, context: string): Promise<string> => {
    const fullPrompt = `Enhance this prompt for AI generation.
    Original: "${prompt}"
    Context: ${context}
    Make it detailed, descriptive, and optimized for high-quality output. Return only the enhanced prompt.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt
        });
        return response.text || prompt;
    } catch (e) { return prompt; }
};

// --- Video ---

export const generateVideo = async (prompt: string, resolution: '720p' | '1080p', aspectRatio: '16:9' | '9:16', sourceImage?: {data: string, mimeType: string}): Promise<string> => {
    try {
        const model = 'veo-3.1-fast-generate-preview';
        let operation;
        
        const config: any = {
            numberOfVideos: 1,
            resolution: resolution,
            aspectRatio: aspectRatio
        };

        if (sourceImage) {
            operation = await generateVideosWrapper({
                model,
                prompt,
                image: {
                    imageBytes: sourceImage.data,
                    mimeType: sourceImage.mimeType
                },
                config
            });
        } else {
            operation = await generateVideosWrapper({
                model,
                prompt,
                config
            });
        }

        // Poll (Retry not typically needed for polling unless status is 500, but logic inside getVideosOperation is SDK managed)
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) throw new Error("Video generation failed.");
        
        // Fetch the actual video bytes using the key
        const videoRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        const blob = await videoRes.blob();
        return URL.createObjectURL(blob);

    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

// --- Audio ---

export const generateSpeech = async (text: string, voice: string, language: string): Promise<string> => {
    // Using gemini-2.5-flash-preview-tts
    try {
        const response = await generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voice } // e.g. 'Puck', 'Charon'
                    }
                }
            }
        });
        
        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) throw new Error("No audio generated");
        return audioData;
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const optimizeTextForAudio = async (text: string, lang: string, dialect: string, tone: string, tashkeel: boolean, isChild: boolean): Promise<string> => {
    const prompt = `Rewrite/Optimize this text for speech synthesis (TTS).
    Language: ${lang}, Dialect: ${dialect}, Tone: ${tone}.
    ${tashkeel ? "Ensure full Arabic diacritics (Tashkeel) for correct pronunciation." : ""}
    ${isChild ? "Make the language simple and suitable for a child voice." : ""}
    Text: "${text}"`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || text;
    } catch (e) { return text; }
};

// --- Chat ---

export const sendChatMessage = async (history: ChatMessage[], message: string): Promise<string> => {
    try {
        // Map history to Content objects
        const chatHistory = history.slice(0, -1).map(h => ({
            role: h.role,
            parts: [{ text: h.text }]
        }));

        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: chatHistory
        });

        const response = await retry(() => chat.sendMessage({ message })) as GenerateContentResponse;
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

// --- Summary & Repurposing ---

export const summarizeContent = async (text: string, file?: {data: string, mimeType: string}, language?: string, title?: string): Promise<string> => {
    let prompt = `Summarize this content. Language: ${language || 'English'}. ${title ? `Title context: ${title}` : ''}`;
    const parts: any[] = [{ text: prompt }];
    if (text) parts.push({ text: `Text: ${text}` });
    if (file) parts.push({ inlineData: { data: file.data, mimeType: file.mimeType } });

    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts }
        });
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const repurposeContent = async (summary: string, format: string, language: string): Promise<string> => {
    const prompt = `Repurpose this summary into a ${format}. Language: ${language}.
    Summary: "${summary}"`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        return response.text || "";
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

export const analyzeSEO = async (text: string, file?: {data: string, mimeType: string}, language?: string): Promise<any> => {
    const prompt = `Perform a comprehensive SEO analysis on the following content.
    Language: ${language || 'English'}.
    
    Return a JSON object with:
    - score: number (0-100) representing overall SEO quality.
    - keywords: array of strings (top 5-10 relevant keywords found).
    - metaDescription: string (a generated optimized meta description max 160 chars).
    - titleSuggestion: string (an optimized title suggestion).
    - readability: string (e.g., "Easy", "Moderate", "Hard").
    - suggestions: array of strings (3-5 actionable tips to improve SEO).`;

    const parts: any[] = [{ text: prompt }];
    if (text) parts.push({ text: `Content Text: "${text.substring(0, 20000)}"` });
    if (file) parts.push({ inlineData: { data: file.data, mimeType: file.mimeType } });

    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(cleanJson(response.text || '{}'));
    } catch (e) { throw new Error(safeErrorHandler(e)); }
};

// --- Template ---

export const generateTemplatePrompt = async (industry: string): Promise<any> => {
    const prompt = `Generate a high-quality image generation prompt for a graphic design template for: ${industry}. 
    Also suggest a relevant single emoji icon.
    Return JSON: { prompt, icon }.`;
    try {
        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(cleanJson(response.text || '{}'));
    } catch (e) { return { prompt: industry, icon: '✨' }; }
};

// --- Infographic ---

export const generateInfographicContent = async (topic: string, count: number, language: string): Promise<any[]> => {
    try {
        const prompt = `Generate ${count} succinct infographic data points about "${topic}".
        Language: ${language}.
        Each point must have: 
        1. A short, catchy Title (max 3 words).
        2. A very brief Description (max 8 words).
        3. A suggested Emoji icon representing the point.
        Return strictly a JSON array of objects: { title, description, icon }.`;

        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        return JSON.parse(cleanJson(response.text || '[]'));
    } catch (error) {
        throw new Error(safeErrorHandler(error));
    }
};

export const generateInfographicPointsFromText = async (sourceText: string, count: number, language: string): Promise<any[]> => {
    try {
        const prompt = `Analyze the following text and extract ${count} key infographic data points.
        Language: ${language}.
        Source Text: "${sourceText.substring(0, 10000)}"
        
        For each point, provide:
        1. A short, catchy Title (max 5 words).
        2. A summarized Description (max 15 words).
        3. A suggested Emoji icon.
        
        Return strictly a JSON array of objects: { title, description, icon }.`;

        const response = await generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        return JSON.parse(cleanJson(response.text || '[]'));
    } catch (error) {
        throw new Error(safeErrorHandler(error));
    }
};

export const generateInfographic = async (
    points: {title: string, description: string, icon: string}[],
    style: string,
    layout: string,
    colors: string[],
    aspectRatio: string,
    langCode: 'ar' | 'en',
    renderText: boolean
): Promise<string> => {
    try {
        let prompt = `Create a professional high-quality infographic.
        Layout: ${layout}.
        Style: ${style}.
        Color Palette: ${colors.join(', ')}.
        Background: Clean, solid or subtle gradient, professional.
        
        Content to visualize (Step by step):`;
        
        points.forEach((p, i) => {
            prompt += `\n${i+1}. [Icon: ${p.icon}] Title: "${p.title}", Desc: "${p.description}".`;
        });

        if (renderText) {
            prompt += `\n\nCRITICAL TEXT INSTRUCTION: Render the exact text provided for titles and descriptions directly into the image. Use a legible, modern font. Ensure high contrast.`;
            if (langCode === 'ar') {
                prompt += ` The text is in ARABIC. Ensure characters are connected correctly and flow Right-to-Left. Use a bold Arabic font style (like Kufi or Naskh).`;
            }
        } else {
            prompt += `\n\nCRITICAL LAYOUT INSTRUCTION: Do NOT render any text. Create empty placeholders (boxes, circles, or lines) where text would go. Focus on the icons, graphics, connectors, and overall composition. I will add text later.`;
        }

        prompt += `\n\nVisual Quality: Vector art style, sharp lines, high resolution, 8k, infographic masterpiece, visually balanced, margins for text.`;

        let apiRatio = aspectRatio;
        // Map common graphic design presets to closest supported model ratio
        const ratioMap: Record<string, string> = {
            '1:1': '1:1',
            '4:5': '3:4',
            'A4_V': '3:4',
            'A5_V': '3:4',
            'Story': '9:16',
            '9:16': '9:16',
            '16:9': '16:9',
            'A4_H': '4:3',
            'Presentation': '16:9',
            'Twitter': '16:9',
            'LinkedIn': '4:3'
        };
        if (ratioMap[aspectRatio]) apiRatio = ratioMap[aspectRatio];

        const base64 = await generateImage(
            prompt, 
            'gemini-3-pro-image-preview', 
            apiRatio, 
            style
        );
        
        return `data:image/jpeg;base64,${base64}`;

    } catch (error) {
        console.warn("Pro model failed, trying flash for infographic...");
        throw new Error(safeErrorHandler(error));
    }
};
