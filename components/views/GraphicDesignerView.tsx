
import React, { useState, useContext, useRef, useEffect, useMemo } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import Button from '../Button';
import { PaintBrushIcon, Loader, TrashIcon, AlignRightIcon, AlignCenterIcon, AlignLeftIcon, AlignJustifyIcon, AdjustmentsHorizontalIcon, SwatchIcon, ArrowsRightLeftIcon } from '../Icons';
import { GRAPHIC_DESIGN_STYLES, GRAPHIC_DESIGN_SIZES, MOCKUP_TYPES_GROUPED, LANGUAGES_GROUPED, ARCHIVE_STORAGE_KEY } from '../../constants';
import * as geminiService from '../../services/geminiService';
import CustomGroupedSelect from '../CustomGroupedSelect';
import { setItem, getItem, removeItem } from '../../utils/localStorage';
import { AdvancedColorPicker } from '../AdvancedColorPicker';
import { ArchivedItem } from '../../types';
import ExportMenu from '../ExportMenu';

type Mode = 'Poster' | 'Mockup';
type TextPosition = 'Top' | 'Center' | 'Bottom' | 'TopRight' | 'TopLeft' | 'BottomRight' | 'BottomLeft' | 'SideRight' | 'SideLeft' | 'BelowHeadline' | 'AwayTop' | 'AwayBottom' | 'AwayRight' | 'AwayLeft';
type TextBgMode = 'Shadow' | 'Gradient' | 'Line' | 'Box' | 'Clean';
type ActiveLayer = 'Headline' | 'Subhead' | 'Body';
type TextAlign = 'right' | 'center' | 'left' | 'justify';

const PRESET_GRADIENTS = [
    { name: 'Sunset', colors: ['#ee0979', '#ff6a00'] },
    { name: 'Ocean', colors: ['#2193b0', '#6dd5ed'] },
    { name: 'Gold', colors: ['#bf8339', '#F3F9A7'] },
    { name: 'Luxury', colors: ['#0f2027', '#203a43', '#2c5364'] },
    { name: 'Berry', colors: ['#8E2DE2', '#4A00E0'] },
    { name: 'Mint', colors: ['#00b09b', '#96c93d'] },
    { name: 'Deep', colors: ['#232526', '#414345'] },
    { name: 'Desert', colors: ['#C33764', '#1D2671'] },
    { name: 'Royal', colors: ['#141E30', '#243B55'] },
    { name: 'Neon', colors: ['#00F260', '#0575E6'] },
];

// --- TEXT ALIGN COMPONENT ---
const TextAlignSelector: React.FC<{value: TextAlign, onChange: (v: TextAlign) => void}> = ({value, onChange}) => (
    <div className="flex bg-black/20 rounded-lg p-1 border border-white/10 w-fit">
        <button 
            onClick={() => onChange('right')} 
            className={`p-1.5 rounded transition ${value === 'right' ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/60 hover:text-white'}`}
            title="Right Align (RTL)"
        >
            <AlignRightIcon className="w-4 h-4" />
        </button>
        <button 
            onClick={() => onChange('center')} 
            className={`p-1.5 rounded transition ${value === 'center' ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/60 hover:text-white'}`}
            title="Center Align"
        >
            <AlignCenterIcon className="w-4 h-4" />
        </button>
        <button 
            onClick={() => onChange('left')} 
            className={`p-1.5 rounded transition ${value === 'left' ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/60 hover:text-white'}`}
            title="Left Align (LTR)"
        >
            <AlignLeftIcon className="w-4 h-4" />
        </button>
        <button 
            onClick={() => onChange('justify')} 
            className={`p-1.5 rounded transition ${value === 'justify' ? 'bg-[#bf8339] text-[#0a1e3c]' : 'text-white/60 hover:text-white'}`}
            title="Justify"
        >
            <AlignJustifyIcon className="w-4 h-4" />
        </button>
    </div>
);

