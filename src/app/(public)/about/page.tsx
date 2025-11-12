// src/app/about/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Code } from "lucide-react";

// ⭐️ UPDATED TEAM MEMBER DATA ⭐️
// NOTE: Ensure /archit.png and /anupam.png are placed in your 'public' directory
const TEAM_MEMBERS = [
  { name: "Archit Rode", role: "Database Architect & Frontend Lead", image: "/archit.png" },
  { name: "Anupam G", role: "Backend Development & Logic", image: "/anupam.png" },
];

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Project Context Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <Code className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-extrabold text-gray-900">
              Project Context: QuickBite
            </h1>
          </div>
          <div className="text-lg text-gray-700 space-y-3 leading-relaxed">
            <p>
              This application, <strong>QuickBite</strong>, was developed as a comprehensive project for our <strong>Database Management Systems (DBMS) course</strong>. It demonstrates end-to-end functionality required by a modern food delivery service.
            </p>
            <p>
              Our goal was to not only build a functional, responsive frontend using <strong>Next.js and Tailwind CSS</strong>, but also to model and implement a robust database schema capable of handling user accounts, restaurants, menus, orders, and delivery tracking.
            </p>
            <p>
              The core functionality, including cart management and single-restaurant order constraints, is ready for full backend integration.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Users className="w-8 h-8 text-orange-600" />
            <h2 className="text-3xl font-extrabold text-gray-900">
              Meet the Team (2 Members)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center text-center transition hover:shadow-2xl"
              >
                {/* ⭐️ CHANGED: Rectangular Image Placeholder ⭐️ */}
                <div className="relative w-32 h-48 mb-4 overflow-hidden border-4 border-orange-500 shadow-md rounded-xl">
                    <Image
                        src={member.image}
                        alt={`Profile picture of ${member.name}`}
                        fill // Use fill to make the image cover the div, instead of fixed width/height
                        className="object-cover"
                    />
                </div>
                
                {/* Name and Role */}
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm font-medium text-orange-600 mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}