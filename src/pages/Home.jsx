import React, { useState } from 'react'

export default function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('')
    const [outputText, setOutputText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [outputType, setOutputType] = useState(null);
    const [detectedLanguage, setDetectedLanguage] = useState('');

    const handleSummarize = async () => {
        if (!("ai" in self) || !("summarizer" in self.ai) || typeof self.ai.summarizer.create !== "function") {
            alert("Chrome AI Summarize API is not supported")
            return;
        }

        if (inputText.trim().split(/\s+/).length < 150) {
            alert("Text must be at least 150 words for summarization");
            return;
        }

        setIsLoading(true);
        setOutputType('summary');

        try {
            const summarizer = await self.ai.summarizer.create({
                model: "latest"
            });
            const summary = await summarizer.summarize(inputText);
            setOutputText(summary)
        } catch (error) {
            console.error("Summarization failed:", error);
            alert("Failed to summarize text. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDetectLanguage = async () => {
        if (!("ai" in self) || !("languageDetector" in self.ai)) {
            alert("Chrome AI Language Detector API is not available.");
            return;
        }

        setIsLoading(true);
        setOutputType('detection');

        try {
            console.log("Initializing AI Language Detector...")
            const detector = await self.ai.languageDetector.create();

            console.log("Detecting Language...")
            const results = await detector.detect(inputText);

            console.log("Detection response:", results);

            if (results.length > 0) {
                const topResult = results[0];
                setDetectedLanguage(topResult.detectedLanguage);
                setOutputText(`Detected Language: ${topResult.detectedLanguage}`);

            } else {
                alert("No language detected.");
                setDetectedLanguage(null);
            }
        } catch (error) {
            console.error("Language detection failed:", error);
            alert("Failed to detect language");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranslate = async (language) => {
        if (!("ai" in self) || !("translator" in self.ai)) {
            alert("Chrome AI Translator API is not available.");
            return;
        }

        setIsLoading(true);
        setOutputType('translation');

        try {
            if (!detectedLanguage) {
                alert("Please detect the language first before translating.")
            }
            const sourceLang = detectedLanguage;
            const supportedLanguages = ["en", "fr", "pt", "es", "tr", "ru"];
            if (!supportedLanguages.includes(sourceLang)) {
                alert(`detected language (${sourceLang} is not supported for translation)`)
                setOutputText(`Detected language (${sourceLang} is not supported.)`)
                return;
            }

            if (!supportedLanguages.includes(language)) {
                alert(`Target language (${language}) is not supported.`);
                return;
            }

            console.log(`Translating from ${sourceLang} to ${language}...`)

            const translator = await self.ai.translator.create({
                model: "latest",
                sourceLanguage: sourceLang,
                targetLanguage: language,
            });

            const translation = await translator.translate(inputText);
            setOutputText(translation);
            setIsOpen(false);
        } catch (error) {
            console.error("Translation failed:", error);
            alert("Failed to translate text.")
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };



    return (
        <main className='md:bg-gray-100 flex md:justify-center max-w-full overflow-hidden h-screen'>
            <div className='flex flex-col md:place-self-center md:mt-0 mt-12 md:w-[70%] w-screen md:h-[90%] h-[80%] bg-white p-8 rounded-lg md:shad '>
                <h1 className='text-2xl font-bold text-center text-gray-800 mb-2'>
                    Text Processor
                </h1>
                {/* Output Section */}
                <div id='output' className='md:h-60 my-7 p-4 border border-gray-300 rounded-md h-96 overflow-y-scroll'>
                    {isLoading ? "Processing..." : outputText || ""}
                </div>
                {/* Buttons */}
                <div className='flex justify-center md:justify-evenly md:space-x-[5rem] space-x-4 mb-6  md:mb-2'>
                    <button
                        onClick={handleSummarize}
                        className={`px-2 py-2 md:w-[8rem] w-[6rem]  text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-blue-600"}`}
                        disabled={isLoading}>
                        Summarize
                    </button>
                    <button
                        onClick={handleDetectLanguage}
                        className={`px-2 md:px-6 py-2 md:w-[8rem] w-[6rem] text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-blue-600"}`}
                        disabled={isLoading}>
                        Detect Language
                    </button>
                    <div className='relative inline-block text-left'>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className=' text-center h-20 px-2 py-2 md:w-[8rem] w-[6rem] bg-red-500 text-white 
                       rounded-md hover:bg-blue-600 
                       focus:outline-none focus:ring 
                       focus:ring-blue-400'
                        >
                            Translate
                        </button>
                        {isOpen && (
                            <div className='absolute left-0 text-center bottom-full mb-2 w-[8rem] bg-gray-200 rounded-md'>
                                {['en', 'fr', 'pt', 'es', 'tr', 'ru'].map(lang => (
                                    <a key={lang} onClick={() => handleTranslate(lang)} className='block px-2  py-2 hover:bg-gray-100 cursor-pointer'>
                                        {lang.toUpperCase()}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* Input Section */}
                <textarea id="textInput"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className='w-full md:h-20 h-30  md:my-4 p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:ring-blue-400 '
                ></textarea>

            </div>

        </main>
    )
}
