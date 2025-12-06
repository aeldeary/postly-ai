
import React, { useContext, useState, useMemo } from 'react';
import { ProjectContext } from '../../contexts/ProjectContext';
import { Tab } from '../../types';
import { TemplateIcon, MagicWandIcon, LightBulbIcon, Loader, SparklesIcon } from '../Icons';
import { TEMPLATES_DB, INDUSTRIES_GROUPED } from '../../constants';
import { setItem } from '../../utils/localStorage';
import * as geminiService from '../../services/geminiService';
import CustomGroupedSelect from '../CustomGroupedSelect';

interface AdvancedTemplatesViewProps {
    setActiveTab: (tab: Tab) => void;
}

const AdvancedTemplatesView: React.FC<AdvancedTemplatesViewProps> = ({ setActiveTab }) => {
    const { appLanguage, industry, updateProjectState } = useContext(ProjectContext);
    const isAr = appLanguage === 'ar';

    const [selectedIndustry, setSelectedIndustry] = useState(industry || '');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Dynamic Template State
    const [regeneratingMap, setRegeneratingMap] = useState<Record<string, boolean>>({});
    const [dynamicOverrides, setDynamicOverrides] = useState<Record<string, {prompt: string, icon?: string}>>({});

    // Fallback Icons Map to ensure every field has a symbol
    const CATEGORY_ICONS: Record<string, string> = {
        'Business & Retail': '🏢',
        'Food & Beverage': '🍽️',
        'Medical & Healthcare': '🏥',
        'Education & Training': '🎓',
        'Real Estate': '🏘️',
        'Charity & NGOs': '❤️',
        'Services': '🧾',
        'Beauty & Wellness': '💅',
        'Hospitality & Tourism': '🏖️',
        'Tech & Digital': '💻',
        'Media & Entertainment': '🎬',
        'Automotive': '🚗',
        'Handmade Business': '🧵',
        'Crafts & Trades': '🔧'
    };

    const SPECIFIC_ICONS: Record<string, string> = {
        // Business & Retail
        'E-Commerce Store': '🛒', 'General Trading Company': '🤝', 'Supermarket': '🥬', 'Clothing Store': '👗', 'Shoes & Bags Store': '👠',
        'Perfume & Incense Shop': '🧴', 'Gift Shop': '🎁', 'Accessories Store': '💍', 'Home Appliances Store': '📺', 'Furniture Store': '🛋️',
        'Jewelry Store': '💎', 'Car Showroom': '🚗', 'Auto Parts Company': '⚙️', 'Logistics Company': '🚚', 'International Shipping': '🚢',
        'Advertising & Printing Agency': '🖨️', 'Marketing Agency': '📈', 'Advertising Agency': '📢',

        // Food & Beverage
        'Restaurants': '🍽️', 'Coffee Shops': '☕', 'Bakeries & Sweets': '🥐', 'Juice Shops': '🥤', 'Chocolate Shops': '🍫',
        'Fast Food': '🍔', 'Healthy Restaurants': '🥗', 'Food Trucks': '🚚', 'Food Supply Companies': '📦',

        // Medical & Healthcare
        'Medical Clinics': '🩺', 'Hospitals': '🏥', 'Medical Laboratories': '🔬', 'Pharmacies': '💊', 'Medical Beauty Centers': '💉',
        'Physiotherapy Centers': '🧘‍♂️', 'Dental Centers': '🦷', 'Obesity & Slimming Centers': '⚖️', 'Rehabilitation Centers': '♿',
        'Radiology & Analysis Centers': '☢️', 'Nutritionists': '🍏',

        // Education & Training
        'Schools': '🏫', 'Universities': '🎓', 'Institutes': '🏛️', 'Training Centers': '👨‍🏫', 'Online Courses': '💻',
        'Kids Academies': '🧸', 'Language Centers': '🗣️', 'Kindergartens': '🎈', 'Life Coaches': '🧭', 'Career Training': '💼',
        'Tech & AI Training': '🤖',

        // Real Estate
        'Real Estate Developers': '🏗️', 'Real Estate Brokerage': '🤝', 'Contracting Companies': '👷', 'Interior Design Firms': '🛋️',
        'Engineering Consultancies': '📐', 'Decor & Construction': '🎨', 'Real Estate Consultancy': '🏘️',

        // Charity & NGOs
        'Charities': '🤝', 'Non-Profit Organizations': '🕊️', 'Seasonal Campaigns': '📢', 'Orphan Sponsorship': '👶',
        'Family Support': '👨‍👩‍👧‍👦', 'Relief Projects': '⛺', 'Donation Campaigns': '💰', 'Volunteer Groups': '🙋',
        'Water Well Projects': '💧', 'Education & Medical Aid': '🚑',

        // Services
        'Consulting': '💼', 'Legal Services': '⚖️', 'Travel Agencies': '✈️', 'Property Management': '🏢', 'Translation Services': '🅰️',
        'Accounting Firms': '🧮', 'Insurance Companies': '🛡️', 'Event Management': '🎉', 'Media Production': '🎥',
        'Tech & Programming': '💻', 'Freelance Content Creators': '📹', 'Photographers': '📷', 'Cleaning Services': '🧹',
        'Pest Control': '🐜', 'Security Services': '👮',

        // Beauty & Wellness
        'Beauty Salons': '💇‍♀️', 'Barbershops': '💈', 'Spa Centers': '🧖', 'Fitness Centers': '🏋️', 'Yoga Centers': '🧘',
        'Fitness Coaches': '⏱️', 'Skin & Hair Care Products': '🧴',

        // Hospitality & Tourism
        'Hotels': '🏨', 'Resorts': '🏝️', 'Hotel Apartments': '🏢', 'Tourism Companies': '🗺️', 'Cruise & Boat Trips': '🚢',
        'Sports Clubs': '⚽', 'Chalets & Rest Houses': '🏡',

        // Tech & Digital
        'Software Development': '👨‍💻', 'Development Agencies': '🚀', 'Mobile Apps': '📱', 'Cyber Security': '🔒', 'SaaS Companies': '☁️',
        'Online Service Platforms': '🌐', 'EdTech Platforms': '🎓', 'AI Companies': '🧠', 'Gaming Companies': '🎮',

        // Media & Entertainment
        'Content Creators': '🤳', 'Influencers': '✨', 'YouTube Channels': '▶️', 'Podcasts': '🎙️', 'Production Houses': '🎥',
        'Photography Studios': '📸', 'News Pages': '📰', 'Entertainment Pages': '🎭', 'Movies & Series Pages': '🍿',

        // Automotive
        'Car Dealerships': '🚘', 'Car Financing': '💵', 'Garages & Maintenance': '🔧', 'Car Detailing': '✨', 'Mobile Car Wash': '🚿',
        'Spare Parts & Accessories': '⚙️', 'Limousine Services': '🎩',

        // Handmade Business
        'Handmade Accessories': '📿', 'Handmade Candles': '🕯️', 'Natural Soap': '🧼', 'Embroidery': '🧵', 'Knitting & Crochet': '🧶',
        'Wood Carving': '🪵', 'Painting': '🎨', 'Wooden Boxes': '📦', 'Customized Gifts': '🎁', 'Pottery & Ceramics': '🏺',
        'Handmade Fabrics': '🧣', 'Resin Art': '💧', 'Macrame': '🧶', 'Handmade Bags': '👜', 'Handmade Decor': '🖼️', 'Recycling Crafts': '♻️',

        // Crafts & Trades
        'Carpentry': '🔨', 'Plumbing': '🚿', 'Electrical Services': '⚡', 'Blacksmithing': '⚒️', 'Painting & Decorating': '🖌️',
        'Gypsum & Decor': '🏛️', 'Tiling & Ceramics': '🧱', 'HVAC / AC Services': '❄️', 'Sanitary Installations': '🚽', 'Welding': '💥',
        'Mechanics': '🔧', 'Auto Body Repair': '🚗', 'Aluminum Works': '🪟', 'Home Maintenance': '🏠', 'Surveying & Building': '👷‍♂️',
        'Granite & Marble': '🏛️', 'Handyman': '🛠️', 'Mobile Repair': '📱', 'Computer Repair': '💻', 'T-Shirt Printing': '👕',
        'Laser Engraving': '🔦', 'Thermal Printing': '📠', 'CNC Machining': '⚙️', 'Trophies & Wooden Gifts': '🏆'
    };

    // Construct unified list of ALL possible templates from INDUSTRIES_GROUPED
    const allTemplates = useMemo(() => {
        const list: any[] = [];
        
        INDUSTRIES_GROUPED.forEach(group => {
            group.options.forEach(opt => {
                const value = typeof opt === 'string' ? opt : opt.value;
                const labelAr = typeof opt === 'string' ? opt : opt.label.ar;
                const labelEn = typeof opt === 'string' ? opt : opt.label.en;
                
                // 1. Try to find a static template in DB
                const existing = TEMPLATES_DB.find(t => 
                    (t.title.en === labelEn || t.title.ar === labelAr) || 
                    (t.tags && t.tags.includes(value))
                );
                
                // 2. Check for dynamic override (regenerated by user)
                const override = dynamicOverrides[value];

                // 3. Determine Icon (Override > DB > Specific Map > Category Fallback > Generic)
                const categoryIcon = CATEGORY_ICONS[group.label.en] || "✨";
                const specificIcon = SPECIFIC_ICONS[labelEn] || SPECIFIC_ICONS[value];
                const icon = override?.icon || (existing as any)?.icon || specificIcon || categoryIcon;

                list.push({
                    id: value, // Use value as ID for uniqueness
                    title: { ar: labelAr, en: labelEn },
                    category: group.label.en,
                    tags: [labelEn, labelAr, group.label.en],
                    // Priority: Override > Existing Static > Generic Fallback
                    prompt: override?.prompt || existing?.prompt || `High quality professional advertisement photography for ${labelEn}, cinematic lighting, photorealistic, 8k resolution, commercial style.`,
                    icon: icon,
                    isDynamic: !existing && !override // Flag if it's a raw fallback
                });
            });
        });
        
        return list;
    }, [dynamicOverrides]);

    // Filter Logic
    const filteredTemplates = useMemo(() => {
        let templates = allTemplates;

        // 1. Filter by Industry/Category
        if (selectedIndustry) {
            const parentGroup = INDUSTRIES_GROUPED.find(group => 
                group.options.some(opt => (typeof opt === 'string' ? opt : opt.value) === selectedIndustry) || 
                group.label.en === selectedIndustry ||
                group.label.ar === selectedIndustry
            );

            if (parentGroup) {
                // If filtering by a Category, show all its sub-items
                const cleanCategory = parentGroup.label.en.replace(/^[^\w\s]+/, '').trim(); 
                templates = templates.filter(t => 
                    t.category.toLowerCase().includes(cleanCategory.toLowerCase())
                );
            } else {
                // Exact value match
                templates = templates.filter(t => t.id === selectedIndustry);
            }
        }

        // 2. Filter by Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            templates = templates.filter(t => {
                const titleText = t.title[appLanguage] ? String(t.title[appLanguage]) : '';
                return titleText.toLowerCase().includes(query) ||
                t.tags.some((tag: string) => String(tag).toLowerCase().includes(query));
            });
        }

        return templates;
    }, [selectedIndustry, searchQuery, appLanguage, allTemplates]);

    const handleUseTemplate = (template: any) => {
        setItem('activeTemplate', template);
        setActiveTab(Tab.GraphicDesigner);
        if ((window as any).toast) {
            (window as any).toast(isAr ? 'تم تطبيق القالب بنجاح' : 'Template applied successfully', 'success');
        }
    };

    const handleRegenerate = async (e: React.MouseEvent, templateId: string, industryName: string) => {
        e.stopPropagation(); // Prevent card click
        setRegeneratingMap(prev => ({...prev, [templateId]: true}));
        
        try {
            const result = await geminiService.generateTemplatePrompt(industryName);
            setDynamicOverrides(prev => ({
                ...prev,
                [templateId]: result
            }));
            if ((window as any).toast) {
                (window as any).toast(isAr ? 'تم إعادة صياغة المحتوى بأسلوب جديد' : 'Content Restyled Successfully', 'success');
            }
        } catch(err) {
            console.error(err);
        } finally {
            setRegeneratingMap(prev => ({...prev, [templateId]: false}));
        }
    };

    // Prepare dropdown groups
    const categoryGroups = useMemo(() => INDUSTRIES_GROUPED.map(g => ({
        label: isAr ? g.label.ar : g.label.en,
        options: g.options.map(o => ({
            label: isAr ? o.label.ar : o.label.en,
            value: o.value
        }))
    })), [isAr]);

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* Minimal Hero */}
            <div className="bg-[#0a1e3c]/60 backdrop-blur-xl border border-white/10 rounded-xl p-6 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                 <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-[#bf8339] flex items-center gap-2">
                        <TemplateIcon className="w-6 h-6" />
                        {isAr ? 'مكتبة القوالب الشاملة' : 'Comprehensive Template Library'}
                    </h2>
                    <p className="text-white/60 text-sm mt-1">
                        {isAr ? 'قوالب جاهزة لكل المجالات الفرعية مع إمكانية التوليد الذكي وإعادة الصياغة.' : 'Ready-made templates for every niche with AI regeneration and rephrasing.'}
                    </p>
                 </div>
            </div>

            {/* Sticky Search & Filter Bar */}
            <div className="sticky top-0 z-30 bg-[#2e4f8a]/95 backdrop-blur-md border-y border-white/10 py-3 -mx-4 px-4 shadow-lg flex flex-col md:flex-row gap-3">
                 <div className="flex-1 relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input 
                        type="text" 
                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pr-10 pl-4 text-white placeholder-white/30 focus:border-[#bf8339] focus:ring-1 focus:ring-[#bf8339]/50 transition-all text-sm hover:bg-black/30"
                        placeholder={isAr ? "ابحث عن مجالك..." : "Search your industry..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
                 <div className="w-full md:w-72">
                     <CustomGroupedSelect 
                        label=""
                        value={selectedIndustry}
                        onChange={(val) => {
                            setSelectedIndustry(val);
                            updateProjectState({ industry: val });
                        }}
                        groups={categoryGroups}
                        placeholder={isAr ? "تصفية حسب القطاع" : "Filter by Sector"}
                    />
                 </div>
            </div>

            {/* Templates Grid */}
            {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                    {filteredTemplates.map((template) => (
                        <div 
                            key={template.id} 
                            onClick={() => handleUseTemplate(template)}
                            className="group bg-[#0a1e3c]/40 border border-white/10 rounded-2xl overflow-hidden hover:border-[#bf8339]/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer relative"
                        >
                            {/* Header: Badge & Remix Action Adjacent */}
                            <div className="flex items-center justify-between p-3 pb-0 z-20 gap-2">
                                <button
                                    onClick={(e) => handleRegenerate(e, template.id, template.title.en)}
                                    disabled={regeneratingMap[template.id]}
                                    className={`text-[10px] px-2 py-1 rounded-md transition-all flex items-center gap-1 border border-[#bf8339]/20 shadow-sm ${regeneratingMap[template.id] ? 'bg-[#bf8339]/20 text-[#bf8339] cursor-wait' : 'bg-[#bf8339]/10 text-[#bf8339] hover:bg-[#bf8339] hover:text-[#0a1e3c]'}`}
                                    title={isAr ? "إعادة صياغة بأسلوب آخر" : "Remix Style"}
                                >
                                    {regeneratingMap[template.id] ? (
                                       <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                       <SparklesIcon className="w-3 h-3" />
                                    )}
                                    <span>{isAr ? 'تغيير الأسلوب' : 'Remix'}</span>
                                </button>

                                <span className="text-[10px] bg-white/10 text-white/60 px-2 py-1 rounded-md uppercase tracking-wider backdrop-blur-sm border border-white/5 truncate max-w-[60%]">
                                    {template.category}
                                </span>
                            </div>

                            {/* Content Body */}
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl filter drop-shadow-lg">{template.icon}</span>
                                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-1 group-hover:text-[#bf8339] transition-colors">
                                        {template.title[appLanguage] as string}
                                    </h3>
                                </div>
                                
                                {/* Visible Prompt Text */}
                                <div className="bg-black/20 rounded-lg p-2.5 border border-white/5 flex-1 min-h-[80px] relative group/text hover:border-[#bf8339]/30 transition-colors">
                                    <p className={`text-[11px] text-white/70 leading-relaxed line-clamp-4 font-light ${regeneratingMap[template.id] ? 'opacity-50 blur-[1px]' : ''}`}>
                                        {template.prompt}
                                    </p>
                                    
                                    {/* Loading Overlay */}
                                    {regeneratingMap[template.id] && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="scale-50 transform"><Loader /></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="bg-white/5 p-3 border-t border-white/5 flex justify-between items-center group-hover:bg-[#bf8339] transition-colors duration-300">
                                <span className="text-xs text-white/50 group-hover:text-[#0a1e3c] font-medium transition-colors">
                                    {isAr ? 'اضغط للاستخدام' : 'Click to Use'}
                                </span>
                                <MagicWandIcon className="w-4 h-4 text-white/30 group-hover:text-[#0a1e3c] transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <LightBulbIcon className="w-10 h-10 text-white/20" />
                    </div>
                    <h3 className="text-xl font-bold text-white/60">{isAr ? 'لم يتم العثور على قوالب' : 'No templates found'}</h3>
                    <p className="text-white/40 mt-2 text-sm max-w-xs">
                        {isAr ? 'جرب تغيير مصطلحات البحث أو اختر قطاعاً مختلفاً.' : 'Try changing your search terms or select a different sector.'}
                    </p>
                    <button onClick={() => {setSearchQuery(''); setSelectedIndustry(''); updateProjectState({ industry: '' });}} className="mt-6 text-[#bf8339] text-sm hover:underline">
                        {isAr ? 'إظهار الكل' : 'Show All'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdvancedTemplatesView;
