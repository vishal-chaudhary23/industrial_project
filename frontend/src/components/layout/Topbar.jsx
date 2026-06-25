// import {
//   Bell,
//   Search,
//   UserCircle2,
//   CalendarDays,
// } from "lucide-react";

export default function Topbar() {
  const today = new Date().toLocaleDateString();

  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur border-b border-slate-800">

      <div className="flex justify-between items-center px-8 py-5">

        {/* Left */}

        <div>

          <h1 className="text-3xl font-bold">
            Industrial Knowledge Intelligence Platform
          </h1>

          <p className="text-slate-400 mt-1">
            GraphRAG • Neo4j • Pinecone • Multi-Agent AI
          </p>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          {/* Status */}

          <div className="flex items-center gap-2 bg-green-600 px-4 py-3 rounded-xl">

            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>

            Online

          </div>
    

        </div>

      </div>

    </header>
  );
}