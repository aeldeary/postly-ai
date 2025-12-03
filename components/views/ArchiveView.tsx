
import React, { useState, useEffect, useContext } from 'react';
import { ArchivedItem, Tab } from '../../types';
import { ProjectContext } from '../../contexts/ProjectContext';
import { getItem, setItem } from '../../utils/localStorage';
import { ARCHIVE_STORAGE_KEY } from '../../constants';
import CopyButton from '../CopyButton';
import { TrashIcon, ArrowsRightLeftIcon } from '../Icons';

interface ArchiveViewProps {
    setActiveTab?: (tab: Tab) => void;
}

const ArchiveCard: React.FC<{ item: ArchivedItem; onDelete: (id: string) => void; onRestore: (item: ArchivedItem) => void; isAr: boolean }> = ({ item, onDelete, onRestore, isAr }) => {
  const renderContent = () => {
    switch (item.type) {
      case 'Post':
        const postText = item.content[0]?.post;
        return (
          <div className="relative group">
            <div className="flex justify-between items-start">
                <p className="font-bold text-white/90">{isAr ? 'منشور' : 'Post'}</p>
                <CopyButton text={postText} label={isAr ? "نسخ" : "Copy"} />
            </div>
            <p className="text-sm text-white/70 mt-1 line-clamp-3">{postText}</p>
          </div>
        );
      case 'Reel':
        return (
          <div className="relative group">
             <div className="flex justify-between items-start">
                <p className="font-bold text-white/90">{isAr ? 'ريلز/تيك توك' : 'Reel/TikTok'}</p>
                <CopyButton text={`Title: ${item.content.title}\n${item.content.versions?.[0]?.scenes?.map((s:any) => s.audio).join('\n')}`} label={isAr ? "نسخ" : "Copy"} />
             </div>
             <p className="text-sm text-white/70 mt-1">{item.content.versions?.[0]?.title || item.content.title}</p>
          </div>
        );
      case 'Ad':
        const adText = item.content[0]?.primaryText;
        return (
          <div className="relative group">
             <div className="flex justify-between items-start">
                <p className="font-bold text-white/90">{isAr ? 'إعلان ممول' : 'Paid Ad'}</p>
                <CopyButton text={adText} label={isAr ? "نسخ" : "Copy"} />
             </div>
             <p className="text-sm text-white/70 mt-1">{item.content[0]?.headline}</p>
          </div>
        );
      case 'BrandKit':
         return (
             <div className="relative group">
                 <div className="flex justify-between items-start">
                    <p className="font-bold text-white/90">{isAr ? 'هوية براند' : 'Brand Identity'}</p>
                    <CopyButton text={`Brand: ${item.content.brandName}\nMission: ${item.content.mission}`} label={isAr ? "نسخ" : "Copy"} />
                 </div>
                 <p className="text-sm text-white/70 mt-1">{item.content.brandName}</p>
             </div>
         );
      case 'Website':
        return (
          <div className="relative group">
            <div className="flex justify-between items-start">
                <p className="font-bold text-white/90">{isAr ? 'محتوى موقع' : 'Web Content'}</p>
                <CopyButton text={item.content[0]?.pageContent} label={isAr ? "نسخ" : "Copy"} />
            </div>
            <p className="text-sm text-white/70 mt-1 line-clamp-3">{item.content[0]?.metaDescription}</p>
          </div>
        );
      case 'Image':
        return (
          <div className="flex items-center gap-4">
            <img src={item.content} alt="Archived AI" className="w-16 h-16 rounded-md object-cover" />
            <p className="font-bold text-white/90">{isAr ? 'صورة منشأة' : 'Generated Image'}</p>
          </div>
        );
      case 'GraphicDesign':
         return (
          <div className="flex items-center gap-4">
            <img src={item.content} alt="Graphic Design" className="w-16 h-16 rounded-md object-cover" />
            <p className="font-bold text-white/90">{isAr ? 'تصميم جرافيك' : 'Graphic Design'}</p>
          </div>
        );
      case 'Infographic':
         return (
          <div className="flex items-center gap-4">
            <img src={item.content} alt="Infographic" className="w-16 h-16 rounded-md object-cover" />
            <p className="font-bold text-white/90">{isAr ? 'انفوجرافيك' : 'Infographic'}</p>
          </div>
        );
      case 'Video':
         return (
          <div className="relative group">
             <div className="flex justify-between items-start">
                <p className="font-bold text-white/90">{isAr ? 'فيديو (Veo)' : 'Video (Veo)'}</p>
                <CopyButton text={item.content.prompt} label={isAr ? "نسخ الوصف" : "Copy Prompt"} />
             </div>
             <p className="text-sm text-white/70 mt-1 line-clamp-2">{item.content.prompt}</p>
          </div>
         );
      case 'Idea':
         return (
             <div className="relative group">
                 <div className="flex justify-between items-start">
                    <p className="font-bold text-white/90">{isAr ? 'فكرة إبداعية' : 'Creative Idea'}</p>
                    <CopyButton text={item.content[0]?.title} label={isAr ? "نسخ" : "Copy"} />
                 </div>
                 <p className="text-sm text-white/70 mt-1">{item.content[0]?.title}</p>
             </div>
         );
      case 'Summary':
         return (
             <div className="relative group">
                 <div className="flex justify-between items-start">
                    <p className="font-bold text-white/90">{isAr ? 'ملخص محتوى' : 'Content Summary'}</p>
                    <CopyButton text={item.content} label={isAr ? "نسخ" : "Copy"} />
                 </div>
                 <p className="text-sm text-white/70 mt-1 line-clamp-2">{item.content}</p>
             </div>
         );
      default:
        return <p>{isAr ? 'عنصر مؤرشف' : 'Archived Item'}</p>;
    }
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex justify-between items-start group hover:border-[#bf8339]/50 transition-all relative overflow-hidden">
      <div className="flex-1 mr-2 pl-10 md:pl-12">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-[#bf8339]/20 text-[#bf8339] px-2 py-0.5 rounded border border-[#bf8339]/20">{item.type}</span>
          <span className="text-xs text-white/50">{new Date(item.timestamp).toLocaleDateString()}</span>
        </div>
        <div>{renderContent()}</div>
      </div>
      
      {/* Action Buttons - Increased Z-Index */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-50">
          <button 
            type="button"
            onClick={(e) => { 
                e.stopPropagation(); 
                e.preventDefault();
                onRestore(item); 
            }} 
            className="text-white/60 hover:text-[#bf8339] bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all p-2 rounded-full cursor-pointer shadow-md border border-white/5"
            title={isAr ? "فتح / استعادة" : "Open / Restore"}
          >
            <ArrowsRightLeftIcon className="h-5 w-5 pointer-events-none" />
          </button>

          <button 
            type="button"
            onClick={(e) => { 
                e.stopPropagation(); 
                e.preventDefault();
                onDelete(item.id); 
            }} 
            className="text-white/40 hover:text-red-400 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all p-2 rounded-full cursor-pointer shadow-md border border-white/5"
            title={isAr ? "حذف العنصر" : "Delete Item"}
          >
            <TrashIcon className="h-5 w-5 pointer-events-none" />
          </button>
      </div>
    </div>
  );
};

const ArchiveView: React.FC<ArchiveViewProps> = ({ setActiveTab }) => {
  const { appLanguage } = useContext(ProjectContext);
  const isAr = appLanguage === 'ar';
  const [archive, setArchive] = useState<ArchivedItem[]>([]);

  useEffect(() => {
    setArchive(getItem(ARCHIVE_STORAGE_KEY, []));
  }, []);

  // Corrected Delete Logic
  const handleDelete = (id: string) => {
    if (window.confirm(isAr ? "هل أنت متأكد من حذف هذا العنصر؟" : "Are you sure you want to delete this item?")) {
        // 1. Calculate new state first
        const updatedArchive = archive.filter(item => item.id !== id);
        
        // 2. Update React State
        setArchive(updatedArchive);
        
        // 3. Update Local Storage explicitly
        setItem(ARCHIVE_STORAGE_KEY, updatedArchive);
        
        if ((window as any).toast) {
            (window as any).toast(isAr ? 'تم حذف العنصر' : 'Item deleted', 'info');
        }
    }
  };

  // Corrected Clear All Logic
  const handleClearAll = () => {
      if (window.confirm(isAr ? "تحذير: هل أنت متأكد تماماً من رغبتك في مسح كل محتويات الأرشيف؟ لا يمكن التراجع عن هذا الإجراء." : "Warning: Are you sure you want to clear the entire archive? This action cannot be undone.")) {
          // 1. Update Storage
          setItem(ARCHIVE_STORAGE_KEY, []);
          
          // 2. Update State
          setArchive([]);
          
          if ((window as any).toast) {
              (window as any).toast(isAr ? 'تم إفراغ الأرشيف بنجاح' : 'Archive cleared successfully', 'success');
          }
      }
  };

  const handleRestore = (item: ArchivedItem) => {
      if (!setActiveTab) return;
      
      setItem('editDraft', item);
      
      switch (item.type) {
          case 'Post': 
          case 'Reel': 
          case 'Ad': 
              setActiveTab(Tab.CreatePost); 
              break;
          case 'Website': 
              setActiveTab(Tab.WebsiteContent); 
              break;
          case 'Image': 
              setActiveTab(Tab.AIImages); 
              break;
          case 'GraphicDesign': 
              setActiveTab(Tab.GraphicDesigner); 
              break;
          case 'Infographic': 
              setActiveTab(Tab.InfographicDesigner); 
              break;
          case 'Video': 
              setActiveTab(Tab.CreateVideo); 
              break;
          case 'BrandKit': 
              setActiveTab(Tab.BrandKit); 
              break;
          case 'Idea': 
              setActiveTab(Tab.IdeaGenerator); 
              break;
          case 'Summary': 
              setActiveTab(Tab.InstantSummary); 
              break;
          default:
              setActiveTab(Tab.Home);
      }
      
      if ((window as any).toast) {
          (window as any).toast(isAr ? 'تم استعادة المحتوى للمحرر' : 'Content restored to editor', 'success');
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a1e3c]/40 p-6 rounded-2xl border border-white/10">
        <div>
            <h2 className="text-3xl font-bold text-[#bf8339]">{isAr ? 'الأرشيف' : 'Archive'}</h2>
            <p className="text-white/70 mt-1">
                {isAr ? 'استعرض سجل إبداعاتك السابقة.' : 'Review your history of creations.'}
                <span className="text-xs opacity-50 block md:inline md:mr-2">
                    {isAr ? '(يتم حفظ البيانات محلياً في متصفحك)' : '(Data is stored locally in your browser)'}
                </span>
            </p>
        </div>
        {archive.length > 0 && (
            <button 
                type="button"
                onClick={handleClearAll} 
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-all shadow-lg text-sm font-bold z-10 cursor-pointer"
            >
                <TrashIcon className="w-4 h-4 pointer-events-none" />
                {isAr ? 'مسح الكل' : 'Clear All'}
            </button>
        )}
      </div>

      {archive.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archive.map(item => (
            <ArchiveCard key={item.id} item={item} onDelete={handleDelete} onRestore={handleRestore} isAr={isAr} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white/5 rounded-2xl border border-dashed border-white/10 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
          </div>
          <p className="text-white/60 text-lg font-medium">{isAr ? 'الأرشيف فارغ' : 'Archive is empty'}</p>
          <p className="text-white/40 mt-2 text-sm max-w-xs">
              {isAr ? 'ابدأ بإنشاء محتوى جديد وسيظهر هنا تلقائياً لسهولة الوصول إليه لاحقاً.' : 'Start creating content and it will appear here automatically for easy access.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ArchiveView;