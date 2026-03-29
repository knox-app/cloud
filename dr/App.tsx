import React, { useState, useRef } from 'react';
import { Search, FileText, Download, Loader2, CheckCircle2, AlertCircle, ArrowRight, Sparkles, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { performDeepResearch, ResearchStep } from './services/researchService';
import { cn } from './lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function App() {
  const [topic, setTopic] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [steps, setSteps] = useState<ResearchStep[]>([]);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsResearching(true);
    setReport(null);
    setError(null);
    setSteps([]);

    try {
      const result = await performDeepResearch(topic, (updatedSteps) => {
        setSteps(updatedSteps);
      });
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during research.');
    } finally {
      setIsResearching(false);
    }
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    const element = reportRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    // Handle multi-page PDF
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Research_Report_${topic.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans selection:bg-[#F27D26]/20">
      {/* Header */}
      <header className="border-b border-[#1A1A1A]/10 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight uppercase">Deep Researcher</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1">
              <History className="w-4 h-4" />
              History
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero / Input Section */}
        <section className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl font-light leading-tight mb-6">
              What would you like to <span className="italic font-serif">deeply</span> research today?
            </h1>
            <h2 className="text-lg text-[#1A1A1A]/60 mb-8">
              Enter a topic, and our AI will scour the web, analyze findings, and synthesize a comprehensive report for you.
            </h2>

            <form onSubmit={handleResearch} className="relative group">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. The future of solid-state batteries in aviation"
                className="w-full bg-white border-2 border-[#1A1A1A] rounded-2xl px-6 py-5 text-xl outline-none focus:ring-4 focus:ring-[#F27D26]/10 transition-all placeholder:text-[#1A1A1A]/20"
                disabled={isResearching}
              />
              <button
                type="submit"
                disabled={isResearching || !topic.trim()}
                className="absolute right-3 top-3 bottom-3 px-6 bg-[#F27D26] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#D9661F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isResearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Research <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </section>

        {/* Status / Progress Section */}
        <AnimatePresence>
          {isResearching && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 overflow-hidden"
            >
              <div className="bg-[#1A1A1A] text-white rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-medium">Research in Progress</h2>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-mono uppercase tracking-widest">
                    <span className="w-2 h-2 bg-[#F27D26] rounded-full animate-pulse" />
                    Live Processing
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {steps.map((step) => (
                    <div 
                      key={step.id}
                      className={cn(
                        "p-4 rounded-2xl border transition-all duration-500",
                        step.status === 'running' ? "bg-white/10 border-white/20 scale-105" : 
                        step.status === 'completed' ? "bg-[#F27D26]/20 border-[#F27D26]/40" : 
                        "bg-white/5 border-white/5 opacity-40"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-[#F27D26]" />
                        ) : step.status === 'running' ? (
                          <Loader2 className="w-5 h-5 animate-spin text-white" />
                        ) : step.status === 'error' ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-white/20" />
                        )}
                      </div>
                      <p className="font-medium text-sm">{step.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <div className="mb-12 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4 text-red-700">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="font-bold mb-1">Research Interrupted</h3>
              <p className="text-sm opacity-80">{error}</p>
              <button 
                onClick={() => handleResearch({ preventDefault: () => {} } as any)}
                className="mt-4 text-sm font-bold underline underline-offset-4 hover:text-red-900"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Report Section */}
        <AnimatePresence>
          {report && (
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-[#F27D26]" />
                  <h2 className="text-2xl font-bold">Research Report</h2>
                </div>
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Export to PDF
                </button>
              </div>

              <div 
                ref={reportRef}
                className="bg-white border border-[#1A1A1A]/10 rounded-3xl p-12 shadow-sm prose prose-slate max-w-none"
              >
                <div className="mb-12 pb-8 border-b border-[#1A1A1A]/10">
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-2">Subject</p>
                  <h3 className="text-4xl font-serif italic m-0">{topic}</h3>
                  <p className="text-sm text-[#1A1A1A]/40 mt-4">Generated on {new Date().toLocaleDateString()} • Deep Researcher AI</p>
                </div>
                
                <div className="markdown-content">
                  <Markdown>{report}</Markdown>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-[#1A1A1A]/10 py-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-40">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Powered by Gemini 3.1 Pro</span>
          </div>
          <p className="text-xs text-[#1A1A1A]/40">
            © 2026 Deep Researcher AI. All research is synthesized from web sources.
          </p>
        </div>
      </footer>

      <style>{`
        .markdown-content h1 { font-size: 2.5rem; margin-top: 2rem; margin-bottom: 1rem; font-weight: 700; }
        .markdown-content h2 { font-size: 1.8rem; margin-top: 2rem; margin-bottom: 1rem; font-weight: 600; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 0.5rem; }
        .markdown-content h3 { font-size: 1.4rem; margin-top: 1.5rem; margin-bottom: 0.75rem; font-weight: 600; }
        .markdown-content p { margin-bottom: 1.25rem; line-height: 1.7; color: rgba(0,0,0,0.8); }
        .markdown-content ul, .markdown-content ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
        .markdown-content li { margin-bottom: 0.5rem; }
        .markdown-content blockquote { border-left: 4px solid #F27D26; padding-left: 1.5rem; font-style: italic; color: rgba(0,0,0,0.6); margin: 2rem 0; }
        .markdown-content code { background: rgba(0,0,0,0.05); padding: 0.2rem 0.4rem; border-radius: 4px; font-family: monospace; }
      `}</style>
    </div>
  );
}

