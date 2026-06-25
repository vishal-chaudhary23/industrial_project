import { useState } from "react";
import axios from "axios";

import {
  Cpu,
  UploadCloud,
  FileText,
  CheckCircle2,
  Activity,
  Database,
  FileSpreadsheet,
  Image,
  Mail
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";

export default function Navigation() {

  const [file,setFile]=useState(null);

  const [uploading,setUploading]=useState(false);

  const [uploadResult,setUploadResult]=useState(null);

  async function uploadDocument(){

    if(!file) return;

    const formData=new FormData();

    formData.append("file",file);

    setUploading(true);

    try{

      const res=await axios.post(

        `${API_URL}/upload`,

        formData

      );

      setUploadResult(res.data);

      alert("Document Uploaded Successfully");

      setFile(null);

    }

    catch(err){

      console.log(err);

      alert("Upload Failed");

    }

    finally{

      setUploading(false);

    }

  }

  return(

    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">

      {/* Logo */}

      <div className="px-8 py-7 border-b border-slate-800">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">

            <Cpu size={30}/>

          </div>

          <div>

            <h1 className="font-bold text-2xl">

              Industrial

            </h1>

            <p className="text-slate-400">

              Memory Engine

            </p>

          </div>

        </div>

      </div>

<div className="px-5 py-6">

    <div className="rounded-2xl bg-slate-800 border border-slate-700 p-5">

        <h3 className="text-lg font-bold mb-4">
            AI Platform
        </h3>

        <div className="space-y-3 text-sm">

            <div className="flex justify-between">
                <span className="text-slate-400">LLM</span>
                <span>Groq</span>
            </div>

            <div className="flex justify-between">
                <span className="text-slate-400">Graph DB</span>
                <span>Neo4j</span>
            </div>

            <div className="flex justify-between">
                <span className="text-slate-400">Vector DB</span>
                <span>Pinecone</span>
            </div>

            <div className="flex justify-between">
                <span className="text-slate-400">Embeddings</span>
                <span>BGE-M3</span>
            </div>

            <div className="flex justify-between">
                <span className="text-slate-400">Search</span>
                <span>Hybrid</span>
            </div>

        </div>

    </div>

</div>

      {/* Upload */}

      <div className="p-5">

        <div className="rounded-3xl bg-slate-800 border border-slate-700 p-5">

          <h2 className="font-bold text-lg mb-4">

            Universal Document Ingestion

          </h2>

          <label className="cursor-pointer">

            <input

              type="file"

              hidden

              accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.eml,.msg"

              onChange={(e)=>setFile(e.target.files[0])}

            />

            <div className="border-2 border-dashed border-slate-600 rounded-2xl p-8 text-center hover:border-blue-500 transition">

              <UploadCloud

                className="mx-auto mb-3"

                size={45}

              />

              {

                file

                ?

                file.name

                :

                "Choose Document"

              }

            </div>

          </label>

          <button

            onClick={uploadDocument}

            disabled={uploading}

            className="mt-5 w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3 font-semibold"

          >

            {

              uploading

              ?

              "Uploading..."

              :

              "Upload"

            }

          </button>
          {

            uploadResult && (

              <div className="mt-6 rounded-2xl bg-slate-900 border border-slate-700 p-5">

                <div className="flex items-center gap-2 mb-4">

                  <CheckCircle2
                    className="text-green-500"
                    size={22}
                  />

                  <h3 className="font-bold">

                    Upload Summary

                  </h3>

                </div>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between">

                    <span className="text-slate-400">

                      Parser

                    </span>

                    <span className="font-semibold">

                      {uploadResult.parser}

                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-400">

                      Chunks

                    </span>

                    <span className="font-semibold">

                      {uploadResult.chunks}

                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-400">

                      Entities

                    </span>

                    <span className="font-semibold">

                      {uploadResult.entities}

                    </span>

                  </div>

                  <div className="flex justify-between">

                    <span className="text-slate-400">

                      Relationships

                    </span>

                    <span className="font-semibold">

                      {uploadResult.relationships}

                    </span>

                  </div>

                </div>

              </div>

            )

          }
{/* 
          <div className="mt-6 rounded-2xl bg-slate-900 border border-slate-700 p-4">
        
        </div> */}

            <h3 className="font-semibold mb-1 p-4">

              Supported Documents

            </h3>

            <div className="grid grid-cols-2 gap-3">

              <div className="flex items-center gap-2">

                <FileText size={18}/>

                <span className="text-sm">

                  PDF

                </span>

              </div>

              <div className="flex items-center gap-2">

                <Image size={18}/>

                <span className="text-sm">

                  Images

                </span>

              </div>

              <div className="flex items-center gap-2">

                <FileSpreadsheet size={18}/>

                <span className="text-sm">

                  Excel

                </span>

              </div>

              <div className="flex items-center gap-2">

                <Mail size={18}/>

                <span className="text-sm">

                  Email

                </span>

              </div>

            </div>

          </div>

      </div>


    </aside>

  );

}

