import React from 'react';
import { LegalContent } from '../../types';
import { INITIAL_LEGAL_CONTENT } from '../../constants';

interface LegalViewProps {
    legalContent?: LegalContent;
}

const LegalView: React.FC<LegalViewProps> = ({ legalContent = INITIAL_LEGAL_CONTENT }) => {
    const renderLineWithEmail = (line: string) => {
        const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
        const match = line.match(emailRegex);
        if (!match) return line;
        const [email] = match;
        const before = line.slice(0, match.index || 0);
        const after = line.slice((match.index || 0) + email.length);
        return (
            <>
                {before}
                <a
                    href={`mailto:${email.toLowerCase()}`}
                    className="text-stone-300 hover:text-red-500 transition-colors"
                >
                    {email.toUpperCase()}
                </a>
                {after}
            </>
        );
    };

    const renderBody = (text: string) => (
        text.split('\n\n').map((chunk, i) => (
            <p key={`${i}-${chunk}`} className="max-w-prose">
                {chunk.split('\n').map((line, idx) => {
                    return (
                        <React.Fragment key={`${idx}-${line}`}>
                            {renderLineWithEmail(line)}
                            {idx < chunk.split('\n').length - 1 && <br />}
                        </React.Fragment>
                    );
                })}
            </p>
        ))
    );

    return (
        <div className="pt-32 pb-40 px-6 max-w-4xl mx-auto view-transition">
            <div className="fade-in mb-24">
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tightest mb-8 leading-none uppercase text-stone-300">
                    <span className="text-red-900 mr-4">///</span>
                    {legalContent.heading}
                </h2>
                <div className="w-full h-[1px] bg-red-900/30 mb-12"></div>

                <div className="space-y-16 font-mono-machine text-xs md:text-sm leading-relaxed text-stone-500 uppercase">
                    {legalContent.sections.map((section) => (
                        <section key={section.id} className="space-y-4">
                            <h3 className="text-red-600 tracking-[0.2em] mb-4 font-bold border-l-2 border-red-900 pl-4">
                                {section.title}
                            </h3>
                            {renderBody(section.body)}
                            {section.list && section.list.length > 0 && (
                                <ul className="list-disc pl-4 space-y-2 opacity-80">
                                    {section.list.map((item, idx) => (
                                        <li key={`${section.id}-item-${idx}`}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}

                </div>

                <div className="mt-24 pt-8 border-t border-red-900/20 text-[10px] text-stone-600 font-mono-machine text-center">
                    {legalContent.footer}
                </div>
            </div>
        </div>
    );
};

export default LegalView;
