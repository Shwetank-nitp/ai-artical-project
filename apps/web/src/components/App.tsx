"use client";

import React, { useState, useRef, useEffect } from "react";
import { Pencil, Eraser } from "lucide-react";
import DecoratedMarkdown from "./ContentMarkdown";

interface AnimationState {
  isAnimating: boolean;
  position: number;
  currentText: string;
  targetText: string;
}

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const [animation, setAnimation] = useState<AnimationState>({
    isAnimating: false,
    position: 0,
    currentText: "",
    targetText: "",
  });
  const contentRef = useRef(content);
  const optimizePendingRef = useRef(false);
  const originalContentRef = useRef("");

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.textContent = content;
    }
  }, [content]);

  const animateText = (newText: string, isErasing = false) => {
    setAnimation({
      isAnimating: true,
      position: isErasing
        ? contentRef.current.length
        : contentRef.current.length,
      currentText: contentRef.current,
      targetText: newText,
    });
  };

  useEffect(() => {
    if (!animation.isAnimating) {
      if (optimizePendingRef.current && content === "") {
        optimizePendingRef.current = false;
        handleOptimizeRequest();
      }
      return;
    }

    const updateCaretPosition = () => {
      if (!editorRef.current || !editorWrapperRef.current) return;

      const range = document.createRange();
      const sel = window.getSelection();
      const textNode = editorRef.current.childNodes[0] || editorRef.current;
      const position = Math.min(
        animation.position,
        textNode.textContent?.length || 0
      );

      try {
        range.setStart(textNode, position);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);

        const rect = range.getBoundingClientRect();
        const wrapperRect = editorWrapperRef.current.getBoundingClientRect();

        setCaretPosition({
          x:
            rect.left -
            wrapperRect.left +
            (animation.currentText.length < animation.targetText.length
              ? 25
              : -4),
          y: rect.top - wrapperRect.top + (rect.height > 24 ? 2 : -2),
        });
      } catch (e) {
        console.error("Error setting caret position:", e);
      }
    };

    const timer = setTimeout(() => {
      if (animation.currentText === animation.targetText) {
        setAnimation((prev) => ({ ...prev, isAnimating: false }));
        return;
      }

      const isErasing =
        animation.currentText.length > animation.targetText.length;

      if (isErasing) {
        setContent((prev) => prev.slice(0, -1));
        setAnimation((prev) => ({
          ...prev,
          currentText: prev.currentText.slice(0, -1),
          position: prev.position - 1,
        }));
      } else {
        const nextChar = animation.targetText[animation.position];
        setContent((prev) => prev + nextChar);
        setAnimation((prev) => ({
          ...prev,
          currentText: prev.currentText + nextChar,
          position: prev.position + 1,
        }));
      }

      updateCaretPosition();
    }, 40);

    return () => clearTimeout(timer);
  }, [animation]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      setContent("");
      contentRef.current = "";

      const response = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: title }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        fullText += decoder.decode(value);
        animateText(fullText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!content) return;
    originalContentRef.current = content;
    optimizePendingRef.current = true;
    animateText("", true);
  };

  const handleOptimizeRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: originalContentRef.current }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        fullText += decoder.decode(value);
        animateText(fullText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Article Writer
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border text-slate-900 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your article title..."
            />
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleSubmit}
              disabled={!title || isLoading || animation.isAnimating}
              className="flex-1 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Generate Article
            </button>
            <button
              onClick={handleOptimize}
              disabled={!content || isLoading || animation.isAnimating}
              className="flex-1 bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Optimize Content
            </button>
          </div>

          <div className="relative" ref={editorWrapperRef}>
            {content.length > 0 && !animation.isAnimating && (
              <DecoratedMarkdown content={content} />
            )}
            {animation.isAnimating && (
              <>
                <div
                  ref={editorRef}
                  className="min-h-[300px] text-slate-900 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 whitespace-pre-wrap leading-6 caret-transparent"
                  contentEditable
                  onInput={(e) => setContent(e.currentTarget.textContent || "")}
                  suppressContentEditableWarning
                  style={{ fontSize: "16px" }}
                />
                <div
                  className="absolute pointer-events-none transition-all duration-75"
                  style={{
                    left: `${caretPosition.x}px`,
                    top: `${caretPosition.y}px`,
                    transform: "translateY(2px)",
                  }}
                >
                  <div>
                    {animation.currentText.length >
                    animation.targetText.length ? (
                      <Eraser className="w-5 h-5 text-red-500 animate-pulse" />
                    ) : (
                      <Pencil className="w-5 h-5 text-indigo-500 animate-pulse" />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
