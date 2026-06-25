import {
  ShieldAlert,
  Activity,
  Bot,
  FileText,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

export default function ResponseDashboard({

  response

}){

  if(!response) return null;

  const riskColor=()=>{

    switch(response.risk_level){

      case "HIGH":

        return "bg-red-500";

      case "MEDIUM":

        return "bg-yellow-500";

      default:

        return "bg-green-500";

    }

  }

  return(

<div className="grid lg:grid-cols-4 gap-6">

{/* Confidence */}

<div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">

<div className="flex justify-between">

<div>

<p className="text-slate-400">

Retrieval Confidence

</p>

<h2 className="text-4xl font-bold mt-4 text-green-400">

{response.retrieval_confidence}%

</h2>

</div>

<Activity className="text-cyan-400"/>

</div>

</div>

{/* Risk */}

<div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">

<div className="flex justify-between">

<div>

<p className="text-slate-400">

Risk Level

</p>

<div className="flex gap-3 mt-4">

<div className={`w-4 h-4 rounded-full ${riskColor()}`}/>

<h2 className="text-3xl font-bold">

{response.risk_level || "N/A"}

</h2>

</div>

</div>

<ShieldAlert className="text-red-500"/>

</div>

{response.risk_score &&

<div className="mt-6">

<div className="flex justify-between mb-2">

<span>

Risk Score

</span>

<span>

{response.risk_score}/100

</span>

</div>

<div className="w-full h-3 rounded-full bg-slate-700">

<div

className={`h-full rounded-full ${riskColor()}`}

style={{

width:`${response.risk_score}%`

}}

></div>

</div>

</div>

}

</div>
{/* Agents */}

<div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">

<div className="flex justify-between">

<div>

<p className="text-slate-400">

AI Agents

</p>

<h2 className="text-4xl font-bold mt-4">

{response.agents_used?.length || 0}

</h2>

</div>

<Bot className="text-blue-400"/>

</div>

<div className="flex flex-wrap gap-2 mt-6">

{

response.agents_used?.map((agent)=>(

<span

key={agent}

className="px-3 py-2 rounded-full bg-blue-600 text-sm font-medium"

>

{agent}

</span>

))

}

</div>

</div>

{/* Sources */}

<div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">

<div className="flex justify-between">

<div>

<p className="text-slate-400">

Source Documents

</p>

<h2 className="text-4xl font-bold mt-4">

{response.sources?.length || 0}

</h2>

</div>

<FileText className="text-yellow-400"/>

</div>

<div className="space-y-3 mt-6">

{

response.sources?.map((doc,index)=>(

<div

key={index}

className="rounded-xl bg-slate-800 px-3 py-3 flex justify-between items-center"

>

<div className="flex items-center gap-3">

<FileText size={18}/>

<span className="text-sm">

{doc.document}

</span>

</div>

<CheckCircle2

size={18}

className="text-green-500"

/>

</div>

))

}

</div>

</div>

</div>

);

}