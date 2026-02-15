// eslint-disable-next-line no-unused-vars
import * as React from "react"
import { WordCloud, AnimatedWordRenderer } from "@isoterik/react-word-cloud";

const WordCloudComponent = () => {
    const [dimensions, setDimensions] = React.useState({ width: 800, height: 400 });

    React.useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight * 0.3
            });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const words = [
        { text: "JavaScript", value: 1200 },
        { text: "NodeJS", value: 1100 },
        { text: "React", value: 1000 },
        { text: "React Native", value: 500 },
        { text: "TypeScript", value: 1000 },
        { text: "Azure", value: 1000 },
        { text: "DevOps", value: 1000 },
        { text: "Cloud", value: 500 },
        { text: "NestJS", value: 800 },
        { text: "Gatsby", value: 700 },
        { text: "Astro", value: 600 },
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
        { text: "Frontend", value: 500 },
        { text: "Security", value: 700 },
        { text: "Cybersecurity", value: 700 },
        { text: "Collaboration", value: 850 },
        { text: "Problem Solving", value: 1000 },
        { text: "VBA", value: 700 },
    ];

    const animatedWordRenderer = (data: any, ref: any) => (
        <AnimatedWordRenderer ref={ref} data={data} animationDelay={(_word, index) => index * 100} />
    );

    const resolveFont = (word: any, _index: any) => {
        return Math.sqrt(word.value) * 1.5;
    };

    return (
        <div className="WordCloudComponent" >
            <div className="outer-border">
                <div className="mid-border">
                    <div className="inner-border">
                        <WordCloud words={words}
                            width={dimensions.width} height={dimensions.height}
                            fontSize={resolveFont}
                            renderWord={animatedWordRenderer}
                            spiral="archimedean" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WordCloudComponent;