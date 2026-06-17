import React from 'react';
import { useAppContext } from '../AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal } from 'lucide-react';

export function ActivityLog() {
  const { state } = useAppContext();

  return (
    <div className="fixed bottom-0 left-0 w-80 bg-gray-900 border-t border-r border-gray-800 shadow-2xl z-50 flex flex-col h-64 rounded-tr-lg">
       <div className="px-4 py-2 bg-black border-b border-gray-800 flex items-center gap-2 rounded-tr-lg">
          <Terminal size={14} className="text-green-500" />
          <span className="text-xs font-mono text-gray-400">Oracle Core Event Stream</span>
       </div>
       <div className="flex-1 overflow-y-auto p-3 flex flex-col-reverse gap-2 font-mono">
          <AnimatePresence>
            {state.activityLog.map(log => (
               <motion.div 
                 key={log.id} 
                 initial={{ opacity: 0, x: -20, height: 0 }}
                 animate={{ opacity: 1, x: 0, height: 'auto' }}
                 className="text-[11px] border-l-2 border-[#C74634] pl-2 py-1 bg-gray-800/50"
               >
                 <div className="flex justify-between text-gray-500 mb-0.5">
                   <span>{log.actor}</span>
                   <span>{log.timestamp}</span>
                 </div>
                 <div className="text-gray-300">{log.event}</div>
               </motion.div>
            ))}
          </AnimatePresence>
          {state.activityLog.length === 0 && (
             <div className="text-xs text-gray-600 text-center italic mt-4">Awaiting events...</div>
          )}
       </div>
    </div>
  );
}
