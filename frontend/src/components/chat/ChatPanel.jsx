import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


import {
  Send,
  ShieldAlert,
  Brain,
  FileText,
  Activity,
  Bot,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function ChatPanel() {

  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);

  const answerRef = useRef(null);

  useEffect(() => {

    if(answerRef.current){

      answerRef.current.scrollIntoView({

        behavior:"smooth"

      });

    }

  },[response]);

  async function askQuestion(){

    if(!query.trim()) return;

    setLoading(true);

    try{

      const res = await axios.post(

        `${API_URL}/chat`,

        {

          query

        }

      );

      setResponse(res.data);

    }

    catch(err){

      console.log(err);

      alert("Unable to contact backend.");

    }

    finally{

      setLoading(false);

    }

  }

  function riskColor(level){

    if(level==="HIGH") return "bg-red-500";

    if(level==="MEDIUM") return "bg-yellow-500";

    return "bg-green-500";

  }

  function confidenceColor(score){

    if(score>=80) return "text-green-400";

    if(score>=60) return "text-yellow-400";

    return "text-red-400";

  }

  return (

    <div className="space-y-8">

      {/* Ask Question */}

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">

        <h2 className="text-2xl font-bold mb-2">

          Industrial AI Copilot

        </h2>

        <p className="text-slate-400 mb-6">

          Ask maintenance, compliance, RCA, lessons learned,
          equipment history or risk assessment questions.

        </p>

        <textarea

          value={query}

          onChange={(e)=>setQuery(e.target.value)}

          placeholder="Example: Give me complete history of Pump P-101..."

          className="w-full h-36 rounded-2xl bg-slate-950 border border-slate-700 p-5 outline-none resize-none focus:border-blue-500"

        />

        <div className="flex justify-end mt-5">

          <button

            onClick={askQuestion}

            disabled={loading}

            className="flex items-center gap-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition px-6 py-3 font-semibold"

          >

            {

              loading

              ?

              <>

                <Loader2 className="animate-spin"/>

                Thinking...

              </>

              :

              <>

                <Send size={18}/>

                Ask AI

              </>

            }

          </button>

        </div>

      </div>

      {

        response && (
            

        <>
        

          Dashboard

          <div className="grid lg:grid-cols-4 gap-6">

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-slate-400">

                    Retrieval Confidence

                  </p>

                  <h2 className={`text-4xl font-bold mt-3 ${confidenceColor(response.retrieval_confidence)}`}>

                    {response.retrieval_confidence}%

                  </h2>

                </div>

                <Activity className="text-blue-400"/>

              </div>

            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-slate-400">

                    Risk Level

                  </p>

                  <div className="flex items-center gap-3 mt-3">

                    <div className={`w-4 h-4 rounded-full ${riskColor(response.risk_level)}`}></div>

                    <h2 className="text-3xl font-bold">

                      {response.risk_level ?? "N/A"}

                    </h2>

                  </div>

                </div>

                <ShieldAlert className="text-red-400"/>

              </div>

            </div>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-slate-400">

                    Active Agents

                  </p>

                  <h2 className="text-3xl font-bold mt-3">

                    {response.agents_used?.length || 0}

                  </h2>

                </div>

                <Bot className="text-green-400"/>

              </div>

              <div className="flex flex-wrap gap-2 mt-5">

                {

                  response.agents_used?.map((agent)=>(

                    <span

                      key={agent}

                      className="px-3 py-1 rounded-full bg-blue-600 text-sm"

                    >

                      {agent}

                    </span>

                  ))

                }

              </div>

            </div>

            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">

              <div className="flex justify-between">

                <div>

                  <p className="text-slate-400">

                    Sources

                  </p>

                  <h2 className="text-3xl font-bold mt-3">

                    {response.sources?.length || 0}

                  </h2>

                </div>

                <FileText className="text-yellow-400"/>

              </div>

              <div className="mt-5 space-y-2">

                {

                  response.sources?.map((doc,index)=>(

                    <div

                      key={index}

                      className="rounded-lg bg-slate-800 px-3 py-2 text-sm"

                    >

                      📄 {doc.document}

                    </div>

                  ))

                }

              </div>

            </div>

          </div>

          {/* AI REPORT */}

          <div

            ref={answerRef}

            className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden"

          >

            <div className="border-b border-slate-800 p-6">

              <div className="flex items-center gap-3">

                <Brain className="text-cyan-400"/>

                <h2 className="text-2xl font-bold">

                  AI Analysis Report

                </h2>

              </div>

            </div>

            <div className="p-8">

    <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
            h1: ({ children }) => (
                <h1 className="text-4xl font-bold text-white mb-8 border-b border-slate-700 pb-4">
                    {children}
                </h1>
            ),

            h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-blue-400 mt-10 mb-4">
                    {children}
                </h2>
            ),

            h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-cyan-300 mt-8 mb-3">
                    {children}
                </h3>
            ),

            p: ({ children }) => (
                <p className="text-slate-300 leading-8 mb-4">
                    {children}
                </p>
            ),

            strong: ({ children }) => (
                <strong className="text-white font-semibold">
                    {children}
                </strong>
            ),

            ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-2 text-slate-300 mb-5">
                    {children}
                </ul>
            ),

            ol: ({ children }) => (
                <ol className="list-decimal pl-6 space-y-2 text-slate-300 mb-5">
                    {children}
                </ol>
            ),

            li: ({ children }) => (
                <li className="leading-7">
                    {children}
                </li>
            ),

            hr: () => (
                <hr className="my-8 border-slate-700" />
            )
        }}
    >
        {response.answer}
    </ReactMarkdown>

