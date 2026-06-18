import React from "react";
import { useAppContext } from "../AppContext";
import { PhoneFrame } from "./PhoneFrame";
import { motion } from "motion/react";
import {
  CheckCircle2,
  Clock,
  FileText,
  ScanFace,
  Fingerprint,
} from "lucide-react";
import { useState } from "react";

export function StefanTab() {
  const { state, dispatch } = useAppContext();
  const c = state.candidates.stefan;

  const [isSigning, setIsSigning] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
        <div className="p-4 flex flex-col gap-4">
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

          {c.isAuthenticated && c.status === "Offer Accepted" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Clock className="text-gray-500" />
              </div>
              <h2 className="font-semibold text-gray-800">
                Angebot angenommen
              </h2>
              <p className="text-sm text-gray-600 mt-2">Wird verarbeitet...</p>
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
        </div>
      )}
    </PhoneFrame>
  );
}
