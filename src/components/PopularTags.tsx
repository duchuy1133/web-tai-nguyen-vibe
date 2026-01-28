'use client';

import React from 'react';
import Link from 'next/link';
import { Tag } from 'lucide-react';

const POPULAR_TAGS = [
    "Transition", "Glitch", "LUTs màu", "Premiere Pro", "After Effects",
    "Wedding", "Youtube", "Intro", "Outro", "CapCut",
    "Davinci Resolve", "Sound FX", "Typography", "3D Model", "Motion Graphics",
    "Trailer", "Review", "Vlog", "Cinematic", "Lower Thirds"
];

export default function PopularTags() {
    // Duplicate list for seamless infinite scroll
    const displayTags = [...POPULAR_TAGS, ...POPULAR_TAGS];

    return (
        <div className="w-full bg-slate-950 border-y border-slate-900 overflow-hidden">
            <div className="container mx-auto px-4 flex items-center h-12 md:h-14">

                {/* Check: Ẩn chữ "Phổ biến:" trên mobile */}
                <div className="hidden sm:flex items-center gap-2 text-slate-500 mr-4 z-10 bg-slate-950 pr-4 select-none">
                    <Tag size={16} />
                    <span className="text-sm font-medium whitespace-nowrap">Phổ biến:</span>
                </div>

                <div className="flex-1 overflow-hidden relative group">
                    {/* Gradient Edges for nice fade effect */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

                    {/* Marquee Content */}
                    <div className="flex items-center gap-3 w-max animate-scroll group-hover:[animation-play-state:paused]">
                        {displayTags.map((tag, index) => (
                            <Link
                                key={`tag-${index}`}
                                href={`/search?q=${encodeURIComponent(tag)}`}
                                className="
                                    px-4 py-1.5 rounded-full 
                                    bg-slate-900 border border-slate-800 
                                    text-slate-400 text-xs md:text-sm font-medium
                                    whitespace-nowrap
                                    hover:bg-slate-800 hover:text-white hover:border-slate-700 hover:shadow-lg hover:shadow-purple-500/10
                                    transition-all duration-300
                                "
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
