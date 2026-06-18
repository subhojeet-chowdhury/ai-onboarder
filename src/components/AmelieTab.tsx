import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../AppContext";
import { PhoneFrame } from "./PhoneFrame";
import {
  MessageSquare,
  Upload,
  CheckCircle2,
  ChevronRight,
  FileBadge2,
  ScanFace,
  Loader,
  Clock,
  Fingerprint,
  Play,
  X,
  HelpCircle,
  Camera,
  FileCheck2,
  Home,
  BookOpen,
  Bell,
  User,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AmelieTab() {
  const { state, dispatch } = useAppContext();
  const c = state.candidates.amelie;
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeUploadDocId, setActiveUploadDocId] = useState<string | null>(null);
  const [showUniformModal, setShowUniformModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCDIModal, setShowCDIModal] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketDesc, setTicketDesc] = useState("");
  const [activeTab, setActiveTab] = useState<'home' | 'notifs' | 'learning' | 'profile'>('home');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.chatLogs.amelie, showTicketForm]);

  const handleAccept = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      dispatch({ type: "ACCEPT_OFFER", payload: { candidateId: "amelie" } });
    }, 2000);
  };

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      dispatch({ type: "LOGIN", payload: { candidateId: "amelie" } });
    }, 1500);
  };

  const handleConfirmUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadModal(false);
      if (activeUploadDocId) {
        if (activeUploadDocId === 'medical') {
            dispatch({ type: "UPLOAD_DOCUMENT", payload: { candidateId: "amelie" } });
        }
        dispatch({ type: "UPLOAD_PRE_DOC", payload: { candidateId: "amelie", docId: activeUploadDocId } });
        setActiveUploadDocId(null);
      }
    }, 2000); // simulate OCR
  };

  const handleConfirmPhotoUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowPhotoModal(false);
      dispatch({ type: "UPLOAD_PHOTO", payload: { candidateId: "amelie" } });
      dispatch({ type: "UPLOAD_PRE_DOC", payload: { candidateId: "amelie", docId: "badge" } });
    }, 2000);
  };

  const handleDocSubmit = (docId: string) => {
    setActiveUploadDocId(docId);
    setShowUploadModal(true);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // specific trigger for the ticket
    const input = chatInput.toLowerCase();
    let responseText = "";

    if (input.includes("nuit") || input.includes("prime")) {
      responseText =
        "Les coupures pour les primes de nuit ont lieu le 25 du mois. Les équipes validées par la suite apparaitront sur votre prochain cycle de paie.";
    } else if (input.includes("salaire")) {
      responseText =
        "Les salaires sont virés le 28 de chaque mois sur le compte bancaire enregistré lors de l'intégration.";
    } else if (input.includes("paie") || input.includes("fiche")) {
      responseText =
        'Vos fiches de paie seront disponibles dans l\'onglet "Documents" de votre portail HR Oracle environ 3 jours avant le versement du salaire.';
    } else if (input.includes("horaire")) {
      responseText =
        "Les horaires sont fixes selon votre contrat. Veuillez consulter votre manager (Dr. Dupont) pour toute demande de changement exceptionnel.";
    } else if (
      input.includes("informatique") ||
      input.includes("it") ||
      input.includes("mot de passe")
    ) {
      responseText =
        "Le support informatique local est joignable au poste 4000. Pour les réinitialisations de mot de passe, un lien libre-service est activé dans vos paramètres.";
    } else {
      responseText =
        "Je suis votre assistant virtuel RH. Vous pouvez me poser des questions sur vos primes, vos paies, vos horaires, etc. Souhaitez-vous contacter un spécialiste humain ?";
    }

    dispatch({
      type: "SUBMIT_CHAT",
      payload: {
        candidateId: "amelie",
        text: chatInput,
        response: responseText,
      },
    });
    setChatInput("");
  };

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "ESCALATE_TICKET", payload: { candidateId: "amelie" } });
    setShowTicketForm(false);
    setTicketDesc("");
  };

  const handleDay1Activate = () => {
    dispatch({ type: "ACTIVATE_DAY_1" });
  };

  const handleSignUniform = () => {
    setShowUniformModal(false);
    dispatch({ type: "SIGN_UNIFORM", payload: { candidateId: "amelie" } });
    dispatch({ type: "UPLOAD_PRE_DOC", payload: { candidateId: "amelie", docId: "uniform" } });
  };

  const handleWatchVideo = () => {
    setShowVideoModal(false);
    dispatch({ type: "WATCH_VIDEO", payload: { candidateId: "amelie" } });
    dispatch({ type: "COMPLETE_POST_TASK", payload: { candidateId: "amelie", taskId: "biohazard" } });
  };

  return (
    <PhoneFrame headerTitle={c.isAuthenticated ? (c.status === "Active Employee" ? "Portail Employé" : "Portail Onboarding") : ""}>
      {/* Lock Screen */}
      {!c.isAuthenticated && (
        <div className="w-full min-h-full bg-slate-900 flex flex-col text-white relative overflow-hidden">
          {/* Subtle gradient overlay instead of external image to avoid CSP/loading issues */}
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
                        <MessageSquare size={12} className="text-white" />
                      </div>
                      <span className="text-xs font-medium text-white/90 uppercase tracking-wide">
                        Unilabs RH
                      </span>
                    </div>
                    <span className="text-xs text-white/60">Maintenant</span>
                  </div>
                  <div className="font-semibold text-white text-sm mt-1">
                    Nouvelle offre d'emploi
                  </div>
                  <div className="text-sm text-white/70 mt-0.5 leading-tight">
                    Tapez pour vous authentifier et consulter votre CDI.
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
                  Déverrouillage
                </h2>
                <p className="text-sm text-white/60 mb-10 text-center">
                  FaceID requis pour Portail Employé
                </p>
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-white/10 backdrop-blur-md text-white py-4 rounded-full font-medium shadow-lg hover:bg-white/20 border border-white/30 transition active:scale-95 disabled:opacity-70"
                >
                  {isLoggingIn ? "Vérification..." : "Continuer"}
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
                {/* State: Pending Offer */}
                {c.status === "Pending" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Résumé de l'Offre
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Rémunération de base</span>
                    <span className="font-medium text-gray-800">
                      {c.offerDetails.baseComp}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Prime de quart</span>
                    <span className="font-medium text-gray-800">
                      {c.offerDetails.shiftPremium}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Indemnités locales</span>
                    <span className="font-medium text-gray-800">
                      {c.offerDetails.allowances}
                    </span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-500">Date de début</span>
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
                      <ScanFace className="animate-pulse" size={20} /> Collecte
                      de la signature...
                    </>
                  ) : (
                    <>
                      <Fingerprint size={20} /> Accepter & Signer
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Pre-Onboarding Tracking */}
            {c.isAuthenticated &&
              ["Offer Accepted", "Validating Documents", "Background Check", "Contract Generated"].includes(c.status) &&
              !c.day1Activated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200">
                    <h2 className="font-semibold text-indigo-900 mb-2">
                       Pré-intégration
                    </h2>
                    <p className="text-sm text-indigo-700 mb-4">
                       Veuillez soumettre vos documents pour finaliser la préparation de votre contrat.
                    </p>
                    <div className="space-y-3">
                      {Object.entries(c.preOnboardingDocs || {}).map(([docId, doc]: any) => (
                         <div key={docId} className="bg-white p-3 rounded-xl border border-indigo-100 flex items-center justify-between">
                            <div>
                               <p className="text-sm font-medium text-gray-800">{doc.label}</p>
                               <p className={`text-xs ${doc.status === 'Uploaded' ? 'text-green-600' : doc.status === 'Rejected' ? 'text-red-500' : 'text-gray-500'}`}>
                                  {doc.status === 'Uploaded' ? 'Soumis' : doc.status === 'Rejected' ? 'Rejeté (Veuillez resoumettre)' : 'À soumettre'}
                               </p>
                            </div>
                            <button
                               disabled={doc.status === 'Uploaded' || !["Offer Accepted", "Validating Documents"].includes(c.status)}
                               onClick={() => handleDocSubmit(docId)}
                               className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${doc.status === 'Uploaded' ? 'bg-gray-100 text-gray-400' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                            >
                               {doc.status === 'Uploaded' ? 'Soumis' : 'Soumettre'}
                            </button>
                         </div>
                      ))}
                    </div>
                  </div>

                  {c.status === 'Validating Documents' && (
                     <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-3">
                         <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full" />
                         <span className="text-sm text-orange-800 font-medium">Validation des documents en cours...</span>
                     </div>
                  )}
                  {c.status === 'Background Check' && (
                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                         <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                         <span className="text-sm text-blue-800 font-medium">Vérification des antécédents (BGC)...</span>
                     </div>
                  )}
                  {c.status === 'Contract Generated' && (
                     <div className="bg-green-50 p-5 rounded-2xl border border-green-200 text-center shadow-lg transform transition-all hover:scale-105">
                         <CheckCircle2 className="text-green-600 mx-auto mb-2" size={32} />
                         <h3 className="font-semibold text-green-900 mb-2">Contrat Généré</h3>
                         <p className="text-sm text-green-700 mb-4">Votre contrat CDI est prêt à être signé.</p>
                         <button onClick={() => setShowCDIModal(true)} className="bg-green-600 text-white w-full py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 shadow-md">
                             Voir & Signer le CDI
                         </button>
                     </div>
                  )}
                </motion.div>
              )}

            {/* State: Cleared (Pre Day-1) */}
            {c.isAuthenticated &&
              (c.status === "Cleared" || c.status === "Pending Council") &&
              !c.day1Activated && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 p-5 rounded-2xl border border-green-200 flex flex-col items-center text-center"
                >
                  <CheckCircle2 className="text-green-600 mb-2" size={32} />
                  <h2 className="font-semibold text-green-800">
                    Félicitations Amélie !
                  </h2>
                  <p className="text-sm text-green-700 mt-2 mb-4">
                    Votre contrat CDI a été signé. En attente du
                    premier jour.
                  </p>
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      onClick={() => setShowCDIModal(true)}
                      className="bg-white text-green-700 border border-green-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-50 transition w-full"
                    >
                      Voir le contrat CDI
                    </button>
                    <button
                      onClick={handleDay1Activate}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition w-full"
                    >
                      Afficher les tâches d'intégration (Jour 1)
                    </button>
                  </div>
                </motion.div>
              )}

            {/* State: Day 1 Active */}
            {c.isAuthenticated && c.day1Activated && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Tâches Prioritaires
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(c.postOnboardingTasks || {}).map(([taskId, task]: any) => (
                      <div
                        key={taskId}
                        className={`flex items-start gap-3 p-3 rounded-xl border ${task.status === 'Completed' ? "bg-gray-50 border-gray-100" : "bg-white border-blue-200 shadow-sm"}`}
                      >
                        {task.status === 'Completed' ? (
                          <CheckCircle2
                            className="text-green-500 shrink-0 mt-0.5"
                            size={20}
                          />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-800">
                            {task.label}
                          </div>
                          {task.status === 'Completed' ? (
                            <div className="text-xs text-gray-500 mt-1">
                              Action complétée. Enregistrée dans votre profil.
                            </div>
                          ) : (
                            <div className="text-xs text-gray-500 mt-1 mb-2">
                              Action requise dans le cadre de votre intégration.
                            </div>
                          )}
                          {task.status !== 'Completed' && (
                            <button
                              onClick={() => {
                                if (task.type === 'video') setShowVideoModal(true);
                                else dispatch({ type: 'COMPLETE_POST_TASK', payload: { candidateId: 'amelie', taskId } });
                              }}
                              className="flex items-center justify-center gap-2 w-full bg-[#FAFAFA] border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
                            >
                              {task.type === 'video' ? <Play size={16} /> : <FileCheck2 size={16} />}
                              {task.type === 'video' ? "Regarder la vidéo" : "Marquer comme complété"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Badge Notification */}
                <AnimatePresence>
                  {c.badgeApproved && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex gap-3 items-center"
                    >
                      <FileBadge2 className="text-blue-600" />
                      <span className="text-sm text-blue-800">
                        Badge salle blanche approuvé par Dr. Dupont.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 30-Day Milestone */}
                <AnimatePresence>
                  {c.milestone30DayReached && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-purple-50 border border-purple-200 p-4 rounded-xl"
                    >
                      <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">
                        Recommandé pour vous
                      </h4>
                      <p className="text-sm text-purple-900 font-medium">
                        Certification avancée : Analyseur Chimique Automatisé
                      </p>
                      <button className="mt-3 text-sm text-purple-700 font-medium flex items-center gap-1 hover:underline">
                        Démarrer le module <ChevronRight size={16} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
            </>
            ) : activeTab === 'notifs' ? (
              <div className="flex-1 overflow-y-auto">
                 <h2 className="text-xl font-bold text-gray-800 mb-6 mt-2">Notifications</h2>
                 {state.tickets.filter(t => t.candidateId === 'amelie' && t.status === 'Closed').map(t => (
                    <div key={t.id} className="mb-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-3 items-start">
                       <div className="bg-green-100 p-2 rounded-full shrink-0">
                          <CheckCircle2 size={16} className="text-green-600" />
                       </div>
                       <div>
                          <p className="text-sm font-semibold text-gray-800 mb-1">Ticket Résolu : {t.category}</p>
                          <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2 italic leading-relaxed">
                             "Bonjour Amélie, les primes de nuit coupent le 25 du mois. Les heures ultérieures seront payées le mois prochain. Cordialement."
                          </p>
                          <p className="text-[10px] text-gray-400 mt-2 font-medium">Spécialiste HR (Global Service Center)</p>
                       </div>
                    </div>
                 ))}
                 {state.tickets.filter(t => t.candidateId === 'amelie' && t.status === 'Closed').length === 0 && (
                    <div className="text-center text-gray-400 py-12 flex flex-col items-center">
                       <div className="bg-gray-50 p-4 rounded-full mb-3">
                         <Bell size={24} className="text-gray-300" />
                       </div>
                       <div className="text-sm">Aucune notification</div>
                    </div>
                 )}
              </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                   Contenu non disponible.
                </div>
            )}
          </div>

          {/* Chat Overlay */}
          <AnimatePresence>
            {chatOpen && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="absolute inset-0 bg-white z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
              >
                <div className="bg-[#C74634] text-white p-4 flex justify-between items-center shadow-md">
                  <span className="font-semibold">Assistant HR Oracle</span>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="text-white/80 hover:text-white"
                  >
                    Fermer
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 mb-2">
                    <div className="font-semibold mb-1 flex items-center gap-1">
                      <HelpCircle size={14} /> Exemples de questions:
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5">
                      <li>"Quand recevrai-je mon salaire ?"</li>
                      <li>"Où sont mes fiches de paie ?"</li>
                      <li>"Puis-je modifier mes horaires ?"</li>
                      <li>"Problème informatique ?"</li>
                      <li>"Prime de nuit ?" (Escalade)</li>
                    </ul>
                  </div>
                  <div className="text-xs text-center text-gray-400 my-2">
                    Aujourd'hui - 11:30 PM
                  </div>
                  {state.chatLogs.amelie.map((msg) => (
                    <div
                      key={msg.id}
                      className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.sender === "user"
                          ? "bg-[#C74634] text-white rounded-br-none self-end"
                          : msg.sender === "system"
                            ? "bg-orange-100 text-orange-800 border border-orange-200 self-center text-center text-xs"
                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-none self-start shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {state.tickets.some(
                  (t) => t.candidateId === "amelie" && t.status === "Open",
                ) ? (
                  <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                    <p className="text-sm text-yellow-800 text-center font-medium">
                      Un spécialiste examine votre demande...
                    </p>
                    <p className="text-xs text-yellow-600 text-center mt-1">
                      Vous recevrez une notification d'ici peu.
                    </p>
                  </div>
                ) : showTicketForm ? (
                  <div className="p-4 bg-white border-t border-gray-200 shadow-inner">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-semibold text-gray-800">
                        Ouvrir un ticket d'assistance
                      </h4>
                      <button onClick={() => setShowTicketForm(false)}>
                        <X size={16} className="text-gray-400" />
                      </button>
                    </div>
                    <form onSubmit={handleEscalateSubmit} className="space-y-3">
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none">
                        <option>Paie et primes</option>
                        <option>Horaires</option>
                        <option>Accès aux locaux</option>
                      </select>
                      <textarea
                        required
                        value={ticketDesc}
                        onChange={(e) => setTicketDesc(e.target.value)}
                        placeholder="Décrivez votre problème en détail..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none resize-none h-20"
                      />
                      <button
                        type="submit"
                        className="w-full bg-gray-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700"
                      >
                        Soumettre le ticket
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-2 shadow-inner">
                    {state.chatLogs.amelie.length > 0 && (
                      <button
                        onClick={() => setShowTicketForm(true)}
                        className="text-xs bg-gray-100 text-gray-600 py-2 rounded-xl mb-1 hover:bg-gray-200 font-medium"
                      >
                        Contacter un spécialiste humain (Ticket)
                      </button>
                    )}
                    <form
                      onSubmit={handleChatSubmit}
                      className="flex gap-2 relative"
                    >
                      <input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Tapez un message..."
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C74634]/50"
                      />
                      <button
                        type="submit"
                        className="bg-[#C74634] text-white p-2 w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Uniform Modal */}
          <AnimatePresence>
            {showUniformModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 bottom-0 top-[110px] bg-black/50 z-50 p-4 pb-8 flex flex-col justify-end"
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80%]"
                >
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-semibold text-gray-800">
                      Politique Uniforme
                    </h3>
                    <button onClick={() => setShowUniformModal(false)}>
                      <X size={20} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="p-5 overflow-y-auto flex-1 text-sm text-gray-600 space-y-4">
                    <p>
                      Conformément aux normes d'hygiène et de sécurité, tous les
                      employés travaillant dans les environnements de
                      laboratoire confinés doivent porter la tenue standard
                      Unilabs.
                    </p>
                    <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                      Taille: L<br />
                      Chaussures: 42
                      <br />
                      Lunettes: Fournies
                    </div>
                    <p>
                      Votre signature électronique ci-dessous confirme
                      l'exactitude de ces informations pour la commande.
                    </p>
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-white">
                    <button
                      onClick={handleSignUniform}
                      className="w-full bg-[#C74634] text-white py-3 rounded-xl font-medium shadow-sm hover:bg-red-800 active:scale-95 transition flex items-center justify-center gap-2"
                    >
                      <Fingerprint size={20} /> Signer et Confirmer
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Modal */}
          <AnimatePresence>
            {showVideoModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 bottom-0 top-[110px] bg-black/90 z-50 p-4 pb-8 flex flex-col justify-center items-center"
              >
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="absolute top-4 right-4 text-white p-2"
                >
                  <X size={24} />
                </button>
                <div className="w-full aspect-video bg-gray-800 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center border border-gray-700">
                  <Play size={48} className="text-white/50" />
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-600">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4, ease: "linear" }}
                      className="h-full bg-red-500"
                    />
                  </div>
                </div>
                <h3 className="text-white font-medium mb-1">
                  Prévention des risques L2
                </h3>
                <p className="text-gray-400 text-sm mb-8">Durée: 03:45</p>
                <button
                  onClick={handleWatchVideo}
                  className="bg-white text-gray-900 px-6 py-3 rounded-full font-medium shadow-lg hover:bg-gray-100 active:scale-95 transition"
                >
                  Marquer comme terminé
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generic Uploading Overlay */}
          <AnimatePresence>
             {isUploading && !showUploadModal && !showPhotoModal && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[60] flex flex-col items-center justify-center"
                 >
                    <div className="animate-spin h-10 w-10 border-4 border-[#C74634] border-t-transparent rounded-full mb-4" />
                    <p className="font-semibold text-gray-800 text-lg">Envoi en cours...</p>
                    <p className="text-sm text-gray-500">Veuillez patienter.</p>
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
                      <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden group hover:bg-gray-100 transition">
                        <Upload
                          size={48}
                          className="text-gray-400 group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition"></div>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Télécharger le document
                      </h3>
                      <p className="text-xs text-gray-500 mb-6 text-center">
                        Veuillez vous assurer que le document ({c.preOnboardingDocs?.[activeUploadDocId || '']?.label || 'médicaux'}) est bien scanné.
                      </p>
                      <button
                        onClick={handleConfirmUpload}
                        className="w-full bg-[#C74634] text-white py-3 rounded-xl font-medium shadow-sm hover:bg-red-800 active:scale-95 transition flex items-center justify-center gap-2"
                      >
                        <Upload size={20} /> Télécharger & Analyser
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
                        <Loader size={18} className="animate-spin" /> Analyse
                        OCR en cours...
                      </h3>
                      <p className="text-xs text-gray-500 mt-2">
                        Extraction des données en cours...
                      </p>
                    </div>
                  )}
                  {!isUploading && (
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Annuler
                    </button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
                      <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden group hover:bg-gray-100 transition">
                        <Camera
                          size={48}
                          className="text-gray-400 group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition"></div>
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Prendre une photo de badge
                      </h3>
                      <p className="text-xs text-gray-500 mb-6 text-center">
                        Veuillez vous assurer que votre visage est lisible et clair.
                      </p>
                      <button
                        onClick={handleConfirmPhotoUpload}
                        className="w-full bg-[#C74634] text-white py-3 rounded-xl font-medium shadow-sm hover:bg-red-800 active:scale-95 transition flex items-center justify-center gap-2"
                      >
                        <Camera size={20} /> Capturer & Approuver
                      </button>
                    </>
                  ) : (
                    <div className="w-full py-8 flex flex-col items-center">
                      <div className="w-32 h-32 bg-gray-50 rounded-xl mb-6 flex flex-col items-center justify-center relative shadow-inner border border-gray-200">
                        <Loader size={48} className="text-[#C74634] animate-spin opacity-50" />
                      </div>
                      <h3 className="font-semibold text-[#C74634] mb-2 flex items-center gap-2">
                        <Loader size={18} className="animate-spin" /> Téléchargement...
                      </h3>
                      <p className="text-xs text-gray-500 mt-2">
                        Création du badge d'accès...
                      </p>
                    </div>
                  )}
                  {!isUploading && (
                    <button
                      onClick={() => setShowPhotoModal(false)}
                      className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Annuler
                    </button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CDI Modal */}
          <AnimatePresence>
            {showCDIModal && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute inset-x-0 bottom-0 top-[110px] bg-white z-50 flex flex-col"
              >
                <div className="bg-gray-100 border-b border-gray-200 p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Contrat_CDI_Laurent.pdf</h3>
                    <p className="text-xs text-green-600 font-medium">{c.contractSigned ? 'Généré et Signé' : 'Généré - En attente de signature'}</p>
                  </div>
                  <button onClick={() => setShowCDIModal(false)} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col">
                   <div className="bg-white border border-gray-200 shadow-sm p-6 space-y-4 font-serif text-sm text-gray-700 leading-relaxed max-w-sm mx-auto flex-1 w-full relative mb-4">
                     <div className="text-center mb-6">
                        <h2 className="font-bold text-lg text-gray-900 border-b pb-2 inline-block">CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE</h2>
                     </div>
                     <p>Entre les soussignés :</p>
                     <p><strong>Oracle France</strong>, Société par Actions Simplifiée, dont le siège social est situé 15 Boulevard Charles de Gaulle, 92700 Colombes, immatriculée au RCS de Nanterre sous le numéro 342 067 196.</p>
                     <p>Et</p>
                     <p><strong>Mme Amélie Laurent</strong>, née le 12 Février 1993, domiciliée à Paris.</p>
                     <p><strong>Article 1 : Engagement</strong></p>
                     <p>Mme Amélie Laurent est engagée à partir du {c.offerDetails.startDate} en qualité de {c.role}, coefficient 120, de la convention collective nationale. Elle percevra une rémunération de base de {c.offerDetails.baseComp}.</p>
                     <p><strong>Article 2 : Lieu de travail</strong></p>
                     <p>Le lieu de travail principal est fixé au site de Paris. Des indemnités spécifiques incluent {c.offerDetails.allowances} et une prime de nuit de {c.offerDetails.shiftPremium}.</p>
                     <div className="mt-8 grid grid-cols-2 gap-4 pb-8">
                        <div>
                          <p className="text-xs text-gray-500 mb-2">L'Employeur (Oracle France)</p>
                          <div className="w-20 border-b-2 border-blue-900 bg-blue-50 py-1 text-center font-mono text-xs text-blue-800">Signé Auto.</div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Le Salarié</p>
                          {c.contractSigned ? (
                             <div className="w-20 border-b-2 border-[#C74634] bg-red-50 py-1 text-center font-mono text-xs text-[#b83b2a]">e-Signé</div>
                          ) : (
                             <div className="text-gray-400 italic text-xs mt-3">En attente de signature</div>
                          )}
                        </div>
                     </div>
                   </div>
                   {!c.contractSigned && (
                      <div className="bg-white p-4 border border-gray-200 mt-auto shrink-0 shadow-xl rounded-xl z-10 w-full max-w-sm mx-auto">
                         <button 
                             onClick={() => { dispatch({ type: 'SIGN_CONTRACT', payload: { candidateId: 'amelie' }}); setShowCDIModal(false); }}
                             className="w-full bg-[#C74634] text-white py-3 rounded-xl font-medium hover:bg-red-800 transition shadow-md flex justify-center items-center gap-2"
                         >
                            <Fingerprint size={18} /> Signer le Contrat
                         </button>
                      </div>
                   )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Chat Button */}
          <button
            onClick={() => setChatOpen(true)}
            className="absolute bottom-24 right-6 bg-[#C74634] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-transform active:scale-95 z-40"
          >
            <MessageSquare size={24} />
          </button>

          {/* Bottom Tabs */}
          <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 px-6 py-3 pb-6 flex justify-between items-center text-[10px] font-medium text-gray-400 z-40 mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
             <div onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeTab === 'home' ? 'text-[#C74634]' : 'hover:text-gray-800'}`}>
                <Home size={22} className="mb-0.5" />
                <span>Accueil</span>
             </div>
             <div onClick={() => setActiveTab('learning')} className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeTab === 'learning' ? 'text-[#C74634]' : 'hover:text-gray-800'}`}>
                <BookOpen size={22} className="mb-0.5" />
                <span>Formation</span>
             </div>
             <div onClick={() => setActiveTab('notifs')} className={`flex flex-col items-center gap-1 transition cursor-pointer relative ${activeTab === 'notifs' ? 'text-[#C74634]' : 'hover:text-gray-800'}`}>
                {state.tickets.some(t => t.candidateId === 'amelie' && t.status === 'Closed') && (
                   <div className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                )}
                <Bell size={22} className="mb-0.5" />
                <span>Notifs</span>
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
