import { FileText, FileTextIcon, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setinput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return toast.error("Please upload an image.");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post(
        "/api/ai/resume-review",
        formData,
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Resume</p>

        <input
          onChange={(e) => setinput(e.target.files[0])}
          type="file"
          accept="application/pdf"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports pdf formats only
        </p>
        <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          {
            loading?
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>: <FileText className="w-5" />
          }

         
          Review Resume
        </button>
      </form>

      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <FileTextIcon className="w-5 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold"> Analysis Results</h1>
        </div>

          {
            !content?
            (
              <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <FileTextIcon className="h-9 w-9" />
            <p>upload an image to remove the background</p>
          </div>
        </div>
            ):(
              <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
                <div className="reset-tw">
                  <Markdown>{content}</Markdown>
                </div>

              </div>
            )
          }
      </div>
    </div>
  );
};

export default ReviewResume;
