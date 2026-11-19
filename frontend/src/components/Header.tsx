
import {
  LayoutDashboard,
  Bell,
  ChevronDown,
  CalendarDays,
} from 'lucide-react';

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl shadow-sm px-6 py-5 mb-6">

      {/* Effet décoratif */}
      <div className="absolute -top-16 -right-10 w-56 h-56 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">

        {/* Partie gauche */}
        <div className="flex items-center gap-4">

          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-200">
            <LayoutDashboard size={27} strokeWidth={2.2} />
          </div>

          <div>
            
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">
              Tableau de bord
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Gérez et suivez toutes vos demandes en un seul endroit.
            </p>
          </div>
        </div>

        {/* Partie droite */}
        <div className="flex flex-wrap items-center gap-3">

          {/* Date */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <CalendarDays size={17} className="text-blue-600" />
            <span className="text-sm font-medium text-slate-600">
              Espace de gestion
            </span>
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="relative w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Profil */}
          <button
            type="button"
            className="flex items-center gap-3 pl-2 pr-3 py-2 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm shadow-sm">
              A
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-slate-800">
                Administrateur
              </p>
              <p className="text-xs text-slate-500">
                Gestionnaire
              </p>
            </div>

            <ChevronDown size={16} className="text-slate-400" />
          </button>

        </div>
      </div>

      {/* Barre décorative */}
      <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r from-blue-600 via-indigo-500 to-transparent opacity-70" />

    </header>
  );
}
