"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderOpen,
  FileText,
  Coffee,
  Lightbulb,
  Ruler,
  Compass,
} from "lucide-react";
import React from "react";

interface Project {
  id: string;
  name: string;
  lastOpened: string;
}

interface DesktopHeroProps {
  lastProjects?: Project[];
  openFolder: () => void;
}

export function Onboarding({
  lastProjects,
  openFolder,
}: DesktopHeroProps = {}) {
  const [lampOn, setLampOn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setLampOn((prev) => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 text-gray-800 overflow-hidden bg-gray-100">
      <div className="absolute inset-0 bg-grid-black-100/20"></div>
      <div
        className={`absolute inset-0 bg-gradient-radial from-white/40 to-transparent transition-opacity duration-1000 ${lampOn ? "opacity-100" : "opacity-0"}`}
        style={{ backgroundSize: "50% 50%", backgroundPosition: "50% 40%" }}
      ></div>

      <div className="relative w-full max-w-5xl z-10">
        <div className="relative mb-16">
          <div className="absolute inset-0 border-4 border-gray-300 opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-px bg-gray-400 opacity-50"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-px h-3/4 bg-gray-400 opacity-50"></div>
          </div>

          <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold text-center typography-title relative">
            <span className="absolute inset-0 text-transparent">
              The Desktop
            </span>
            <span
              className="absolute inset-0 text-transparent"
              style={{
                WebkitTextStroke: "1px #4a5568",
                textStroke: "1px #4a5568",
              }}
            >
              The Desktop
            </span>
            <span
              className="relative z-10 text-transparent"
              style={{
                WebkitTextStroke: "1px #718096",
                textStroke: "1px #718096",
              }}
            >
              The Desktop
            </span>
          </h1>
          <p className="text-center text-gray-600 mt-4 font-mono text-sm">
            v1.0
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white border border-gray-700"
            onClick={() => {
              openFolder();
            }}
          >
            <FolderOpen className="mr-2 h-5 w-5" />
            Open a folder
          </Button>

          {lastProjects && lastProjects.length > 0 && (
            <div className="w-full mt-8">
              <h2 className="text-2xl font-serif font-semibold mb-4 text-gray-800">
                Recent Projects
              </h2>
              <ul className="space-y-2">
                {lastProjects.map((project) => (
                  <li key={project.id}>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-mono text-sm"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="flex-grow">{project.name}</span>
                      <span className="text-xs text-gray-500">
                        {project.lastOpened}
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
