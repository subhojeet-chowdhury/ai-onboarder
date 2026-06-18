import React from 'react';

export const getDummyDocText = (label: string) => {
  const lower = label.toLowerCase();
  
  if (lower.includes('photo')) {
      return (
          <div className="w-48 h-48 bg-gray-200 rounded-full border-4 border-gray-300 shadow-inner flex items-center justify-center overflow-hidden mx-auto my-12">
             <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop" alt="Profile" className="w-full h-full object-cover" />
          </div>
      );
  }

  if (lower.includes('rib') || lower.includes('iban')) {
    return (
      <div className="space-y-4 text-gray-700 font-sans p-2">
        <h4 className="font-bold text-lg border-b pb-2">RELEVÉ D'IDENTITÉ BANCAIRE</h4>
        <p><strong>Titulaire du compte :</strong> Amélie Laurent</p>
        <p><strong>Domiciliation :</strong> BNP Paribas Paris</p>
        <div className="p-4 bg-gray-100 rounded border border-gray-300 font-mono text-sm">
          IBAN: FR76 3000 4028 3712 3456 7890 123
          <br/>
          BIC: BNPAFR2P
        </div>
      </div>
    );
  }
  
  if (lower.includes('médical') || lower.includes('aptitude') || lower.includes('medical')) {
     return (
      <div className="space-y-4 text-gray-700 font-sans p-2">
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <h4 className="font-bold text-xl">CERTIFICAT MÉDICAL</h4>
            <p className="text-sm text-gray-500">Médecine du travail</p>
          </div>
          <div className="text-right text-sm">
            <p><strong>Dr. Emile Dubois</strong></p>
            <p>75014 Paris</p>
          </div>
        </div>
        <p>
          Je soussigné, Docteur Emile Dubois, certifie avoir examiné ce jour :<br/>
          <strong>Mme. Amélie Laurent</strong>
        </p>
        <p>
          Et déclare l'intéressée <strong>APTE</strong> à exercer le poste de :<br/>
           <em>Technicienne de Laboratoire</em>.
        </p>
        <p className="mt-8 italic text-sm">
          Fait à Paris, le 15 Juin 2026.
        </p>
        <div className="w-40 h-20 border-2 border-blue-400 mt-4 rounded-lg flex items-center justify-center text-blue-500 font-mono text-xs font-bold rotate-[-10deg] opacity-70">
          TIMBRE & SIGNATURE<br/>Dr. Dubois
        </div>
      </div>
     );
  }
  
  if (lower.includes('sécurité') || lower.includes('uniforme')) {
     return (
      <div className="space-y-4 text-gray-700 font-sans p-2">
        <h4 className="font-bold text-lg text-center border-b pb-2 mb-4">POLITIQUE DE SÉCURITÉ & UNIFORME</h4>
        <p className="text-sm">
          En signant ce document, l'employé s'engage à respecter les normes de sécurité de niveau BSL-2, 
          incluant le port obligatoire des EPI (Équipements de Protection Individuelle).
        </p>
        <div className="p-4 bg-red-50 border border-red-100 rounded">
          <p className="text-sm text-red-800">
            <strong>Taille Confirmée :</strong> M<br/>
            <strong>Chaussures de sécurité :</strong> Pointure 39
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-12 text-right">
          Lu et approuvé électroniquement via le Portail Employé Unilabs.
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
