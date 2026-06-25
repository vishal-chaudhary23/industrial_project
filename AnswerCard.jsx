import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {

Brain,

FileText,

Lightbulb,

ShieldCheck,

Wrench,

AlertTriangle,

BookOpen,

ChevronDown,

ChevronUp

} from "lucide-react";

import {useState} from "react";

export default function AnswerCard({

answer

}){

const [expand,setExpand]=useState(true);

if(!answer) return null;

return(

<div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">

{/* Header */}

<div className="flex justify-between items-center px-8 py-6 border-b border-slate-800">

<div className="flex items-center gap-4">

<div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">

<Brain/>

</div>

<div>

<h2 className="text-2xl font-bold">

AI Industrial Report

</h2>

<p className="text-slate-400">

Generated using GraphRAG + Multi-Agent AI

</p>

</div>

</div>

<button

onClick={()=>setExpand(!expand)}

className="rounded-xl bg-slate-800 p-3"

>

{

expand

?

<ChevronUp/>

:

<ChevronDown/>

}

</button>

</div>

{

expand && (

<>

{/* Summary */}

<div className="grid lg:grid-cols-4 gap-5 p-8">

<Card

icon={<Brain/>}

title="AI Generated"

text="Multi-Agent Reasoning"

/>

<Card

icon={<ShieldCheck/>}

title="Evidence"

text="Graph + Vector"

/>

<Card

icon={<BookOpen/>}

title="Knowledge"

text="Industrial Memory"

/>

<Card

icon={<Lightbulb/>}

title="Recommendations"

text="Auto Generated"

/>

</div>

<div className="px-8 pb-8">

<div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white">

<ReactMarkdown remarkPlugins={[remarkGfm]}>

{answer}

</ReactMarkdown>

</div>

</div>

{/* AI Highlights */}

<div className="grid lg:grid-cols-3 gap-5 px-8 pb-8">

<div className="rounded-2xl bg-slate-800 p-6">

<div className="flex items-center gap-3 mb-4">

<Wrench className="text-cyan-400"/>

<h3 className="font-bold">

Maintenance Insights

</h3>

</div>

<p className="text-slate-400">

Historical maintenance records, preventive
maintenance recommendations and inspection
history are summarized from retrieved
industrial documents.

</p>

</div>

<div className="rounded-2xl bg-slate-800 p-6">

<div className="flex items-center gap-3 mb-4">

<ShieldCheck className="text-green-400"/>

<h3 className="font-bold">

Compliance Analysis

</h3>

</div>

<p className="text-slate-400">

Applicable standards, regulatory evidence,
compliance gaps and supporting industrial
documents are analysed automatically.

</p>

</div>

<div className="rounded-2xl bg-slate-800 p-6">

<div className="flex items-center gap-3 mb-4">

<AlertTriangle className="text-red-400"/>

<h3 className="font-bold">

Risk Intelligence

</h3>

</div>

<p className="text-slate-400">

Operational risks, recurring failures,
future risks and preventive actions
are extracted from GraphRAG and
knowledge graph relationships.

</p>

</div>

</div>

{/* Recommendation */}

<div className="mx-8 mb-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">

<div className="flex items-center gap-3">

<Lightbulb className="text-yellow-400"/>

<h3 className="font-bold text-xl">

AI Recommendation

</h3>

</div>

<p className="mt-4 text-slate-300 leading-8">

Use the extracted insights together with the
linked industrial documents before making
maintenance or operational decisions.
Recommendations are generated using
retrieved evidence from your document corpus
and knowledge graph rather than predefined
rules.

</p>

</div>

{/* Footer */}

<div className="border-t border-slate-800 px-8 py-6">

<div className="flex flex-wrap gap-3">

<span className="px-4 py-2 rounded-full bg-blue-600">

GraphRAG

</span>

<span className="px-4 py-2 rounded-full bg-green-600">

Neo4j

</span>

<span className="px-4 py-2 rounded-full bg-purple-600">

Pinecone

</span>

<span className="px-4 py-2 rounded-full bg-orange-600">

Hybrid Search

</span>

<span className="px-4 py-2 rounded-full bg-red-600">

Multi-Agent AI

</span>

</div>

<p className="text-slate-500 mt-5">

Industrial Memory Engine • AI-generated insights based only on
retrieved industrial documents and knowledge graph evidence.

</p>

</div>

</>

)

}

</div>

);

}

function Card({

icon,

title,

text

}){

return(

<div className="rounded-2xl bg-slate-800 border border-slate-700 p-6 hover:border-blue-500 transition">

<div className="flex items-center gap-3 mb-5">

<div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center">

{icon}

</div>

<div>

<h3 className="font-bold">

{title}

</h3>

</div>

</div>

<p className="text-slate-400 leading-7">

{text}

</p>

</div>

);

}