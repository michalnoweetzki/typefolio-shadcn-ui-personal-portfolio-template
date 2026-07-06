import { NextResponse } from "next/server";

const featureWork = [
    {
        title: "Modern Portfolio for a Creative Agency",
        description: "Crafted a polished, high-performance website experience that highlighted services, case studies, and a strong visual identity.",
        roles: ["Frontend Developer", "UI Designer"],
        image: "/images/feature-work/feature-img-1.png"
    },
    {
        title: "Dashboard Redesign for a SaaS Product",
        description: "Delivered a cleaner information architecture and design system update that improved clarity, usability, and onboarding flow.",
        roles: ["Product Designer", "Developer"],
        image: "/images/feature-work/feature-img-2.png"
    }
]

export const GET = async () => {
    return NextResponse.json({
        featureWork
    });
};