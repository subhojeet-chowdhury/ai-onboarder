import React from 'react';

export const getDummyDocText = (label: string) => {
  const lower = label.toLowerCase();
  
  if (lower.includes('photo') || lower.includes('foto')) {
      const isGerman = lower.includes('foto');
      const imgSrc = isGerman 
        ? "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop";

      return (
          <div className="w-48 h-48 bg-gray-200 rounded-full border-4 border-gray-300 shadow-inner flex items-center justify-center overflow-hidden mx-auto my-12">
             <img 
               src={imgSrc} 
               alt="Profile" 
               className="w-full h-full object-cover" 
               referrerPolicy="no-referrer"
               onError={(e) => {
                 e.currentTarget.onerror = null;
                 e.currentTarget.src = isGerman 
                    ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='40' fill='%2364748b' text-anchor='middle' dy='.3em'%3ESM%3C/text%3E%3C/svg%3E" 
                    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e2e8f0'/%3E%3Ctext x='50' y='50' font-family='sans-serif' font-size='40' fill='%2364748b' text-anchor='middle' dy='.3em'%3EAL%3C/text%3E%3C/svg%3E";
               }}
             />
          </div>
      );
  }

  if (lower.includes('rib') || lower.includes('iban') || lower.includes('bankverbindung')) {
    const isGerman = lower.includes('bankverbindung');
    return (
      <div className="space-y-4 text-gray-700 font-sans p-2">
        <h4 className="font-bold text-lg border-b pb-2">{isGerman ? 'BANKVERBINDUNG' : "RELEVÉ D'IDENTITÉ BANCAIRE"}</h4>
        <p><strong>{isGerman ? 'Kontoinhaber:' : 'Titulaire du compte :'}</strong> {isGerman ? 'Stefan Meier' : 'Amélie Laurent'}</p>
        <p><strong>{isGerman ? 'Bank:' : 'Domiciliation :'}</strong> {isGerman ? 'Deutsche Bank Frankfurt' : 'BNP Paribas Paris'}</p>
        <div className="p-4 bg-gray-100 rounded border border-gray-300 font-mono text-sm">
          IBAN: {isGerman ? 'DE89 3704 0044 0532 0130 00' : 'FR76 3000 4028 3712 3456 7890 123'}
          <br/>
          BIC: {isGerman ? 'DEUTDEFF' : 'BNPAFR2P'}
        </div>
      </div>
    );
  }
  
  if (lower.includes('médical') || lower.includes('aptitude') || lower.includes('medical') || lower.includes('gesundheitszeugnis')) {
     const isGerman = lower.includes('gesundheitszeugnis');
     return (
      <div className="space-y-4 text-gray-700 font-sans p-2">
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <h4 className="font-bold text-xl">{isGerman ? 'GESUNDHEITSZEUGNIS' : 'CERTIFICAT MÉDICAL'}</h4>
            <p className="text-sm text-gray-500">{isGerman ? 'Arbeitsmedizinischer Dienst' : 'Médecine du travail'}</p>
          </div>
          <div className="text-right text-sm">
            <p><strong>{isGerman ? 'Dr. Med. Klaus Wagner' : 'Dr. Emile Dubois'}</strong></p>
            <p>{isGerman ? '60313 Frankfurt am Main' : '75014 Paris'}</p>
          </div>
        </div>
        <p>
          {isGerman ? "Ich, Dr. Klaus Wagner, bestätige, heute untersucht zu haben:" : "Je soussigné, Docteur Emile Dubois, certifie avoir examiné ce jour :"}<br/>
          <strong>{isGerman ? 'Herr Stefan Meier' : 'Mme. Amélie Laurent'}</strong>
        </p>
        <p>
          {isGerman ? "Und erkläre die betroffene Person für GEEIGNET, die Position auszuüben als:" : "Et déclare l'intéressée APTE à exercer le poste de :"}<br/>
           <em>{isGerman ? 'Labortechniker' : 'Technicienne de Laboratoire'}</em>.
        </p>
        <p className="mt-8 italic text-sm">
          {isGerman ? 'Ausgestellt in Frankfurt, am 15. Juni 2026.' : 'Fait à Paris, le 15 Juin 2026.'}
        </p>
        <div className="w-40 h-20 border-2 border-blue-400 mt-4 rounded-lg flex items-center justify-center text-blue-500 font-mono text-xs font-bold rotate-[-10deg] opacity-70">
          {isGerman ? 'STEMPEL & UNTERSCHRIFT\nDr. Wagner' : 'TIMBRE & SIGNATURE\nDr. Dubois'}
        </div>
      </div>
     );
  }
  
  if (lower.includes('sécurité') || lower.includes('uniforme') || lower.includes('sicherheitsunterweisung')) {
     const isGerman = lower.includes('sicherheitsunterweisung');
     return (
      <div className="space-y-4 text-gray-700 font-sans p-2">
        <h4 className="font-bold text-lg text-center border-b pb-2 mb-4">{isGerman ? 'SICHERHEITSUNTERWEISUNG & PSA' : 'POLITIQUE DE SÉCURITÉ & UNIFORME'}</h4>
        <p className="text-sm">
          {isGerman 
            ? "Mit der Unterzeichnung dieses Dokuments verpflichtet sich der Mitarbeiter zur Einhaltung der BSL-2 Sicherheitsstandards, einschließlich des obligatorischen Tragens der PSA (Persönliche Schutzausrüstung)."
            : "En signant ce document, l'employé s'engage à respecter les normes de sécurité de niveau BSL-2, incluant le port obligatoire des EPI (Équipements de Protection Individuelle)."
          }
        </p>
        <div className="p-4 bg-red-50 border border-red-100 rounded">
          <p className="text-sm text-red-800">
            <strong>{isGerman ? 'Bestätigte Größe:' : 'Taille Confirmée :'}</strong> M<br/>
            <strong>{isGerman ? 'Sicherheitsschuhe:' : 'Chaussures de sécurité :'}</strong> {isGerman ? 'Größe 42' : 'Pointure 39'}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-12 text-right">
          {isGerman ? 'Elektronisch gelesen und bestätigt über das Unilabs Mitarbeiterportal.' : 'Lu et approuvé électroniquement via le Portail Employé Unilabs.'}
        </p>
      </div>
     );
  }
  
  if (lower.includes('règlement')) {
     return (
      <div className="space-y-4 text-gray-700 font-sans text-sm p-2">
        <h4 className="font-bold text-lg text-center border-b pb-2 mb-4">RÈGLEMENT INTÉRIEUR</h4>
        <p><strong>Article 1 : Horaires et Présence</strong></p>
        <p className="pl-4 text-gray-600">Le respect des horaires planifiés est impératif pour le bon fonctionnement des roulements en laboratoire.</p>
        <p className="mt-4"><strong>Article 2 : Casier et Vestiaire</strong></p>
        <p className="pl-4 text-gray-600">Les effets personnels doivent être déposés dans les vestiaires sécurisés de la zone périphérique D1.</p>
        <div className="mt-12 pt-4 border-t border-gray-200 text-right">
          <p><strong>Signature Numérique Validation:</strong></p>
          <p className="font-mono text-xs text-green-600 mt-1">VER_e8f9a2</p>
        </div>
      </div>
     );
  }
  
  return (
    <div className="space-y-4 text-gray-700 font-sans text-sm p-2">
        <h4 className="font-bold text-lg border-b pb-2 mb-4">{label}</h4>
        <p>Document standard généré. Les informations détaillées sont en cours d'analyse.</p>
    </div>
  );
};
