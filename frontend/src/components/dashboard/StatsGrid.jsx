import {
  FileText,
  Database,
  Network,
  Bot,
} from "lucide-react";

const cards = [
  {
    title: "Documents",
    value: "Live",
    subtitle: "Uploaded Files",
    icon: FileText,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Knowledge Graph",
    value: "Neo4j",
    subtitle: "Relationships",
    icon: Network,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Vector Store",
    value: "Pinecone",
    subtitle: "Hybrid Search",
    icon: Database,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "AI Agents",
    value: "6",
    subtitle: "Available",
    icon: Bot,
    color: "from-orange-500 to-red-500",
  },
];

export default function StatsGrid() {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

      {cards.map((card) => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-6 hover:border-blue-500 transition"
          >

            <div className="flex justify-between">

              <div>

                <p className="text-slate-400 text-sm">

                  {card.title}

                </p>

                <h2 className="text-3xl font-bold mt-2">

                  {card.value}

                </h2>

                <p className="text-slate-500 text-sm mt-1">

                  {card.subtitle}

                </p>

              </div>

              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}
              >

                <Icon size={28} />

              </div>

            </div>

          </div>

        );

      })}

    </div>
  );
}