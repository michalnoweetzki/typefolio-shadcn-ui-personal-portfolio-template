"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { SiteContent } from "@/lib/site-content";

const AboutMe = () => {
  const [content, setContent] = useState<SiteContent["about"] | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/content");
      const data = await res.json();
      setContent(data.about);
    };
    load();
  }, []);
  return (
    <section>
      <div className="container">
        <div className="border-x border-border bg-[url('/images/about-me/about-me-bg.svg')] bg-cover bg-center bg-no-repeat">
          <div className="flex flex-col gap-9 sm:gap-12 max-w-3xl mx-auto px-4 sm:px-7 py-11 md:py-20">
            <div className="flex flex-col gap-4">
              <p className="text-sm tracking-[2px] text-primary uppercase font-medium">
                About Me
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px]">
                {content?.heading || "Hey there. I'm Michał — a frontend developer and UI designer based in Warsaw, creating modern web experiences that blend clean design with thoughtful engineering."}
              </h2>
              <h5 className="text-secondary font-normal">
                {content?.description || "I enjoy turning ideas into fast, elegant, and user-friendly products for startups, agencies, and ambitious brands."}
              </h5>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-primary uppercase font-medium">
                Services
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {content?.services?.map((value, index) => {
                  return (
                    <Badge
                      variant={"outline"}
                      key={index}
                      className="py-1.5 px-3 rounded-lg h-full"
                    >
                      <p className="text-xs sm:text-sm font-medium text-primary">
                        {value}
                      </p>
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
