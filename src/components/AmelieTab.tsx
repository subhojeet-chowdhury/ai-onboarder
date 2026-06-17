import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { PhoneFrame } from './PhoneFrame';
import { MessageSquare, Upload, CheckCircle2, ChevronRight, FileBadge2, ScanFace, Loader, Clock, Fingerprint, Play, X, HelpCircle, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AmelieTab() {
  const { state, dispatch } = useAppContext();
  const c = state.candidates.amelie;
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUniformModal, setShowUniformModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketDesc, setTicketDesc] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatLogs.amelie, showTicketForm]);

  const handleAccept = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      dispatch({ type: 'ACCEPT_OFFER', payload: { candidateId: 'amelie' } });
    }, 2000);
  };

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      dispatch({ type: 'LOGIN', payload: { candidateId: 'amelie' } });
    }, 1500);
  };

  const handleConfirmUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadModal(false);
      dispatch({ type: 'UPLOAD_DOCUMENT', payload: { candidateId: 'amelie' } });
    }, 2000); // simulate OCR
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // specific trigger for the ticket
    const input = chatInput.toLowerCase();
    let responseText = '';
    
    if (input.includes('nuit') || input.includes('prime')) {
      responseText = 'Les coupures pour les primes de nuit ont lieu le 25 du mois. Les équipes validées par la suite apparaitront sur votre prochain cycle de paie.';
    } else if (input.includes('salaire')) {
      responseText = 'Les salaires sont virés le 28 de chaque mois sur le compte bancaire enregistré lors de l\'intégration.';
    } else if (input.includes('paie') || input.includes('fiche')) {
      responseText = 'Vos fiches de paie seront disponibles dans l\'onglet "Documents" de votre portail HR Oracle environ 3 jours avant le versement du salaire.';
    } else if (input.includes('horaire')) {
      responseText = 'Les horaires sont fixes selon votre contrat. Veuillez consulter votre manager (Dr. Dupont) pour toute demande de changement exceptionnel.';
    } else if (input.includes('informatique') || input.includes('it') || input.includes('mot de passe')) {
      responseText = 'Le support informatique local est joignable au poste 4000. Pour les réinitialisations de mot de passe, un lien libre-service est activé dans vos paramètres.';
    } else {
      responseText = 'Je suis votre assistant virtuel RH. Vous pouvez me poser des questions sur vos primes, vos paies, vos horaires, etc. Souhaitez-vous contacter un spécialiste humain ?';
    }

    dispatch({
      type: 'SUBMIT_CHAT',
      payload: {
        candidateId: 'amelie',
        text: chatInput,
        response: responseText,
      },
    });
    setChatInput('');
  };

  const handleEscalateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'ESCALATE_TICKET', payload: { candidateId: 'amelie' } });
    setShowTicketForm(false);
    setTicketDesc('');
  };

  const handleDay1Activate = () => {
    dispatch({ type: 'ACTIVATE_DAY_1' });
  };

  const handleSignUniform = () => {
    setShowUniformModal(false);
    dispatch({ type: 'SIGN_UNIFORM', payload: { candidateId: 'amelie' } });
  };

  const handleWatchVideo = () => {
    setShowVideoModal(false);
    dispatch({ type: 'WATCH_VIDEO', payload: { candidateId: 'amelie' } });
  };

  return (
    <PhoneFrame headerTitle={c.status === 'Pending' ? 'Unilabs - Offre' : 'Portail Employé'}>
      <div className="p-4 flex flex-col gap-4">
        {/* Not Authenticated but Accepted */}
        {!c.isAuthenticated && c.status !== 'Pending' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-6 text-center mt-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              {isLoggingIn ? (
                <ScanFace className="text-[#C74634] animate-pulse" size={40} />
              ) : (
                <ScanFace className="text-gray-400" size={40} />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentification</h2>
            <p className="text-sm text-gray-500 mb-8">Veuillez vous authentifier pour accéder à votre espace employé sécurisé.</p>
            <button 
              onClick={handleLogin} 
              disabled={isLoggingIn} 
              className="w-full bg-[#C74634] text-white py-3 rounded-xl font-medium shadow-sm hover:bg-red-800 transition active:scale-95 disabled:opacity-70"
            >
              {isLoggingIn ? 'Vérification FaceID...' : 'Connexion FaceID'}
            </button>
          </motion.div>
        )}

        {/* State: Pending Offer */}
        {c.status === 'Pending' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Résumé de l'Offre</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Rémunération de base</span>
                <span className="font-medium text-gray-800">{c.offerDetails.baseComp}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Prime de quart</span>
                <span className="font-medium text-gray-800">{c.offerDetails.shiftPremium}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Indemnités locales</span>
                <span className="font-medium text-gray-800">{c.offerDetails.allowances}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-500">Date de début</span>
                <span className="font-medium text-gray-800">{c.offerDetails.startDate}</span>
              </div>
            </div>
            <button
              onClick={handleAccept}
              disabled={isSigning}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[#C74634] text-white py-3 rounded-xl font-medium hover:bg-red-800 transition shadow-sm active:scale-95 disabled:opacity-80"
            >
              {isSigning ? (
                <><ScanFace className="animate-pulse" size={20} /> Collecte de la signature...</>
              ) : (
                <><Fingerprint size={20} /> Accepter & Signer</>
              )}
            </button>
          </motion.div>
        )}

        {/* State: Offer Accepted (Not Cleared yet) */}
        {c.isAuthenticated && c.status === 'Offer Accepted' && !c.day1Activated && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 p-5 rounded-2xl border border-green-200 flex flex-col items-center text-center">
            <CheckCircle2 className="text-green-600 mb-2" size={32} />
            <h2 className="font-semibold text-green-800">Offre acceptée</h2>
            <p className="text-sm text-green-700 mt-2">Votre dossier est en cours de traitement par notre équipe RH.</p>
          </motion.div>
        )}

        {/* State: Cleared (Pre Day-1) */}
        {c.isAuthenticated && (c.status === 'Cleared' || c.status === 'Pending Council') && !c.day1Activated && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 p-5 rounded-2xl border border-green-200 flex flex-col items-center text-center">
            <CheckCircle2 className="text-green-600 mb-2" size={32} />
            <h2 className="font-semibold text-green-800">Félicitations Amélie !</h2>
            <p className="text-sm text-green-700 mt-2 mb-4">Votre contrat CDI a été généré et accepté. En attente du premier jour.</p>
            <button 
              onClick={handleDay1Activate}
              className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 transition"
            >
              Afficher les tâches d'intégration (Jour 1)
            </button>
          </motion.div>
        )}

        {/* State: Day 1 Active */}
        {c.isAuthenticated && c.day1Activated && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Tâches Prioritaires</h3>
              <div className="space-y-4">
                
                {/* Task 1 */}
                <div className={`flex items-start gap-3 p-3 rounded-xl border ${c.uniformSigned ? 'bg-gray-50 border-gray-100' : 'bg-white border-blue-200 shadow-sm'}`}>
                  {c.uniformSigned ? (
                    <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">Politique de sécurité et uniforme</div>
                    {c.uniformSigned ? (
                      <div className="text-xs text-gray-500 mt-1">Lue et signée électroniquement. L'uniforme a été commandé à votre taille.</div>
                    ) : (
                      <div className="text-xs text-gray-500 mt-1 mb-2">Veuillez prendre connaissance de la politique de sécurité du laboratoire et configurer votre uniforme.</div>
                    )}
                    {!c.uniformSigned && (
                       <button onClick={() => setShowUniformModal(true)} className="flex items-center justify-center gap-2 w-full bg-[#FAFAFA] border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition font-medium">
                         <Fingerprint size={16}/> Examiner et signer
                       </button>
                    )}
                  </div>
                </div>
                
                {/* Task 2 */}
                <div className={`flex items-start gap-3 p-3 rounded-xl border ${c.documentVerified ? 'bg-gray-50 border-gray-100' : 'bg-white border-blue-200 shadow-sm'}`}>
                  {c.documentVerified ? (
                    <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">Certificat médical d'aptitude</div>
                    <div className="text-xs text-gray-500 mt-1 mb-2">Requis pour l'accès aux salles blanches. Veuillez uploader un scan clair avec le tampon de la clinique.</div>
                    {!c.documentVerified && (
                       <button onClick={() => setShowUploadModal(true)} className="flex items-center justify-center gap-2 w-full bg-[#FAFAFA] border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition font-medium">
                         <Upload size={16}/> Uploader le document
                       </button>
                    )}
                  </div>
                </div>

                {/* Task 3 */}
                <div className={`flex items-start gap-3 p-3 rounded-xl border ${c.videoWatched ? 'bg-gray-50 border-gray-100' : 'bg-white border-blue-200 shadow-sm'}`}>
                  {c.videoWatched ? (
                    <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">Module vidéo Biohazard L2</div>
                    {c.videoWatched ? (
                      <div className="text-xs text-gray-500 mt-1">Formation complétée. Score: 100%. Certification ajoutée à votre profil.</div>
                    ) : (
                      <div className="text-xs text-gray-500 mt-1 mb-2">Vidéos de formation en ligne requises avant l'accès au laboratoire de niveau 2.</div>
                    )}
                    {!c.videoWatched && (
                       <button onClick={() => setShowVideoModal(true)} className="flex items-center justify-center gap-2 w-full bg-[#FAFAFA] border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition font-medium">
                         <Play size={16}/> Regarder la vidéo
                       </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Badge Notification */}
            <AnimatePresence>
              {c.badgeApproved && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex gap-3 items-center">
                  <FileBadge2 className="text-blue-600" />
                  <span className="text-sm text-blue-800">Badge salle blanche approuvé par Dr. Dupont.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 30-Day Milestone */}
            <AnimatePresence>
              {c.milestone30DayReached && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-purple-50 border border-purple-200 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1">Recommandé pour vous</h4>
                  <p className="text-sm text-purple-900 font-medium">Certification avancée : Analyseur Chimique Automatisé</p>
                  <button className="mt-3 text-sm text-purple-700 font-medium flex items-center gap-1 hover:underline">
                    Démarrer le module <ChevronRight size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Chat Button */}
            <button
               onClick={() => setChatOpen(true)}
               className="absolute bottom-6 right-6 bg-[#C74634] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-transform active:scale-95 z-40"
            >
              <MessageSquare size={24} />
            </button>
          </motion.div>
        )}
      </div>

      {/* Chat Overlay */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            initial={{ y: '100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="absolute inset-0 bg-white z-50 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
          >
            <div className="bg-[#C74634] text-white p-4 flex justify-between items-center shadow-md">
              <span className="font-semibold">Assistant HR Oracle</span>
              <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white">Fermer</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 flex flex-col">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 mb-2">
                 <div className="font-semibold mb-1 flex items-center gap-1"><HelpCircle size={14}/> Exemples de questions:</div>
                 <ul className="list-disc pl-4 space-y-0.5">
                   <li>"Quand recevrai-je mon salaire ?"</li>
                   <li>"Où sont mes fiches de paie ?"</li>
                   <li>"Puis-je modifier mes horaires ?"</li>
                   <li>"Problème informatique ?"</li>
                   <li>"Prime de nuit ?" (Escalade)</li>
                 </ul>
              </div>
              <div className="text-xs text-center text-gray-400 my-2">Aujourd'hui - 11:30 PM</div>
               {state.chatLogs.amelie.map(msg => (
                 <div key={msg.id} className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                   msg.sender === 'user' ? 'bg-[#C74634] text-white rounded-br-none self-end' :
                   msg.sender === 'system' ? 'bg-orange-100 text-orange-800 border border-orange-200 self-center text-center text-xs' :
                   'bg-white text-gray-800 border border-gray-200 rounded-bl-none self-start shadow-sm'
                 }`}>
                   {msg.text}
                 </div>
               ))}
               <div ref={messagesEndRef} />
            </div>

            {state.tickets.some(t => t.candidateId === 'amelie' && t.status === 'Open') ? (
               <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                 <p className="text-sm text-yellow-800 text-center font-medium">Un spécialiste examine votre demande...</p>
                 <p className="text-xs text-yellow-600 text-center mt-1">Vous recevrez une notification d'ici peu.</p>
               </div>
            ) : showTicketForm ? (
               <div className="p-4 bg-white border-t border-gray-200 shadow-inner">
                 <div className="flex justify-between items-center mb-3">
                   <h4 className="text-sm font-semibold text-gray-800">Ouvrir un ticket d'assistance</h4>
                   <button onClick={() => setShowTicketForm(false)}><X size={16} className="text-gray-400" /></button>
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
                    <button type="submit" className="w-full bg-gray-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700">Soumettre le ticket</button>
                 </form>
               </div>
            ) : (
              <div className="p-3 bg-white border-t border-gray-100 flex flex-col gap-2 shadow-inner">
                {state.chatLogs.amelie.length > 0 && (
                  <button onClick={() => setShowTicketForm(true)} className="text-xs bg-gray-100 text-gray-600 py-2 rounded-xl mb-1 hover:bg-gray-200 font-medium">
                    Contacter un spécialiste humain (Ticket)
                  </button>
                )}
                <form onSubmit={handleChatSubmit} className="flex gap-2 relative">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Tapez un message..."
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C74634]/50"
                  />
                  <button type="submit" className="bg-[#C74634] text-white p-2 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-0 bottom-0 top-[110px] bg-black/50 z-50 p-4 pb-8 flex flex-col justify-end">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80%]">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h3 className="font-semibold text-gray-800">Politique Uniforme</h3>
                 <button onClick={() => setShowUniformModal(false)}><X size={20} className="text-gray-400"/></button>
               </div>
               <div className="p-5 overflow-y-auto flex-1 text-sm text-gray-600 space-y-4">
                 <p>Conformément aux normes d'hygiène et de sécurité, tous les employés travaillant dans les environnements de laboratoire confinés doivent porter la tenue standard Unilabs.</p>
                 <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                   Taille: L<br/>
                   Chaussures: 42<br/>
                   Lunettes: Fournies
                 </div>
                 <p>Votre signature électronique ci-dessous confirme l'exactitude de ces informations pour la commande.</p>
               </div>
               <div className="p-4 border-t border-gray-100 bg-white">
                 <button onClick={handleSignUniform} className="w-full bg-[#C74634] text-white py-3 rounded-xl font-medium shadow-sm hover:bg-red-800 active:scale-95 transition flex items-center justify-center gap-2">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-0 bottom-0 top-[110px] bg-black/90 z-50 p-4 pb-8 flex flex-col justify-center items-center">
             <button onClick={() => setShowVideoModal(false)} className="absolute top-4 right-4 text-white p-2"><X size={24}/></button>
             <div className="w-full aspect-video bg-gray-800 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center border border-gray-700">
                <Play size={48} className="text-white/50" />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-600">
                  <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 4, ease: "linear" }} className="h-full bg-red-500" />
                </div>
             </div>
             <h3 className="text-white font-medium mb-1">Prévention des risques L2</h3>
             <p className="text-gray-400 text-sm mb-8">Durée: 03:45</p>
             <button onClick={handleWatchVideo} className="bg-white text-gray-900 px-6 py-3 rounded-full font-medium shadow-lg hover:bg-gray-100 active:scale-95 transition">
               Marquer comme terminé
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-x-0 bottom-0 top-[110px] bg-black/80 z-50 p-4 pb-8 flex flex-col justify-center items-center">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl w-full p-6 flex flex-col items-center shadow-2xl">
                 {!isUploading ? (
                    <>
                       <div className="w-full aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden group hover:bg-gray-100 transition">
                          <Camera size={48} className="text-gray-400 group-hover:scale-110 transition-transform" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition"></div>
                       </div>
                       <h3 className="font-semibold text-gray-800 mb-2">Prendre une photo du document</h3>
                       <p className="text-xs text-gray-500 mb-6 text-center">Veuillez vous assurer que le document est bien cadré et lisible.</p>
                       <button onClick={handleConfirmUpload} className="w-full bg-[#C74634] text-white py-3 rounded-xl font-medium shadow-sm hover:bg-red-800 active:scale-95 transition flex items-center justify-center gap-2">
                         <Camera size={20}/> Capturer & Analyser
                       </button>
                    </>
                 ) : (
                    <div className="w-full py-8 flex flex-col items-center">
                       <div className="w-32 h-32 bg-gray-50 rounded-xl mb-6 flex flex-col items-center justify-center relative overflow-hidden shadow-inner border border-gray-200">
                           <ScanFace size={48} className="text-[#C74634] opacity-50" />
                           <motion.div
                              animate={{ y: ['-100%', '400%', '-100%'] }}
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                              className="absolute top-0 left-0 w-full h-1 bg-[#C74634] shadow-[0_0_15px_#C74634]"
                           />
                       </div>
                       <h3 className="font-semibold text-[#C74634] mb-2 flex items-center gap-2">
                         <Loader size={18} className="animate-spin" /> Analyse OCR en cours...
                       </h3>
                       <p className="text-xs text-gray-500 mt-2">Extraction des données de santé...</p>
                    </div>
                 )}
                 {!isUploading && (
                   <button onClick={() => setShowUploadModal(false)} className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-700">Annuler</button>
                 )}
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </PhoneFrame>
  );
}