const GraphicDesignerView: React.FC = () => {
    const { appLanguage } = useContext(ProjectContext);
    const isAr = appLanguage === 'ar';
    const [mode, setMode] = useState<Mode>('Poster');

    // Poster State
    const [posterTopic, setPosterTopic] = useState('');
    const [posterSize, setPosterSize] = useState('1:1');
    const [posterStyle, setPosterStyle] = useState(GRAPHIC_DESIGN_STYLES[0].options[0].value);
    const [posterLang, setPosterLang] = useState('Arabic');

    // Reference Images State
    const [referenceImages, setReferenceImages] = useState<{ id: string, data: string, mimeType: string }[]>([]);
    const referenceFileRef = useRef<HTMLInputElement>(null);

    // Advanced Color System
    const [paletteColors, setPaletteColors] = useState<string[]>(['#bf8339', '#0a1e3c', '#ffffff']);
    
    // Optional Sections
    const [showBgColor, setShowBgColor] = useState(false);
    const [bgColor, setBgColor] = useState('#000000');
    
    // Gradient System
    const [showGradient, setShowGradient] = useState(false);
    const [gradientType, setGradientType] = useState<'2' | '3'>('2');
    const [gradientColors, setGradientColors] = useState<string[]>(['#bf8339', '#2e4f8a']);
    
    const [showTextColor, setShowTextColor] = useState(false);
    const [textColor, setTextColor] = useState('#ffffff');

    const [showIconColor, setShowIconColor] = useState(false);
    const [iconColor, setIconColor] = useState('#ffffff');
    
    const [showLabelColor, setShowLabelColor] = useState(false);
    const [labelColor, setLabelColor] = useState('#bf8339');

    // --- ARABIC TEXT OVERLAY STATE ---
    const [activeLayer, setActiveLayer] = useState<ActiveLayer>('Headline');
    
    const [headlineText, setHeadlineText] = useState('');
    const [headlineFont, setHeadlineFont] = useState('Cairo');
    const [headlineSize, setHeadlineSize] = useState(80);
    const [headlinePos, setHeadlinePos] = useState<TextPosition>('Top');
    const [headlineBg, setHeadlineBg] = useState<TextBgMode>('Shadow');
    const [headlineOffset, setHeadlineOffset] = useState({x: 0, y: 0});
    const [headlineAlign, setHeadlineAlign] = useState<TextAlign>('center');

    const [subHeadText, setSubHeadText] = useState('');
    const [subHeadFont, setSubHeadFont] = useState('Tajawal');
    const [subHeadSize, setSubHeadSize] = useState(50);
    const [subHeadPos, setSubHeadPos] = useState<TextPosition>('BelowHeadline'); 
    const [subHeadBg, setSubHeadBg] = useState<TextBgMode>('Shadow');
    const [subHeadOffset, setSubHeadOffset] = useState({x: 0, y: 0});
    const [subHeadAlign, setSubHeadAlign] = useState<TextAlign>('center');

    const [bodyText, setBodyText] = useState('');
    const [bodyFont, setBodyFont] = useState('Tajawal');
    const [bodySize, setBodySize] = useState(30);
    const [bodyPos, setBodyPos] = useState<TextPosition>('Bottom');
    const [bodyBg, setBodyBg] = useState<TextBgMode>('Gradient');
    const [bodyOffset, setBodyOffset] = useState({x: 0, y: 0});
    const [bodyAlign, setBodyAlign] = useState<TextAlign>('center');

    // --- AI DESIGN TEXT STATE (NON-ARABIC) ---
    const [aiDesignText, setAiDesignText] = useState('');

    // Mockup State
    const [mockupImage, setMockupImage] = useState<string | null>(null);
    const [mockupType, setMockupType] = useState('');
    const [mockupPrompt, setMockupPrompt] = useState('');

    const [rawGeneratedImage, setRawGeneratedImage] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState(false);
    const mockupFileRef = useRef<HTMLInputElement>(null);

    // --- CONSTANTS FOR CUSTOM SELECTS (Localized) ---
    const FONT_GROUPS = useMemo(() => [
      { label: isAr ? "حديث / Modern" : "Modern", options: [
        { label: "Cairo (كايرو)", value: "Cairo" },
        { label: "Tajawal (تجوّل)", value: "Tajawal" },
        { label: "Almarai (المراعي)", value: "Almarai" },
        { label: "Mada (مدى)", value: "Mada" }
      ]},
      { label: isAr ? "عناوين / Display" : "Display", options: [
        { label: "Changa (تشانجا)", value: "Changa" },
        { label: "Lalezar (لاليزار)", value: "Lalezar" },
        { label: "Lemonada (ليمونادة)", value: "Lemonada" }
      ]},
      { label: isAr ? "تقليدي / Traditional" : "Traditional", options: [
        { label: "Noto Kufi (كوفي)", value: "Noto Kufi Arabic" },
        { label: "Amiri (أميري)", value: "Amiri" },
        { label: "El Messiri (المسيري)", value: "El Messiri" },
        { label: "Reem Kufi (ريم)", value: "Reem Kufi" },
        { label: "Lateef (لطيف)", value: "Lateef" }
      ]}
    ], [isAr]);

    const POSITION_GROUPS = useMemo(() => [
        { label: isAr ? "أوضاع أساسية" : "Basic Positions", options: [
            { label: isAr ? "أعلى (Top)" : "Top", value: "Top" },
            { label: isAr ? "وسط (Center)" : "Center", value: "Center" },
            { label: isAr ? "أسفل (Bottom)" : "Bottom", value: "Bottom" }
        ]},
        { label: isAr ? "بعيداً عن المنتج (للتفريغ)" : "Away from Subject (Negative Space)", options: [
            { label: isAr ? "بعيد يمين (Away Right)" : "Away Right", value: "AwayRight" },
            { label: isAr ? "بعيد يسار (Away Left)" : "Away Left", value: "AwayLeft" },
            { label: isAr ? "بعيد أعلى (Away Top)" : "Away Top", value: "AwayTop" },
            { label: isAr ? "بعيد أسفل (Away Bottom)" : "Away Bottom", value: "AwayBottom" }
        ]},
        { label: isAr ? "علاقات" : "Relationships", options: [
            { label: isAr ? "أسفل العنوان الرئيسي مباشرة" : "Directly Below Headline", value: "BelowHeadline" }
        ]},
        { label: isAr ? "زوايا" : "Corners", options: [
            { label: isAr ? "أعلى يمين" : "Top Right", value: "TopRight" },
            { label: isAr ? "أعلى يسار" : "Top Left", value: "TopLeft" },
            { label: isAr ? "أسفل يمين" : "Bottom Right", value: "BottomRight" },
            { label: isAr ? "أسفل يسار" : "Bottom Left", value: "BottomLeft" }
        ]},
        { label: isAr ? "جوانب" : "Sides", options: [
            { label: isAr ? "جانب أيمن" : "Right Side", value: "SideRight" },
            { label: isAr ? "جانب أيسر" : "Left Side", value: "SideLeft" }
        ]}
    ], [isAr]);

    const BG_MODE_GROUPS = useMemo(() => [
        { label: isAr ? "أنماط الخلفية" : "Background Styles", options: [
            { label: isAr ? "بدون خلفية (Shadow Only)" : "No Background (Shadow Only)", value: "Shadow" },
            { label: isAr ? "نظيف (Clean - No Shadow)" : "Clean (No Shadow)", value: "Clean" },
            { label: isAr ? "تدرج سينمائي (Fade)" : "Cinematic Fade", value: "Gradient" },
            { label: isAr ? "حد أدنى (Line Decor)" : "Minimal Line", value: "Line" },
            { label: isAr ? "بطاقة عصرية (Card)" : "Modern Card", value: "Box" }
        ]}
    ], [isAr]);

    // Prepare styles based on language
    const styleGroups = useMemo(() => GRAPHIC_DESIGN_STYLES.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({
            label: isAr ? o.label.ar : o.label.en,
            value: o.value
        }))
    })), [isAr]);

    // Prepare sizes based on language
    const sizeGroups = useMemo(() => GRAPHIC_DESIGN_SIZES.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({
            label: isAr ? o.label.ar : o.label.en,
            value: o.value
        }))
    })), [isAr]);

    // Updated Mockup Types Group using the comprehensive list
    const mockupTypeGroups = useMemo(() => MOCKUP_TYPES_GROUPED.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({
            label: isAr ? o.label.ar : o.label.en,
            value: o.value
        }))
    })), [isAr]);

    // Updated Language Group using the global LANGUAGES_GROUPED
    const langGroups = useMemo(() => LANGUAGES_GROUPED.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({ 
            label: isAr ? o.label.ar : o.label.en, 
            value: o.value 
        }))
    })), [isAr]);

    // --- CHECK FOR TEMPLATE DRAFT ON MOUNT ---
    useEffect(() => {
        const activeTemplate = getItem<any>('activeTemplate');
        if (activeTemplate) {
            setMode('Poster');
            setPosterTopic(activeTemplate.prompt || "");
            removeItem('activeTemplate');
        } else {
            const draft = getItem<ArchivedItem>('editDraft');
            if (draft && draft.type === 'GraphicDesign') {
                setGeneratedImage(draft.content);
                setRawGeneratedImage(draft.content);
                removeItem('editDraft');
            }
        }
    }, []);

    const handleMockupUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            setMockupImage(`data:${file.type};base64,${base64}`);
        };
        reader.readAsDataURL(file);
    };

    const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (referenceImages.length >= 10) return alert(isAr ? "الحد الأقصى 10 صور" : "Max 10 images");
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            setReferenceImages([...referenceImages, { id: Date.now().toString(), data: base64, mimeType: file.type }]);
            if (referenceFileRef.current) referenceFileRef.current.value = '';
        };
        reader.readAsDataURL(file);
    };

    const removeReferenceImage = (id: string) => {
        setReferenceImages(referenceImages.filter(img => img.id !== id));
    };

    // --- GRADIENT HANDLERS ---
    const updateGradientStop = (index: number, color: string) => {
        const newColors = [...gradientColors];
        newColors[index] = color;
        setGradientColors(newColors);
    };

    const randomizeGradient = () => {
        const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        const count = gradientType === '2' ? 2 : 3;
        const newColors = Array(count).fill(0).map(() => randomColor());
        setGradientColors(newColors);
    };

    const toggleGradientType = (type: '2' | '3') => {
        setGradientType(type);
        if (type === '3' && gradientColors.length < 3) {
            setGradientColors([...gradientColors, '#ffffff']);
        } else if (type === '2' && gradientColors.length > 2) {
            setGradientColors(gradientColors.slice(0, 2));
        }
    };

    const getApiRatio = (sizeValue: string): string => {
        // Updated mapping for comprehensive sizes
        switch (sizeValue) {
            case '1:1': return '1:1';
            case '4:5': return '3:4'; 
            case '9:16': return '9:16';
            case '16:9': return '16:9';
            case '1.91:1': return '16:9';
            case '3:1': return '16:9'; // Approximation for Twitter Header
            case '4:1': return '16:9'; // Approximation for LinkedIn Cover
            case '2:3': return '3:4'; // Approximation for Pinterest
            case 'A4_V': case 'A5_V': return '3:4';
            case 'A4_H': case 'Poster_50x70': case 'A3_V': return '4:3';
            case 'BizCard': return '16:9'; // Approximate 3.5:2
            case 'Leaderboard': return '16:9'; // Extreme crop, approx
            case 'MPU': return '1:1'; // Approx 300x250
            case 'Skyscraper': return '9:16'; // Extreme crop
            case '3:2': return '4:3'; 
            case '4:3': return '4:3';
            default: return '1:1';
        }
    };

    const drawTextLayer = (
        ctx: CanvasRenderingContext2D, 
        text: string, 
        font: string, 
        size: number, 
        pos: TextPosition,
        bgMode: TextBgMode,
        textAlign: TextAlign, 
        canvasWidth: number, 
        canvasHeight: number, 
        scaleFactor: number, 
        offset: {x: number, y: number},
        referenceY?: number 
    ): { bottomY: number } => {
        if (!text.trim()) return { bottomY: 0 };

        const finalFontSize = size * scaleFactor;
        ctx.font = `bold ${finalFontSize}px "${font}"`;
        ctx.direction = 'rtl';
        const effectiveAlign = textAlign === 'justify' ? 'right' : textAlign;

        let xPos = canvasWidth / 2;
        let yPos = canvasHeight / 2;
        let boxAnchorAlign: 'center' | 'right' | 'left' = 'center'; 
        const padding = 60 * scaleFactor;

        switch (pos) {
            case 'Top': yPos = padding + finalFontSize; boxAnchorAlign = 'center'; break;
            case 'Bottom': yPos = canvasHeight - padding - finalFontSize; boxAnchorAlign = 'center'; break;
            case 'TopRight': xPos = canvasWidth - padding; yPos = padding + finalFontSize; boxAnchorAlign = 'right'; break;
            case 'TopLeft': xPos = padding; yPos = padding + finalFontSize; boxAnchorAlign = 'left'; break;
            case 'BottomRight': xPos = canvasWidth - padding; yPos = canvasHeight - padding; boxAnchorAlign = 'right'; break;
            case 'BottomLeft': xPos = padding; yPos = canvasHeight - padding; boxAnchorAlign = 'left'; break;
            case 'SideRight': xPos = canvasWidth - padding; boxAnchorAlign = 'right'; break;
            case 'SideLeft': xPos = padding; boxAnchorAlign = 'left'; break;
            case 'BelowHeadline': yPos = (referenceY || padding) + finalFontSize + (20 * scaleFactor); boxAnchorAlign = 'center'; break;
            case 'AwayRight': xPos = canvasWidth - padding; yPos = canvasHeight / 2; boxAnchorAlign = 'right'; break;
            case 'AwayLeft': xPos = padding; yPos = canvasHeight / 2; boxAnchorAlign = 'left'; break;
            case 'AwayTop': xPos = canvasWidth / 2; yPos = padding + finalFontSize; boxAnchorAlign = 'center'; break;
            case 'AwayBottom': xPos = canvasWidth / 2; yPos = canvasHeight - padding; boxAnchorAlign = 'center'; break;
            case 'Center': default: boxAnchorAlign = 'center'; break;
        }

        xPos += offset.x * scaleFactor;
        yPos += offset.y * scaleFactor;

        const lines = text.split('\n');
        const lineHeight = finalFontSize * 1.5;
        
        let startY = yPos;
        if (pos === 'Center' || pos === 'SideRight' || pos === 'SideLeft' || pos === 'AwayRight' || pos === 'AwayLeft') {
            startY = yPos - ((lines.length - 1) * lineHeight) / 2;
        } else if (pos.includes('Bottom')) {
             startY = yPos - ((lines.length - 1) * lineHeight);
        }

        let maxLineWidth = 0;
        lines.forEach(line => {
            const m = ctx.measureText(line);
            if (m.width > maxLineWidth) maxLineWidth = m.width;
        });

        const boxPadding = 30 * scaleFactor;
        const boxHeight = (lines.length * lineHeight) + boxPadding;
        const boxWidth = maxLineWidth + (boxPadding * 2);
        
        let boxX = xPos;
        if (boxAnchorAlign === 'center') boxX = xPos - (boxWidth / 2);
        if (boxAnchorAlign === 'right') boxX = xPos - boxWidth + boxPadding;
        if (boxAnchorAlign === 'left') boxX = xPos - boxPadding;
        
        const bgY = startY - (lineHeight/1.5) - boxPadding;

        if (bgMode !== 'Clean' && bgMode !== 'Shadow') {
             if (bgMode === 'Gradient') {
                const gradHeight = boxHeight * 2.5;
                let gradY = bgY - (boxHeight / 2);
                let gradStartColor = "rgba(0,0,0,0)";
                let gradEndColor = "rgba(0,0,0,0.85)";
                let gx1 = 0, gy1 = 0, gx2 = 0, gy2 = 0;

                if (pos.includes('Bottom')) {
                    gy1 = canvasHeight - gradHeight; gy2 = canvasHeight; gradY = canvasHeight - gradHeight;
                } else if (pos.includes('Top')) {
                    gy1 = 0; gy2 = gradHeight; gradStartColor = "rgba(0,0,0,0.85)"; gradEndColor = "rgba(0,0,0,0)"; gradY = 0;
                } else {
                    gy1 = bgY; gy2 = bgY + boxHeight; gradStartColor = "rgba(0,0,0,0.6)"; gradEndColor = "rgba(0,0,0,0.6)";
                }

                const gradient = ctx.createLinearGradient(0, gy1, 0, gy2);
                gradient.addColorStop(0, gradStartColor);
                gradient.addColorStop(1, gradEndColor);
                
                ctx.save();
                ctx.fillStyle = gradient;
                ctx.fillRect(0, gy1, canvasWidth, gy2 - gy1);
                ctx.restore();

            } else if (bgMode === 'Box') {
                ctx.save();
                ctx.shadowColor = "rgba(0,0,0,0.4)";
                ctx.shadowBlur = 20 * scaleFactor;
                ctx.shadowOffsetY = 10 * scaleFactor;
                ctx.globalAlpha = 0.85; 
                const isDarkText = textColor === '#ffffff' || textColor === '#fff' ? false : true;
                ctx.fillStyle = isDarkText ? "#ffffff" : "#1a1a1a";
                
                ctx.beginPath();
                // @ts-ignore
                if (ctx.roundRect) ctx.roundRect(boxX, bgY, boxWidth, boxHeight, 15 * scaleFactor);
                else ctx.rect(boxX, bgY, boxWidth, boxHeight);
                ctx.fill();
                ctx.restore();

                // Accent Strip
                ctx.save();
                const stripWidth = 8 * scaleFactor;
                ctx.fillStyle = showLabelColor ? labelColor : "#bf8339";
                ctx.beginPath();
                if (boxAnchorAlign === 'left') {
                     // @ts-ignore
                     if (ctx.roundRect) ctx.roundRect(boxX, bgY, stripWidth, boxHeight, [15*scaleFactor, 0, 0, 15*scaleFactor]);
                     else ctx.fillRect(boxX, bgY, stripWidth, boxHeight);
                } else if (boxAnchorAlign === 'right') {
                     // @ts-ignore
                     if (ctx.roundRect) ctx.roundRect(boxX + boxWidth - stripWidth, bgY, stripWidth, boxHeight, [0, 15*scaleFactor, 15*scaleFactor, 0]);
                     else ctx.fillRect(boxX + boxWidth - stripWidth, bgY, stripWidth, boxHeight);
                } else {
                     // @ts-ignore
                     if (ctx.roundRect) ctx.roundRect(boxX, bgY, boxWidth, stripWidth, [15*scaleFactor, 15*scaleFactor, 0, 0]);
                     else ctx.fillRect(boxX, bgY, boxWidth, stripWidth);
                }
                ctx.fill();
                ctx.restore();

            } else if (bgMode === 'Line') {
                ctx.save();
                const stripWidth = 10 * scaleFactor;
                const gap = 15 * scaleFactor;
                ctx.fillStyle = showLabelColor ? labelColor : "#bf8339";
                
                let lineX = boxX; 
                if (boxAnchorAlign === 'left') lineX = boxX - stripWidth - gap;
                if (boxAnchorAlign === 'right') lineX = boxX + boxWidth + gap;
                
                if (boxAnchorAlign === 'center') {
                     ctx.fillRect(boxX + (boxWidth*0.2), bgY + boxHeight - 5, boxWidth * 0.6, 5 * scaleFactor);
                } else {
                     // @ts-ignore
                     if (ctx.roundRect) ctx.roundRect(lineX, bgY, stripWidth, boxHeight, 5*scaleFactor);
                     else ctx.fillRect(lineX, bgY, stripWidth, boxHeight);
                }
                ctx.restore();
            }
        }

        ctx.textAlign = effectiveAlign as CanvasTextAlign;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColor;
        
        if (bgMode === 'Shadow' || bgMode === 'Line' || bgMode === 'Gradient') {
            ctx.shadowColor = "rgba(0,0,0,0.8)";
            ctx.shadowBlur = 15 * scaleFactor;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 4 * scaleFactor;
        } else if (bgMode === 'Clean') {
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        } else {
            ctx.shadowColor = "rgba(0,0,0,0.2)";
            ctx.shadowBlur = 2;
        }
        
        lines.forEach((line, i) => {
            let textDrawX = 0;
            if (effectiveAlign === 'center') textDrawX = boxX + (boxWidth / 2);
            else if (effectiveAlign === 'right') textDrawX = boxX + boxWidth - boxPadding;
            else if (effectiveAlign === 'left') textDrawX = boxX + boxPadding;

            ctx.fillText(line, textDrawX, startY + (i * lineHeight));
            
            if (bgMode === 'Shadow') {
                ctx.strokeStyle = "rgba(0,0,0,0.3)";
                ctx.lineWidth = 1 * scaleFactor;
                ctx.strokeText(line, textDrawX, startY + (i * lineHeight));
            }
        });

        return { bottomY: bgY + boxHeight };
    };

    const applyTextOverlay = async (baseImageSrc: string) => {
        if (!baseImageSrc || posterLang !== 'Arabic') return baseImageSrc;

        return new Promise<string>((resolve) => {
            const img = new Image();
            img.src = baseImageSrc;
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) { resolve(baseImageSrc); return; }

                ctx.drawImage(img, 0, 0);
                const scaleFactor = img.width / 1080;

                const headlineResult = drawTextLayer(ctx, headlineText, headlineFont, headlineSize, headlinePos, headlineBg, headlineAlign, canvas.width, canvas.height, scaleFactor, headlineOffset);
                drawTextLayer(ctx, subHeadText, subHeadFont, subHeadSize, subHeadPos, subHeadBg, subHeadAlign, canvas.width, canvas.height, scaleFactor, subHeadOffset, headlineResult.bottomY);
                drawTextLayer(ctx, bodyText, bodyFont, bodySize, bodyPos, bodyBg, bodyAlign, canvas.width, canvas.height, scaleFactor, bodyOffset);

                resolve(canvas.toDataURL('image/jpeg', 0.9));
            };
            img.onerror = () => resolve(baseImageSrc);
        });
    };

    const handleGeneratePoster = async () => {
        setIsLoading(true);
        setGeneratedImage(null);
        setRawGeneratedImage(null);
        try {
            let prompt = posterTopic;
            if (posterLang !== 'Arabic' && aiDesignText) {
                prompt += `. Include the following text in the design: "${aiDesignText}". Use professional typography, modern fonts, clean layout.`;
            }
            if (posterLang === 'Arabic') {
                 prompt += `. Context of Arabic Text to be added later: Headline is about "${headlineText}", Subtitle is "${subHeadText}". GENERATE RELEVANT 3D ICONS and GRAPHICAL ELEMENTS matching this context in the background (e.g. if about coffee, add coffee beans/cup icons).`;
            }

            if (showBgColor) prompt += `, solid background color ${bgColor}`;
            if (showGradient) prompt += `, smooth gradient background moving from ${gradientColors.join(' to ')}`;
            
            const enhancedPrompt = await geminiService.enhanceGraphicDesignPrompt(
                prompt,
                posterStyle,
                paletteColors,
                posterLang === 'Arabic',
                'Poster'
            );

            const apiRatio = getApiRatio(posterSize);
            const refs = referenceImages.map(img => ({ data: img.data, mimeType: img.mimeType }));
            const base64 = await geminiService.generateImage(enhancedPrompt, 'gemini-2.5-flash-image', apiRatio, posterStyle, refs.length > 0 ? refs : undefined);
            const rawImage = `data:image/jpeg;base64,${base64}`;
            setRawGeneratedImage(rawImage);

            const finalImage = await applyTextOverlay(rawImage);
            setGeneratedImage(finalImage);

            const archive = getItem(ARCHIVE_STORAGE_KEY, []);
            archive.unshift({ 
                id: Date.now().toString(), 
                type: 'GraphicDesign', 
                content: finalImage, 
                timestamp: new Date().toISOString() 
            });
            setItem(ARCHIVE_STORAGE_KEY, archive);

        } catch (e: any) {
            alert(e.message || "Generation Failed");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (rawGeneratedImage && posterLang === 'Arabic') {
            const timeout = setTimeout(async () => {
                const updated = await applyTextOverlay(rawGeneratedImage);
                setGeneratedImage(updated);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [headlineText, headlineFont, headlineSize, headlinePos, headlineBg, headlineOffset, headlineAlign, subHeadText, subHeadFont, subHeadSize, subHeadPos, subHeadBg, subHeadOffset, subHeadAlign, bodyText, bodyFont, bodySize, bodyPos, bodyBg, bodyOffset, bodyAlign, textColor, labelColor, showLabelColor, rawGeneratedImage, posterLang]);


    const handleGenerateMockup = async () => {
        setIsLoading(true);
        try {
            let prompt = `Professional Product Mockup: ${mockupPrompt}, Type: ${mockupType}`;
            const enhanced = await geminiService.enhanceGraphicDesignPrompt(
                prompt,
                "Hyper-Realistic Product",
                paletteColors,
                posterLang === 'Arabic',
                'Mockup'
            );
            const refs = referenceImages.map(img => ({ data: img.data, mimeType: img.mimeType }));
            if (mockupImage) {
                refs.unshift({ data: mockupImage.split(',')[1], mimeType: 'image/png' });
            }
            const base64 = await geminiService.generateImage(
                enhanced, 
                'gemini-2.5-flash-image', 
                '1:1', 
                'Hyper-Realistic Product', 
                refs.length > 0 ? refs : undefined
            );
            const rawImage = `data:image/jpeg;base64,${base64}`;
            setRawGeneratedImage(rawImage);
            const finalImage = await applyTextOverlay(rawImage);
            setGeneratedImage(finalImage);
        } catch (e: any) {
             alert(e.message || "Error");
        } finally {
            setIsLoading(false);
        }
    };


  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <div>
              <h2 className="text-3xl font-bold text-[#bf8339] flex items-center gap-2">
                 <PaintBrushIcon /> {isAr ? 'المصمم الجرافيكي الذكي' : 'AI Graphic Designer'}
              </h2>
              <p className="text-white/60 mt-1">{isAr ? 'صمم بوسترات وموك أب احترافي مع دعم فني مُتكامل' : 'Create professional posters and mockups with full Arabic support.'}</p>
          </div>
          <div className="flex bg-[#0a1e3c] p-1 rounded-lg">
              <button onClick={() => setMode('Poster')} className={`px-4 py-2 rounded-md transition ${mode === 'Poster' ? 'bg-[#bf8339] text-[#0a1e3c] hover:text-white' : 'text-white'}`}>{isAr ? 'تصميم بوستر' : 'Poster Design'}</button>
              <button onClick={() => setMode('Mockup')} className={`px-4 py-2 rounded-md transition ${mode === 'Mockup' ? 'bg-[#bf8339] text-[#0a1e3c] hover:text-white' : 'text-white'}`}>{isAr ? 'موك أب (Mockup)' : 'Mockup'}</button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex flex-col gap-6 h-[calc(100dvh-140px)]">
               {/* 1. Design Settings (Fixed at Top, Non-Scrollable) */}
               <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-4 shrink-0 shadow-lg z-10">
                   <h3 className="text-[#bf8339] font-bold mb-4 text-sm border-b border-white/10 pb-2">{isAr ? '1. إعدادات التصميم (أساسي)' : '1. Design Settings (Basic)'}</h3>
                   <div className="space-y-4">
                       <CustomGroupedSelect label={isAr ? "لغة التصميم" : "Design Language"} value={posterLang} onChange={setPosterLang} groups={langGroups} placeholder="Select Language" />
                       {mode === 'Poster' && (
                           <>
                            <CustomGroupedSelect label={isAr ? "مقاس التصميم" : "Size"} value={posterSize} onChange={setPosterSize} groups={sizeGroups} placeholder="Select Size" />
                            <CustomGroupedSelect label={isAr ? "الأسلوب الفني" : "Art Style"} value={posterStyle} onChange={setPosterStyle} groups={styleGroups} placeholder="Select Style" />
                           </>
                       )}
                       {mode === 'Mockup' && (
                           <>
                             <CustomGroupedSelect label={isAr ? "نوع الموك أب" : "Mockup Type"} value={mockupType} onChange={setMockupType} groups={mockupTypeGroups} placeholder="Select Type" />
                             <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-[#bf8339]" onClick={() => mockupFileRef.current?.click()}>
                                 {mockupImage ? (
                                     <img src={mockupImage} className="max-h-32 mx-auto rounded" />
                                 ) : (
                                     <span className="text-white/50 text-xs">{isAr ? 'ارفع تصميمك (اختياري)' : 'Upload Design (Optional)'}</span>
                                 )}
                                 <input type="file" ref={mockupFileRef} className="hidden" onChange={handleMockupUpload} />
                             </div>
                           </>
                       )}
                   </div>
               </div>

                {/* Remaining Sections (Scrollable) */}
                <div className="overflow-y-auto custom-scrollbar flex-1 space-y-6 pr-2">
                    {/* 2. References */}
                    <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                             <h3 className="text-[#bf8339] font-bold text-sm">{isAr ? '2. صور مرجعية (Style References)' : '2. Style References'}</h3>
                             <span className="text-[10px] text-white/50">{referenceImages.length}/10</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {referenceImages.map((ref) => (
                                <div key={ref.id} className="relative group aspect-square">
                                    <img src={`data:${ref.mimeType};base64,${ref.data}`} className="w-full h-full object-cover rounded border border-white/10" />
                                    <button 
                                        onClick={() => removeReferenceImage(ref.id)} 
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-md z-10"
                                        title={isAr ? "حذف" : "Remove"}
                                    >
                                        <TrashIcon className="w-3 h-3 text-white" />
                                    </button>
                                </div>
                            ))}
                            {referenceImages.length < 10 && (
                                <div onClick={() => referenceFileRef.current?.click()} className="aspect-square border-2 border-dashed border-white/20 rounded flex items-center justify-center cursor-pointer hover:bg-white/5 hover:border-[#bf8339] text-xl text-white/30 hover:text-[#bf8339] transition">
                                    +
                                </div>
                            )}
                        </div>
                        <input type="file" ref={referenceFileRef} onChange={handleReferenceUpload} className="hidden" accept="image/*" />
                    </div>

                   {/* 3. Brand Colors */}
                   <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-4">
                       <h3 className="text-[#bf8339] font-bold mb-4 text-sm border-b border-white/10 pb-2">{isAr ? '3. ألوان الهوية' : '3. Brand Colors'}</h3>
                       <AdvancedColorPicker 
                           label={isAr ? "لوحة الألوان الأساسية" : "Primary Palette"} 
                           onColorChange={setPaletteColors} 
                           defaultColors={paletteColors} 
                           isAr={isAr}
                       />
                   </div>

                   {/* 4. Background & Gradients */}
                   <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-4">
                       <h3 className="text-[#bf8339] font-bold mb-4 text-sm border-b border-white/10 pb-2">{isAr ? '4. الخلفية والتدرجات (Background)' : '4. Background & Gradients'}</h3>
                       
                       <div className="space-y-4">
                           {/* Solid Color */}
                           <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                               <label className="text-xs flex items-center gap-2 cursor-pointer">
                                   <input type="checkbox" checked={showBgColor} onChange={e => { setShowBgColor(e.target.checked); if(e.target.checked) setShowGradient(false); }} className="accent-[#bf8339]"/> 
                                   {isAr ? 'لون خلفية موحد' : 'Solid Background'}
                               </label>
                               {showBgColor && <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent" />}
                           </div>

                           {/* Gradient Section */}
                           <div className={`p-3 rounded-lg border transition-all ${showGradient ? 'bg-white/5 border-[#bf8339]/50' : 'bg-transparent border-white/5'}`}>
                               <label className="text-xs flex items-center gap-2 cursor-pointer mb-2">
                                   <input type="checkbox" checked={showGradient} onChange={e => { setShowGradient(e.target.checked); if(e.target.checked) setShowBgColor(false); }} className="accent-[#bf8339]"/> 
                                   <span className={showGradient ? 'text-[#bf8339] font-bold' : ''}>{isAr ? 'تدرج لوني (Gradient)' : 'Gradient Background'}</span>
                               </label>

                               {showGradient && (
                                   <div className="animate-fade-in space-y-3 pl-4 border-l-2 border-[#bf8339]/20 mt-2">
                                       
                                       {/* Gradient Presets List */}
                                       <div className="mb-3">
                                           <p className="text-[10px] text-white/50 mb-1.5">{isAr ? 'قوالب جاهزة' : 'Presets'}</p>
                                           <div className="grid grid-cols-5 gap-1.5">
                                               {PRESET_GRADIENTS.map((g, i) => (
                                                   <button 
                                                       key={i}
                                                       onClick={() => {
                                                           setGradientType(g.colors.length === 3 ? '3' : '2');
                                                           setGradientColors(g.colors);
                                                       }}
                                                       className="h-6 rounded border border-white/10 hover:scale-110 transition-transform shadow-sm relative group"
                                                       style={{ background: `linear-gradient(to right, ${g.colors.join(', ')})` }}
                                                       title={g.name}
                                                   >
                                                   </button>
                                               ))}
                                           </div>
                                       </div>

                                       {/* Gradient Type */}
                                       <div className="flex gap-2 text-[10px]">
                                           <button onClick={() => toggleGradientType('2')} className={`flex-1 py-1 rounded border ${gradientType === '2' ? 'bg-[#bf8339] text-[#0a1e3c] border-[#bf8339]' : 'text-white/60 border-white/20'}`}>{isAr ? 'لونين' : '2 Colors'}</button>
                                           <button onClick={() => toggleGradientType('3')} className={`flex-1 py-1 rounded border ${gradientType === '3' ? 'bg-[#bf8339] text-[#0a1e3c] border-[#bf8339]' : 'text-white/60 border-white/20'}`}>{isAr ? '3 ألوان' : '3 Colors'}</button>
                                       </div>

                                       {/* Color Stops */}
                                       <div className="flex gap-2 justify-between">
                                           {gradientColors.map((col, idx) => (
                                               <div key={idx} className="flex flex-col items-center gap-1">
                                                   <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-sm hover:border-[#bf8339] transition-colors">
                                                       <input 
                                                           type="color" 
                                                           value={col} 
                                                           onChange={e => updateGradientStop(idx, e.target.value)} 
                                                           className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 cursor-pointer" 
                                                       />
                                                   </div>
                                               </div>
                                           ))}
                                       </div>

                                       {/* Preview & Randomize */}
                                       <div className="space-y-2">
                                           <div 
                                               className="h-6 w-full rounded-md border border-white/10 shadow-inner" 
                                               style={{ background: `linear-gradient(to right, ${gradientColors.join(', ')})` }}
                                               title="Gradient Preview"
                                           ></div>
                                           <button onClick={randomizeGradient} className="text-[10px] w-full py-1 bg-white/5 hover:bg-white/10 text-white/70 rounded flex items-center justify-center gap-1">
                                               <ArrowsRightLeftIcon className="w-3 h-3" /> {isAr ? 'عشوائي' : 'Randomize'}
                                           </button>
                                       </div>
                                   </div>
                               )}
                           </div>
                       </div>
                   </div>

                   {/* 5. Element Colors */}
                   <div className="bg-[#0a1e3c]/60 backdrop-blur border border-white/10 rounded-xl p-4">
                       <h3 className="text-[#bf8339] font-bold mb-4 text-sm border-b border-white/10 pb-2">{isAr ? '5. ألوان العناصر' : '5. Element Colors'}</h3>
                       <div className="space-y-3">
                           <div className="flex justify-between items-center">
                               <label className="text-xs flex items-center gap-2"><input type="checkbox" checked={showTextColor} onChange={e => setShowTextColor(e.target.checked)} className="accent-[#bf8339]"/> {isAr ? 'لون النصوص' : 'Text Color'}</label>
                               {showTextColor && <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} />}
                           </div>
                           <div className="flex justify-between items-center">
                               <label className="text-xs flex items-center gap-2"><input type="checkbox" checked={showIconColor} onChange={e => setShowIconColor(e.target.checked)} className="accent-[#bf8339]"/> {isAr ? 'لون الأيقونات' : 'Icon Color'}</label>
                               {showIconColor && <input type="color" value={iconColor} onChange={e => setIconColor(e.target.value)} />}
                           </div>
                           <div className="flex justify-between items-center">
                               <label className="text-xs flex items-center gap-2"><input type="checkbox" checked={showLabelColor} onChange={e => setShowLabelColor(e.target.checked)} className="accent-[#bf8339]"/> {isAr ? 'لون الليبلز' : 'Label Color'}</label>
                               {showLabelColor && <input type="color" value={labelColor} onChange={e => setLabelColor(e.target.value)} />}
                           </div>
                       </div>
                   </div>
                </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <label className="block text-sm text-white/80 mb-2">{mode === 'Poster' ? (isAr ? 'موضوع التصميم' : 'Design Topic') : (isAr ? 'وصف الموك أب' : 'Mockup Description')}</label>
                  <textarea 
                    className="w-full bg-black/20 border border-white/20 rounded-lg p-3 h-20 text-white dir-auto" 
                    placeholder={isAr ? "مثال: إعلان قهوة صباحية مع بخار وإضاءة دافئة..." : "e.g. Morning coffee ad with steam..."}
                    value={mode === 'Poster' ? posterTopic : mockupPrompt}
                    onChange={e => mode === 'Poster' ? setPosterTopic(e.target.value) : setMockupPrompt(e.target.value)}
                  />
              </div>

              {posterLang === 'Arabic' ? (
                  <div className="bg-[#0a1e3c]/80 border border-[#bf8339]/30 rounded-xl overflow-hidden shadow-lg">
                      <div className="bg-black/20 p-3 flex gap-2 overflow-x-auto">
                          {(['Headline', 'Subhead', 'Body'] as ActiveLayer[]).map(layer => (
                              <button 
                                key={layer}
                                onClick={() => setActiveLayer(layer)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap ${
                                    activeLayer === layer 
                                    ? 'bg-[#bf8339] text-[#0a1e3c] hover:text-white' 
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                              >
                                {layer === 'Headline' ? (isAr ? 'العنوان الرئيسي' : 'Headline') : layer === 'Subhead' ? (isAr ? 'العنوان الفرعي' : 'Subhead') : (isAr ? 'المحتوى/المتن' : 'Body Copy')}
                              </button>
                          ))}
                      </div>

                      <div className="p-4 bg-white/5">
                           {activeLayer === 'Headline' && (
                               <div className="space-y-4 animate-fade-in">
                                   <div>
                                       <label className="text-xs text-white/60 mb-1 block">{isAr ? 'النص' : 'Text'}</label>
                                       <input type="text" dir="rtl" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={headlineText} onChange={e => setHeadlineText(e.target.value)} placeholder={isAr ? "اكتب العنوان الرئيسي..." : "Type Headline..."} />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs text-white/60 mb-1 block">{isAr ? 'الخط' : 'Font'}</label><CustomGroupedSelect label="" value={headlineFont} onChange={setHeadlineFont} groups={FONT_GROUPS} placeholder="Select Font" /></div>
                                        <div><label className="text-xs text-white/60 mb-1 block">{isAr ? 'المكان' : 'Position'}</label><CustomGroupedSelect label="" value={headlinePos} onChange={(v) => setHeadlinePos(v as TextPosition)} groups={POSITION_GROUPS} placeholder="Select Position" /></div>
                                   </div>
                                   
                                   <div className="grid grid-cols-2 gap-4">
                                       <div><label className="text-xs text-white/60 mb-1 block">{isAr ? 'الحجم' : 'Size'}</label><input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={headlineSize} onChange={e => setHeadlineSize(Number(e.target.value))} /></div>
                                       <div>
                                            <label className="text-xs text-[#bf8339] mb-1 block font-bold">{isAr ? 'نمط الخلفية' : 'Background Style'}</label>
                                            <CustomGroupedSelect label="" value={headlineBg} onChange={(v) => setHeadlineBg(v as TextBgMode)} groups={BG_MODE_GROUPS} placeholder="Select Style" />
                                       </div>
                                   </div>
                                   
                                   {/* ALIGNMENT AND OFFSET */}
                                   <div className="grid grid-cols-2 gap-4 items-end">
                                        <div>
                                            <label className="text-xs text-white/60 mb-1 block">{isAr ? 'اتجاه النص' : 'Alignment'}</label>
                                            <TextAlignSelector value={headlineAlign} onChange={setHeadlineAlign} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-white/60 mb-1 block">{isAr ? 'تحريك يدوي (Offset X/Y)' : 'Manual Offset (X/Y)'}</label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 flex items-center gap-1">
                                                    <span className="text-[10px] text-white/40">X</span>
                                                    <input type="range" min="-300" max="300" value={headlineOffset.x} onChange={e => setHeadlineOffset({...headlineOffset, x: Number(e.target.value)})} className="w-full accent-[#bf8339]" />
                                                </div>
                                                <div className="flex-1 flex items-center gap-1">
                                                    <span className="text-[10px] text-white/40">Y</span>
                                                    <input type="range" min="-300" max="300" value={headlineOffset.y} onChange={e => setHeadlineOffset({...headlineOffset, y: Number(e.target.value)})} className="w-full accent-[#bf8339]" />
                                                </div>
                                            </div>
                                        </div>
                                   </div>
                               </div>
                           )}

                           {activeLayer === 'Subhead' && (
                               <div className="space-y-4 animate-fade-in">
                                   <div>
                                       <label className="text-xs text-white/60 mb-1 block">{isAr ? 'النص الفرعي' : 'Subhead Text'}</label>
                                       <input type="text" dir="rtl" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={subHeadText} onChange={e => setSubHeadText(e.target.value)} placeholder={isAr ? "اكتب العنوان الفرعي..." : "Type Subhead..."} />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs text-white/60 mb-1 block">{isAr ? 'الخط' : 'Font'}</label><CustomGroupedSelect label="" value={subHeadFont} onChange={setSubHeadFont} groups={FONT_GROUPS} placeholder="Select Font" /></div>
                                        <div><label className="text-xs text-white/60 mb-1 block">{isAr ? 'المكان' : 'Position'}</label><CustomGroupedSelect label="" value={subHeadPos} onChange={(v) => setSubHeadPos(v as TextPosition)} groups={POSITION_GROUPS} placeholder="Select Position" /></div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                       <div><label className="text-xs text-white/60 mb-1 block">{isAr ? 'الحجم' : 'Size'}</label><input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={subHeadSize} onChange={e => setSubHeadSize(Number(e.target.value))} /></div>
                                       <div>
                                            <label className="text-xs text-[#bf8339] mb-1 block font-bold">{isAr ? 'نمط الخلفية' : 'Background Style'}</label>
                                            <CustomGroupedSelect label="" value={subHeadBg} onChange={(v) => setSubHeadBg(v as TextBgMode)} groups={BG_MODE_GROUPS} placeholder="Select Style" />
                                       </div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4 items-end">
                                        <div>
                                            <label className="text-xs text-white/60 mb-1 block">{isAr ? 'اتجاه النص' : 'Alignment'}</label>
                                            <TextAlignSelector value={subHeadAlign} onChange={setSubHeadAlign} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-white/60 mb-1 block">{isAr ? 'تحريك يدوي (Offset X/Y)' : 'Manual Offset (X/Y)'}</label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 flex items-center gap-1">
                                                    <span className="text-[10px] text-white/40">X</span>
                                                    <input type="range" min="-300" max="300" value={subHeadOffset.x} onChange={e => setSubHeadOffset({...subHeadOffset, x: Number(e.target.value)})} className="w-full accent-[#bf8339]" />
                                                </div>
                                                <div className="flex-1 flex items-center gap-1">
                                                    <span className="text-[10px] text-white/40">Y</span>
                                                    <input type="range" min="-300" max="300" value={subHeadOffset.y} onChange={e => setSubHeadOffset({...subHeadOffset, y: Number(e.target.value)})} className="w-full accent-[#bf8339]" />
                                                </div>
                                            </div>
                                        </div>
                                   </div>
                               </div>
                           )}

                           {activeLayer === 'Body' && (
                               <div className="space-y-4 animate-fade-in">
                                   <div>
                                       <label className="text-xs text-white/60 mb-1 block">{isAr ? 'المتن / المحتوى' : 'Body Content'}</label>
                                       <textarea dir="rtl" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white h-20" value={bodyText} onChange={e => setBodyText(e.target.value)} placeholder={isAr ? "اكتب تفاصيل المحتوى..." : "Type body text..."} />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs text-white/60 mb-1 block">{isAr ? 'الخط' : 'Font'}</label><CustomGroupedSelect label="" value={bodyFont} onChange={setBodyFont} groups={FONT_GROUPS} placeholder="Select Font" /></div>
                                        <div><label className="text-xs text-white/60 mb-1 block">{isAr ? 'المكان' : 'Position'}</label><CustomGroupedSelect label="" value={bodyPos} onChange={(v) => setBodyPos(v as TextPosition)} groups={POSITION_GROUPS} placeholder="Select Position" /></div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                       <div><label className="text-xs text-white/60 mb-1 block">{isAr ? 'الحجم' : 'Size'}</label><input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={bodySize} onChange={e => setBodySize(Number(e.target.value))} /></div>
                                       <div>
                                            <label className="text-xs text-[#bf8339] mb-1 block font-bold">{isAr ? 'نمط الخلفية' : 'Background Style'}</label>
                                            <CustomGroupedSelect label="" value={bodyBg} onChange={(v) => setBodyBg(v as TextBgMode)} groups={BG_MODE_GROUPS} placeholder="Select Style" />
                                       </div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4 items-end">
                                        <div>
                                            <label className="text-xs text-white/60 mb-1 block">{isAr ? 'اتجاه النص' : 'Alignment'}</label>
                                            <TextAlignSelector value={bodyAlign} onChange={setBodyAlign} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-white/60 mb-1 block">{isAr ? 'تحريك يدوي (Offset X/Y)' : 'Manual Offset (X/Y)'}</label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 flex items-center gap-1">
                                                    <span className="text-[10px] text-white/40">X</span>
                                                    <input type="range" min="-300" max="300" value={bodyOffset.x} onChange={e => setBodyOffset({...bodyOffset, x: Number(e.target.value)})} className="w-full accent-[#bf8339]" />
                                                </div>
                                                <div className="flex-1 flex items-center gap-1">
                                                    <span className="text-[10px] text-white/40">Y</span>
                                                    <input type="range" min="-300" max="300" value={bodyOffset.y} onChange={e => setBodyOffset({...bodyOffset, y: Number(e.target.value)})} className="w-full accent-[#bf8339]" />
                                                </div>
                                            </div>
                                        </div>
                                   </div>
                               </div>
                           )}
                      </div>
                  </div>
              ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <label className="block text-sm text-[#bf8339] font-bold mb-2">{isAr ? 'المحتوى النصي للتصميم (AI Text Integration)' : 'AI Text Integration (English Only)'}</label>
                      <input 
                        type="text" 
                        className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white"
                        placeholder="Type text to be integrated into the image by AI..."
                        value={aiDesignText}
                        onChange={e => setAiDesignText(e.target.value)}
                      />
                      <p className="text-[10px] text-white/50 mt-1">{isAr ? 'سيقوم الذكاء الاصطناعي بمحاولة دمج هذا النص داخل الصورة.' : 'AI will attempt to render this text inside the image.'}</p>
                  </div>
              )}

              <Button 
                onClick={mode === 'Poster' ? handleGeneratePoster : handleGenerateMockup} 
                isLoading={isLoading} 
                className="w-full py-4 text-lg font-bold shadow-xl shadow-[#bf8339]/20"
              >
                  {mode === 'Poster' ? (isAr ? 'توليد البوستر الاحترافي' : 'Generate Poster') : (isAr ? 'إنشاء الموك أب' : 'Generate Mockup')}
              </Button>

              {generatedImage && (
                  <div className="bg-black/40 rounded-xl border border-[#bf8339]/30 p-6 text-center animate-fade-in relative">
                      <img src={generatedImage} className="max-h-[600px] mx-auto rounded-lg shadow-2xl" />
                      <div className="mt-6 flex justify-center gap-4">
                          <ExportMenu content={generatedImage} type="image" filename={`postly-${mode.toLowerCase()}-${Date.now()}`} label={isAr ? "تحميل" : "Download"} />
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default GraphicDesignerView;
