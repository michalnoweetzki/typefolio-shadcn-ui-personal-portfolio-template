import { NextResponse } from "next/server";

const experienceData = [
    {
        icon: "/images/icon/tailwind-icon.svg",
        role: "Frontend Developer & UI Engineer",
        location: "Remote",
        startYear: "2023",
        endYear: "Present",
        bulletPoints: [
            "Built polished, production-ready web apps with Next.js, React, and Tailwind CSS",
            "Collaborated closely with product and design teams to ship fast, accessible interfaces",
            "Improved front-end performance and component consistency across several projects"
        ]
    },
    {
        icon: "/images/icon/asana-icon.svg",
        role: "Product Designer & Developer",
        location: "Warsaw, Poland",
        startYear: "2020",
        endYear: "2023",
        bulletPoints: [
            "Designed and developed landing pages, dashboards, and brand experiences for digital products",
            "Turned client ideas into modern interfaces with a strong focus on usability",
            "Created reusable UI patterns that sped up delivery across multiple launches"
        ]
    },
]

const educationData = [
    {
        date: "2018 - 2022",
        title: "B.Sc. in Computer Science",
        subtitle: "University of Warsaw — Warsaw, Poland"
    },
    {
        date: "2021",
        title: "UI/UX Design Certificate",
        subtitle: "Google UX Design — Coursera"
    },
    {
        date: "2020",
        title: "Frontend Development Bootcamp",
        subtitle: "General Assembly — Remote"
    }
];


const projectOverview = {
    caseStudies: [
        { name: "Astra Studio", url: "#" },
        { name: "Northstar Finance", url: "#" },
    ],
    sideProjects: [
        { name: "Design System Toolkit", url: "#" },
        { name: "Motion UI Playground", comingSoon: true },
        { name: "Portfolio CMS", comingSoon: true },
        { name: "AI Landing Page Generator", comingSoon: true },
    ]
};


export const GET = async () => {
    return NextResponse.json({
        experienceData,
        educationData,
        projectOverview
    });
};