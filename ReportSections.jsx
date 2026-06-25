import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {

Settings,

Shield,

AlertTriangle,

BookOpen,

Wrench,

ClipboardList,

Brain,

FileText

} from "lucide-react";

const icons={

"Equipment Overview":<Settings className="text-blue-400"/>,

"Historical Failures":<AlertTriangle className="text-red-400"/>,

"Applicable Standards":<Shield className="text-green-400"/>,

"Compliance":<Shield className="text-green-400"/>,

"Operational Risks":<AlertTriangle className="text-yellow-400"/>,

"Maintenance Recommendations":<Wrench className="text-cyan-400"/>,

"Recommendations":<ClipboardList className="text-cyan-400"/>,

"Lessons Learned":<BookOpen className="text-orange-400"/>,

"Root Cause Analysis":<Brain className="text-purple-400"/>,

"Related Documents":<FileText className="text-pink-400"/>

};

export default function ReportSections({

answer

}){

if(!answer) return null;

const parts=answer.split("## ").filter(Boolean);

return(

<div className="space-y-6">

{

parts.map((section,index)=>{

const lines=section.split("\n");

const title=lines[0].trim();

const content=lines.slice(1).join("\n");

return(

<div

key={index}

className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-blue-500 transition-all duration-300"

>

<div className="flex items-center justify-between px-8 py-5 border-b border-slate-800">

<div className="flex items-center gap-4">

<div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">

{

icons[title]

??

<Brain className="text-blue-400"/>

}

</div>

<div>

<h2 className="text-2xl font-bold">

{title}

</h2>

<p className="text-slate-400 text-sm">

Industrial Intelligence

</p>

</div>

</div>

<div className="px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30">

AI Generated

</div>

</div>

<div className="p-8">

<div className="prose prose-invert max-w-none

prose-headings:text-white

prose-p:text-slate-300

prose-li:text-slate-300

prose-strong:text-cyan-400

prose-h1:text-4xl

prose-h2:text-3xl

prose-h3:text-2xl">

<ReactMarkdown

remarkPlugins={[remarkGfm]}

>

{content}

</ReactMarkdown>

</div>

</div>

</div>

);

})

}

{

parts.length===0 && (

<div className="rounded-3xl bg-slate-900 border border-slate-800 p-16 text-center">

<Brain

size={60}

className="mx-auto text-blue-500 mb-5"

/>

<h2 className="text-2xl font-bold">

No Report Generated

</h2>

<p className="text-slate-400 mt-3">

Ask a question to generate an Industrial Intelligence Report.

</p>

</div>

)

}

</div>

);

}