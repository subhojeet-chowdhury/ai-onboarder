import React from "react";
import { useAppContext } from "../AppContext";
import { PhoneFrame } from "./PhoneFrame";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Clock,
  FileText,
  ScanFace,
  Fingerprint,
  Camera,
  Loader,
  Home,
  BookOpen,
  Bell,
  User,
} from "lucide-react";
import { useState } from "react";
import { getDummyDocText } from "../utils";
import { Upload, X } from "lucide-react";

export function StefanTab() {
  const { state, dispatch } = useAppContext();
  const c = state.candidates.stefan;

  const [isSigning, setIsSigning] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeUploadDocId, setActiveUploadDocId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'notifs' | 'learning' | 'profile'>('home');

  const handleDocSubmit = (docId: string) => {
    setActiveUploadDocId(docId);
    setShowUploadModal(true);
  };

  const handleConfirmUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadModal(false);
      if (activeUploadDocId) {
        dispatch({
          type: "UPLOAD_PRE_DOC",
          payload: { candidateId: "stefan", docId: activeUploadDocId },
        });
        setActiveUploadDocId(null);
      }
    }, 2500);
  };

  const handleAccept = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      dispatch({ type: "ACCEPT_OFFER", payload: { candidateId: "stefan" } });
    }, 2000);
  };

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      dispatch({ type: "LOGIN", payload: { candidateId: "stefan" } });
    }, 1500);
  };

  return (
    <PhoneFrame headerTitle={c.isAuthenticated ? "Mitarbeiterportal" : ""}>
      {/* Lock Screen */}
      {!c.isAuthenticated && (
        <div className="w-full min-h-full bg-slate-900 flex flex-col text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-slate-900" />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-full flex-1 flex flex-col items-center p-6 pt-20 z-10"
          >
            {c.status === "Pending" ? (
              <div className="w-full flex-1 flex flex-col items-center">
                <div className="text-white mb-12 text-6xl font-light tracking-wider drop-shadow-md">
                  11:30
                </div>

                {/* Notification Bubble */}
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-white/10 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/20 flex flex-col gap-1 active:scale-95 text-left transition-all"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-[#C74634] rounded-md flex items-center justify-center shadow-sm">
                        <FileText size={12} className="text-white" />
                      </div>
                      <span className="text-xs font-medium text-white/90 uppercase tracking-wide">
                        Unilabs HR
                      </span>
                    </div>
                    <span className="text-xs text-white/60">Jetzt</span>
                  </div>
                  <div className="font-semibold text-white text-sm mt-1">
                    Neues Stellenangebot
                  </div>
                  <div className="text-sm text-white/70 mt-0.5 leading-tight">
                    Tippen Sie, um sich zu authentifizieren und Ihren Vertrag zu sehen.
                  </div>
                </button>

                {isLoggingIn && (
                  <div className="mt-auto mb-10 flex flex-col items-center">
                    <ScanFace className="text-white/80 animate-pulse" size={48} />
                    <div className="text-xs font-semibold text-white/70 mt-3 tracking-widest uppercase">
                      FaceID...
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full pb-20">
                <div className="text-white mb-20 text-6xl font-light tracking-wider drop-shadow-md">
                  11:30
                </div>
                <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-8 border border-white/20 shadow-xl">
                  {isLoggingIn ? (
                    <ScanFace className="text-white animate-pulse" size={48} />
                  ) : (
                    <ScanFace className="text-white/70" size={48} />
                  )}
                </div>
                <h2 className="text-2xl font-medium text-white mb-2">
                  Entsperren
                </h2>
                <p className="text-sm text-white/60 mb-10 text-center">
                  FaceID für Mitarbeiterportal erforderlich
                </p>
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-white/10 backdrop-blur-md text-white py-4 rounded-full font-medium shadow-lg hover:bg-white/20 border border-white/30 transition active:scale-95 disabled:opacity-70"
                >
                  {isLoggingIn ? "Wird überprüft..." : "Weiter"}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Main Content (Authenticated) */}
      {c.isAuthenticated && (
        <div className="flex flex-col min-h-[100%] w-full relative">
          <div className="p-4 flex flex-col gap-4 pb-8 flex-1">
            {activeTab === 'home' ? (
              <>
                {c.status === "Pending" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Angebotsübersicht
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Grundgehalt</span>
                  <span className="font-medium text-gray-800">
                    {c.offerDetails.baseComp}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Schichtzulage</span>
                  <span className="font-medium text-gray-800">
                    {c.offerDetails.shiftPremium}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Lokale Zulagen</span>
                  <span className="font-medium text-gray-800">
                    {c.offerDetails.allowances}
                  </span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-gray-500">Startdatum</span>
                  <span className="font-medium text-gray-800">
                    {c.offerDetails.startDate}
                  </span>
                </div>
              </div>
              <button
                onClick={handleAccept}
                disabled={isSigning}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-[#C74634] text-white py-3 rounded-xl font-medium hover:bg-red-800 transition shadow-sm active:scale-95 disabled:opacity-80"
              >
                {isSigning ? (
                  <>
                    <ScanFace className="animate-pulse" size={20} /> Signatur
                    wird erfasst...
                  </>
                ) : (
                  <>
                    <Fingerprint size={20} /> Akzeptieren & Signieren
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Offer Accepted Success */}
          {c.isAuthenticated && c.status === "Offer Accepted" && (
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 text-center"
            >
               <CheckCircle2 className="text-green-500 mx-auto mb-2" size={32} />
               <h3 className="font-semibold text-green-800 text-lg mb-1">Angebot erfolgreich angenommen!</h3>
               <p className="text-sm text-green-700 mb-4">Herzlichen Glückwunsch! Um fortzufahren, laden Sie bitte Ihre Pre-Onboarding-Dokumente hoch.</p>
               <button 
                  onClick={() => document.getElementById('pre-onboarding-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-4 py-2 bg-green-600 text-white font-medium text-sm rounded-lg hover:bg-green-700 transition"
               >
                   Dokumente hochladen
               </button>
            </motion.div>
          )}

          {/* Pre-Onboarding Tracking */}
          {c.isAuthenticated &&
            ["Offer Accepted", "Validating Documents", "Background Check"].includes(c.status) &&
            !c.day1Activated && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {["Offer Accepted", "Validating Documents", "Background Check"].includes(c.status) && (
                  <div id="pre-onboarding-section" className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200">
                    <h2 className="font-semibold text-indigo-900 mb-2">
                       Pre-Onboarding
                    </h2>
                    <p className="text-sm text-indigo-700 mb-4">
                       Bitte reichen Sie Ihre Dokumente ein, um die Vertragsvorbereitung abzuschließen.
                    </p>
                    <div className="space-y-3">
                      {Object.entries(c.preOnboardingDocs || {}).map(([docId, doc]: any) => (
                         <div key={docId} className="bg-white p-3 rounded-xl border border-indigo-100 flex items-center justify-between">
                            <div>
                               <p className="text-sm font-medium text-gray-800">{doc.label}</p>
                               <p className={`text-xs ${doc.status === 'Uploaded' || doc.status === 'Needs Review' ? 'text-green-600' : doc.status === 'Rejected' ? 'text-red-500' : 'text-gray-500'}`}>
                                  {doc.status === 'Uploaded' || doc.status === 'Needs Review' ? 'Eingereicht' : doc.status === 'Rejected' ? 'Abgelehnt (Bitte erneut hochladen)' : 'Einzureichen'}
                               </p>
                            </div>
                            <button
                               disabled={doc.status === 'Uploaded' || doc.status === 'Needs Review' || !["Offer Accepted", "Validating Documents"].includes(c.status)}
                               onClick={() => {
                                  if (docId === 'badge') {
                                     setShowPhotoModal(true);
                                  } else {
                                     handleDocSubmit(docId);
                                  }
                               }}
                               className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${doc.status === 'Uploaded' || doc.status === 'Needs Review' ? 'bg-gray-100 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                            >
                               {doc.status === 'Uploaded' || doc.status === 'Needs Review' ? 'Eingereicht' : 'Hochladen'}
                            </button>
                         </div>
                      ))}
                    </div>
                  </div>
                )}

                {c.status === 'Validating Documents' && Object.values(c.preOnboardingDocs || {}).every((d: any) => d.status === 'Uploaded' || d.status === 'Needs Review') && (
                   <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-3">
                       <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full" />
                       <span className="text-sm text-orange-800 font-medium">Dokumentenprüfung läuft...</span>
                   </div>
                )}
                {c.status === 'Background Check' && (
                   <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                       <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                       <span className="text-sm text-blue-800 font-medium">Hintergrundprüfung (BGC)...</span>
                   </div>
                )}
              </motion.div>
            )}

          {c.isAuthenticated && c.status === "Pending Council" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                <Clock className="text-amber-600" />
              </div>
              <h2 className="font-semibold text-amber-800 mb-2">
                Ausstehende Betriebsratsfreigabe
              </h2>
              <p className="text-sm text-amber-700">
                Ihr Vertrag wird derzeit gemäß den lokalen arbeitsrechtlichen
                Bestimmungen vom Betriebsrat geprüft.
              </p>
            </motion.div>
          )}

          {c.isAuthenticated && c.status === "Cleared" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-green-50 p-5 rounded-2xl border border-green-200 text-center">
                <CheckCircle2
                  className="text-green-600 mb-2 mx-auto"
                  size={32}
                />
                <h2 className="font-semibold text-green-800 mb-1">
                  Willkommen Stefan!
                </h2>
                <p className="text-sm text-green-700">
                  Vertrag freigegeben und geliefert.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileText className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-800">
                    Krankenkasse Formular
                  </h4>
                  <p className="text-xs text-gray-500">
                    Bitte konfigurieren Sie Ihre Versicherung.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
              </>
            ) : activeTab === 'notifs' ? (
              <div className="flex-1 overflow-y-auto">
                 <h2 className="text-xl font-bold text-gray-800 mb-6 mt-2">Mitteilungen</h2>
                 {state.tickets.filter(t => t.candidateId === 'stefan' && t.status === 'Closed').map(t => (
                    <div key={t.id} className="mb-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-3 items-start">
                       <div className="bg-green-100 p-2 rounded-full shrink-0">
                          <CheckCircle2 size={16} className="text-green-600" />
                       </div>
                       <div>
                          <p className="text-sm font-semibold text-gray-800 mb-1">Ticket gelöst : {t.category}</p>
                          <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2 italic leading-relaxed">
                             "Hallo Stefan, die Schichtzulagen werden am 25. des Monats abgerechnet. Spätere Stunden werden im nächsten Monat bezahlt. Mit freundlichen Grüßen."
                          </p>
                          <p className="text-[10px] text-gray-400 mt-2 font-medium">HR-Spezialist (Global Service Center)</p>
                       </div>
                    </div>
                 ))}
                 {state.tickets.filter(t => t.candidateId === 'stefan' && t.status === 'Closed').length === 0 && (
                    <div className="text-center text-gray-400 py-12 flex flex-col items-center">
                       <Bell size={32} className="mb-3 opacity-20" />
                       <p className="text-sm">Keine neuen Mitteilungen</p>
                    </div>
                 )}
              </div>
            ) : activeTab === 'learning' ? (
               <div className="flex-1 overflow-y-auto">
                 <h2 className="text-xl font-bold text-gray-800 mb-6 mt-2">Lernen</h2>
                 <div className="text-center text-gray-400 py-12 flex flex-col items-center">
                    <BookOpen size={32} className="mb-3 opacity-20" />
                    <p className="text-sm">Keine Kurse verfügbar.</p>
                 </div>
               </div>
            ) : activeTab === 'profile' ? (
               <div className="flex-1 overflow-y-auto">
                 <h2 className="text-xl font-bold text-gray-800 mb-6 mt-2">Profil</h2>
                 <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 text-xl overflow-hidden">
                       <img 
                         src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&auto=format&fit=crop" 
                         alt="Profile" 
                         className="w-full h-full object-cover" 
                         referrerPolicy="no-referrer"
                         onError={(e) => {
                           e.currentTarget.onerror = null;
                           e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='40' fill='%2364748b' text-anchor='middle' dy='.3em'%3ESM%3C/text%3E%3C/svg%3E";
                         }}
                       />
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-lg">Stefan Meier</p>
                        <p className="text-sm text-gray-500">{c.role}</p>
                    </div>
                 </div>
               </div>
            ) : null}
          </div>

          {/* Photo Modal */}
          <AnimatePresence>
            {showPhotoModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 bottom-0 top-[110px] bg-black/80 z-50 p-4 pb-8 flex flex-col justify-center items-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl w-full p-6 flex flex-col items-center shadow-2xl"
                >
                  {!isUploading ? (
                    <>
                      <div className="w-48 h-48 bg-gray-200 rounded-full border-4 border-gray-300 shadow-inner flex items-center justify-center overflow-hidden mx-auto my-6">
                         <img 
                           src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&auto=format&fit=crop" 
                           alt="Profile" 
                           className="w-full h-full object-cover" 
                           referrerPolicy="no-referrer"
                           onError={(e) => {
                             e.currentTarget.onerror = null;
                             e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='40' fill='%2364748b' text-anchor='middle' dy='.3em'%3ESM%3C/text%3E%3C/svg%3E";
                           }}
                         />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Ausweisfoto aufnehmen
                      </h3>
                      <p className="text-xs text-gray-500 mb-6 text-center">
                        Bitte stellen Sie sicher, dass Ihr Gesicht gut erkennbar ist.
                      </p>
                      <button
                        onClick={() => {
                          setIsUploading(true);
                          setTimeout(() => {
                            setIsUploading(false);
                            setShowPhotoModal(false);
                            dispatch({ type: "UPLOAD_PRE_DOC", payload: { candidateId: "stefan", docId: "badge" } });
                          }, 2500);
                        }}
                        className="w-full bg-[#C74634] text-white py-3 rounded-xl font-medium shadow-sm hover:bg-red-800 active:scale-95 transition flex items-center justify-center gap-2"
                      >
                        <Camera size={20} /> Aufnehmen & Genehmigen
                      </button>
                    </>
                  ) : (
                    <div className="w-full py-8 flex flex-col items-center">
                      <div className="w-32 h-32 bg-gray-50 rounded-xl mb-6 flex flex-col items-center justify-center relative shadow-inner border border-gray-200">
                        <Loader size={48} className="text-[#C74634] animate-spin opacity-50" />
                      </div>
                      <h3 className="font-semibold text-[#C74634] mb-2 flex items-center gap-2">
                        <Loader size={18} className="animate-spin" /> Hochladen...
                      </h3>
                      <p className="text-xs text-gray-500 mt-2">
                        Zugangsausweis wird erstellt...
                      </p>
                    </div>
                  )}
                  {!isUploading && (
                    <button
                      onClick={() => setShowPhotoModal(false)}
                      className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Abbrechen
                    </button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Modal */}
          <AnimatePresence>
            {showUploadModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 bottom-0 top-[110px] bg-black/80 z-50 p-4 pb-8 flex flex-col justify-center items-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl w-full p-6 flex flex-col items-center shadow-2xl"
                >
                  {!isUploading ? (
                    <>
                      <div className="w-full h-64 overflow-y-auto bg-white rounded-xl mb-4 text-left border border-gray-200 shadow-sm relative group transition">
                        {activeUploadDocId ? getDummyDocText(c.preOnboardingDocs?.[activeUploadDocId]?.label || '') : null}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Dokument einreichen
                      </h3>
                      <p className="text-xs text-gray-500 mb-6 text-center">
                        Bitte stellen Sie sicher, dass das Dokument gut lesbar ist.
                      </p>
                      <button
                        onClick={handleConfirmUpload}
                        className="w-full bg-[#C74634] text-white py-3 rounded-xl font-medium shadow-sm hover:bg-red-800 active:scale-95 transition flex items-center justify-center gap-2"
                      >
                        <Upload size={20} /> Einreichen & Analysieren
                      </button>
                    </>
                  ) : (
                    <div className="w-full py-8 flex flex-col items-center">
                      <div className="w-32 h-32 bg-gray-50 rounded-xl mb-6 flex flex-col items-center justify-center relative overflow-hidden shadow-inner border border-gray-200">
                        <ScanFace
                          size={48}
                          className="text-[#C74634] opacity-50"
                        />
                        <motion.div
                          animate={{ y: ["-100%", "400%", "-100%"] }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "linear",
                          }}
                          className="absolute top-0 left-0 w-full h-1 bg-[#C74634] shadow-[0_0_15px_#C74634]"
                        />
                      </div>
                      <h3 className="font-semibold text-[#C74634] mb-2 flex items-center gap-2">
                        <Loader size={18} className="animate-spin" /> OCR Analyse läuft...
                      </h3>
                      <p className="text-xs text-gray-500 mt-2">
                        Daten werden extrahiert...
                      </p>
                    </div>
                  )}
                  {!isUploading && (
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Abbrechen
                    </button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Tabs */}
          <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 px-6 py-3 pb-6 flex justify-between items-center text-[10px] font-medium text-gray-400 z-40 mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
             <div onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeTab === 'home' ? 'text-[#C74634]' : 'hover:text-gray-800'}`}>
                <Home size={22} className="mb-0.5" />
                <span>Start</span>
             </div>
             <div onClick={() => setActiveTab('learning')} className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeTab === 'learning' ? 'text-[#C74634]' : 'hover:text-gray-800'}`}>
                <BookOpen size={22} className="mb-0.5" />
                <span>Lernen</span>
             </div>
             <div onClick={() => setActiveTab('notifs')} className={`flex flex-col items-center gap-1 transition cursor-pointer relative ${activeTab === 'notifs' ? 'text-[#C74634]' : 'hover:text-gray-800'}`}>
                {state.tickets.some(t => t.candidateId === 'stefan' && t.status === 'Closed') && (
                   <div className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                )}
                <Bell size={22} className="mb-0.5" />
                <span>Mitteilungen</span>
             </div>
             <div onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeTab === 'profile' ? 'text-[#C74634]' : 'hover:text-gray-800'}`}>
                <User size={22} className="mb-0.5" />
                <span>Profil</span>
             </div>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
