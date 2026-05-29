"use client";

import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";

import api from "@/lib/api";

interface Course {
  id: string;
  name: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  PG: "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950 dark:text-primary-300",
  UG: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
};

export function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    api.get("/api/content/courses").then(res => {
      setCourses(Array.isArray(res.data) ? res.data : []);
    }).catch(console.error);
  }, []);

  if (courses.length === 0) return null;

  return (
    <section className="py-section bg-[var(--bg-secondary)]">
      <div className="container-academic">
        <div className="mb-14">
          <div className="accent-line">
            <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Pedagogy</p>
          </div>
          <h2 className="font-display text-display-md text-[var(--text-primary)]">
            Courses Taught
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, i) => (
            <div
              key={course.id}
              className="card-base p-5 flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500 transition-colors">
                  <FileText className="w-4 h-4 text-primary-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-medium text-[var(--text-soft)]">{course.name}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${categoryColors[course.category] || categoryColors.UG}`}>
                {course.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}