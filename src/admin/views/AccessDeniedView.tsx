import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { AdminRole } from '../../types';

interface AccessDeniedViewProps {
  currentRole: AdminRole | null;
  requiredRoles: AdminRole[];
  onNavigateDashboard: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  currentRole,
  requiredRoles,
  onNavigateDashboard
}) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-rose-950/80 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-950/50">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
        Access Denied (RBAC Protected)
      </h2>
      <p className="text-sm text-slate-500 mt-2 max-w-md">
        Your current staff role <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">[{currentRole || 'Staff'}]</span> does not possess the required security clearances for this administrative module.
      </p>

      <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 max-w-sm text-left">
        <p className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Authorized Roles for this Section:</span>
        </p>
        <ul className="list-disc list-inside space-y-0.5 text-slate-500">
          {requiredRoles.map((r) => (
            <li key={r} className="font-medium text-emerald-700">{r}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={onNavigateDashboard}
        className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087A43] hover:bg-[#066135] text-white text-xs font-bold shadow transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Executive Dashboard</span>
      </button>
    </div>
  );
};