</div>

          </div>

          {

            response.risk_score && (

            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8">

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold">

                    Operational Risk Assessment

                  </h2>

                  <p className="text-slate-400 mt-2">

                    Generated by AI from maintenance history,
                    GraphRAG and industrial documents.

                  </p>

                </div>

                <AlertTriangle
                  size={50}
                  className="text-red-500"
                />

              </div>

              <div className="mt-8">

                <div className="flex justify-between mb-3">

                  <span>

                    Overall Risk

                  </span>

                  <span className="font-bold">

                    {response.risk_score}/100

                  </span>

                </div>

                <div className="w-full h-5 rounded-full bg-slate-800 overflow-hidden">

                  <div

                    className={`h-full ${riskColor(response.risk_level)}`}

                    style={{

                      width:`${response.risk_score}%`

                    }}

                  />

                </div>

              </div>

              <div className="mt-6 flex items-center gap-3">

                {

                  response.risk_level==="HIGH"

                  ?

                  <AlertTriangle className="text-red-500"/>

                  :

                  <CheckCircle2 className="text-green-500"/>

                }

                <span className="text-xl font-semibold">

                  {response.risk_level} Risk

                </span>

              </div>

            </div>

            )

          }
          {/* Footer */}

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">

            <div className="flex justify-between items-center">

              <div>

                <h3 className="text-xl font-semibold">

                  Industrial Intelligence Summary

                </h3>

                <p className="text-slate-400 mt-2">

                  Generated using GraphRAG, Neo4j Knowledge Graph,
                  Pinecone Hybrid Search and Multi-Agent Reasoning.

                </p>

              </div>

              <div className="flex gap-3">

                <div className="px-4 py-2 rounded-xl bg-slate-800">

                  GraphRAG

                </div>

                <div className="px-4 py-2 rounded-xl bg-slate-800">

                  Neo4j

                </div>

                <div className="px-4 py-2 rounded-xl bg-slate-800">

                  Pinecone

                </div>

              </div>

            </div>

          </div>

        </>

      )

      }

      {

      !response && !loading && (

      <div className="rounded-3xl border border-dashed border-slate-700 p-16 text-center">

        <Brain

          size={70}

          className="mx-auto text-blue-500 mb-6"

        />

        <h2 className="text-3xl font-bold">

          Industrial AI Copilot

        </h2>

        <p className="text-slate-400 mt-3">

          Ask questions about maintenance history,
          compliance, RCA, lessons learned,
          equipment overview, risk assessment,
          SOPs, inspection reports and engineering
          documentation.

        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

            🛠

            <h3 className="font-semibold mt-3">

              Equipment 360

            </h3>

          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

            ⚠

            <h3 className="font-semibold mt-3">

              Risk Analysis

            </h3>

          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

            📋

            <h3 className="font-semibold mt-3">

              Compliance

            </h3>

          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">

            🔍

            <h3 className="font-semibold mt-3">

              Root Cause Analysis

            </h3>

          </div>

        </div>

      </div>

      )

      }

    </div>

  );

}