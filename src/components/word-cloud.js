// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { WordCloud, AnimatedWordRenderer } from "@isoterik/react-word-cloud";

const WordCloudComponent = () => {
    const words = [
        { text: "JavaScript", value: 1200 },
        { text: "NodeJS", value: 1100 },
        { text: "React", value: 1000 },
        { text: "TypeScript", value: 1000 },
        { text: "Azure", value: 1000 },
        { text: "DevOps", value: 1000 },
        { text: "Cloud", value: 400 },
        { text: "NestJS", value: 800 },
        { text: "C#", value: 1150 },
        { text: "SQL", value: 1200 },
        { text: "VueJS", value: 800 },
        { text: "CSS", value: 700 },
        { text: "Playwright", value: 500 },
        { text: "Cypress", value: 500 },
        { text: "Jest", value: 500 },
        { text: "Full-Stack", value: 900 },
        { text: "CI/CD", value: 700 },
        { text: "Architecture", value: 400 },
        { text: "Mentoring", value: 700 },
        { text: "Leadership", value: 500 },
        { text: "Agile", value: 700 },
        { text: "Web Accessibility", value: 850 },
        { text: "UI Design", value: 500 },
        { text: "Security", value: 700 },
        { text: "Cybersecurity", value: 700 },
        { text: "Collaboration", value: 850 },
        { text: "Problem Solving", value: 1000 },
    ];

    const gradients = [
        {
            id: "gradient1",
            type: "linear",
            stops: [
                { offset: "0%", color: "#00674F" },
                { offset: "100%", color: "#2E6F40" },
            ],
        },
        {
            id: "gradient2",
            type: "linear",
            stops: [
                { offset: "0%", color: "#05472A" },
                { offset: "100%", color: "#2C5F34" },
            ],
        },
    ];
      
    const resolveFill = (_word, index) => {
        return index % 3 === 0 ? "url(#gradient1)" : "url(#gradient2)";
    };

    const animatedWordRenderer = (data, ref) => (
        <AnimatedWordRenderer ref={ref} data={data} animationDelay={(_word, index) => index * 100} />
    );

    if (typeof window === 'undefined') {
        return <></>;
    }

    const height = window.innerHeight * 0.25; // 25% of viewport height
    const width = window.innerWidth * 0.75; // 80% of viewport width

    return (
        <div
            className="word-cloud"
            style={{
                width: width,
                height: height,
            }}
            >
            <WordCloud words={words} width={width} height={height} 
                gradients={gradients} fill={resolveFill}
                renderWord={animatedWordRenderer} />
        </div>
    );
}

export default WordCloudComponent;