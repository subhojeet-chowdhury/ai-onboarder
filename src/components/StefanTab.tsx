import React from 'react';
import { useAppContext } from '../AppContext';
import { PhoneFrame } from './PhoneFrame';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, FileText, ScanFace, Fingerprint } from 'lucide-react';
import { useState } from 'react';

export function StefanTab() {
  const { state, dispatch } = useAppContext();
  const c = state.candidates.stefan;
  
  const [isSigning, setIsSigning] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAccept = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      dispatch({ type: 'ACCEPT_OFFER', payload: { candidateId: 'stefan' } });
    }, 2000);
  };
  
  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      dispatch({ type: 'LOGIN', payload: { candidateId: 'stefan' } });
    }, 1500);
  };

  return (
    <PhoneFrame headerTitle={c.status === 'Pending' ? 'Unilabs - Angebot' : 'Mitarbeiterportal'}>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentifizierung</h2>
            <p className="text-sm text-gray-500 mb-8">Bitte authentifizieren Sie sich, um auf Ihr gesichertes Mitarbeiterportal zuzugreifen.</p>
            <button 
              onClick={handleLogin} 
              disabled={isLoggingIn} 
              className="w-full bg-[#C74634] text-white py-3 rounded-xl font-medium shadow-sm hover:bg-red-800 transition active:scale-95 disabled:opacity-70"
            >
              {isLoggingIn ? 'FaceID prüfen...' : 'FaceID Login'}
            </button>
          </motion.div>
        )}

        {c.status === 'Pending' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Angebotsübersicht</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Grundgehalt</span>
                <span className="font-medium text-gray-800">{c.offerDetails.baseComp}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Schichtzulage</span>
                <span className="font-medium text-gray-800">{c.offerDetails.shiftPremium}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Lokale Zulagen</span>
                <span className="font-medium text-gray-800">{c.offerDetails.allowances}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-500">Startdatum</span>
                <span className="font-medium text-gray-800">{c.offerDetails.startDate}</span>
              </div>
            </div>
            <button
              onClick={handleAccept}
              disabled={isSigning}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-[#C74634] text-white py-3 rounded-xl font-medium hover:bg-red-800 transition shadow-sm active:scale-95 disabled:opacity-80"
            >
              {isSigning ? (
                <><ScanFace className="animate-pulse" size={20} /> Signatur wird erfasst...</>
              ) : (
                <><Fingerprint size={20} /> Akzeptieren & Signieren</>
              )}
            </button>
          </motion.div>
        )}

        {c.isAuthenticated && c.status === 'Offer Accepted' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Clock className="text-gray-500" />
            </div>
            <h2 className="font-semibold text-gray-800">Angebot angenommen</h2>
            <p className="text-sm text-gray-600 mt-2">Wird verarbeitet...</p>
          </motion.div>
        )}

        {c.isAuthenticated && c.status === 'Pending Council' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-amber-50 p-5 rounded-2xl border border-amber-200 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
              <Clock className="text-amber-600" />
            </div>
            <h2 className="font-semibold text-amber-800 mb-2">Ausstehende Betriebsratsfreigabe</h2>
            <p className="text-sm text-amber-700">
              Ihr Vertrag wird derzeit gemäß den lokalen arbeitsrechtlichen Bestimmungen vom Betriebsrat geprüft.
            </p>
          </motion.div>
        )}

        {c.isAuthenticated && c.status === 'Cleared' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="bg-green-50 p-5 rounded-2xl border border-green-200 text-center">
              <CheckCircle2 className="text-green-600 mb-2 mx-auto" size={32} />
              <h2 className="font-semibold text-green-800 mb-1">Willkommen Stefan!</h2>
              <p className="text-sm text-green-700">Vertrag freigegeben und geliefert.</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <FileText className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-800">Krankenkasse Formular</h4>
                <p className="text-xs text-gray-500">Bitte konfigurieren Sie Ihre Versicherung.</p>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </PhoneFrame>
  );
}
