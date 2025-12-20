import React from 'react';

const LegalView: React.FC = () => {
    return (
        <div className="pt-32 pb-40 px-6 max-w-4xl mx-auto view-transition">
            <div className="fade-in mb-24">
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tightest mb-8 leading-none uppercase text-stone-300">
                    <span className="text-red-900 mr-4">///</span>
                    Legal & Privacy
                </h2>
                <div className="w-full h-[1px] bg-red-900/30 mb-12"></div>

                <div className="space-y-16 font-mono-machine text-xs md:text-sm leading-relaxed text-stone-500 uppercase">

                    {/* IMPRINT / FICHA TÉCNICA */}
                    <section className="space-y-4">
                        <h3 className="text-red-600 tracking-[0.2em] mb-4 font-bold border-l-2 border-red-900 pl-4">
                            [ 01 :: LEGAL_ENTITY_DECLARATION ]
                        </h3>
                        <p>
                            THIS DIGITAL ARTIFACT "ARCANUM VITAE" IS OPERATED BY:<br />
                            <span className="text-stone-300">CARLOS GAVELA</span><br />
                            LOCATION: PORTUGAL (EU)<br />
                            DATA CONTROLLER: CARLOS GAVELA<br />
                            CONTACT: <a href="mailto:contact@arcanumvitae.com" className="text-stone-300 hover:text-red-500 transition-colors">CONTACT@ARCANUMVITAE.COM</a>
                        </p>
                    </section>

                    {/* PRIVACY / RGPD */}
                    <section className="space-y-4">
                        <h3 className="text-red-600 tracking-[0.2em] mb-4 font-bold border-l-2 border-red-900 pl-4">
                            [ 02 :: DATA_SURVEILLANCE_POLICY ]
                        </h3>
                        <p className="max-w-prose">
                            <strong className="text-stone-400">GDPR / RGPD COMPLIANCE:</strong><br />
                            THIS SYSTEM OPERATES ON A "NO-TRACK" PHILOSOPHY.
                        </p>
                        <ul className="list-disc pl-4 space-y-2 opacity-80">
                            <li>WE DO NOT USE ANALYTICS COOKIES OR TRACKING PIXELS.</li>
                            <li>WE DO NOT COLLECT PERSONAL DATA UNLESS EXPLICITLY PROVIDED VIA CONTACT CHANNELS.</li>
                            <li>LOCAL STORAGE IS USED SOLELY FOR USER INTERFACE PREFERENCES (E.G., VOLUME, VISITED SECTIONS).</li>
                            <li>SERVER LOGS MAY RETAIN IP ADDRESSES AND USER AGENTS FOR SECURITY AND TECHNICAL DIAGNOSTICS ONLY, PURGED AUTOMATICALLY.</li>
                            <li>LEGAL BASES: CONSENT (CONTACT) AND LEGITIMATE INTEREST (SECURITY/OPERATIONS).</li>
                        </ul>
                    </section>

                    {/* RIGHTS */}
                    <section className="space-y-4">
                        <h3 className="text-red-600 tracking-[0.2em] mb-4 font-bold border-l-2 border-red-900 pl-4">
                            [ 03 :: DATA_SUBJECT_RIGHTS ]
                        </h3>
                        <p className="max-w-prose">
                            YOU MAY REQUEST ACCESS, RECTIFICATION, ERASURE, RESTRICTION, OR PORTABILITY OF YOUR DATA. YOU MAY ALSO OBJECT TO PROCESSING OR WITHDRAW CONSENT AT ANY TIME.
                        </p>
                        <p className="max-w-prose">
                            TO EXERCISE THESE RIGHTS, CONTACT: <a href="mailto:contact@arcanumvitae.com" className="text-stone-300 hover:text-red-500 transition-colors">CONTACT@ARCANUMVITAE.COM</a>
                        </p>
                    </section>

                    {/* COPYRIGHT */}
                    <section className="space-y-4">
                        <h3 className="text-red-600 tracking-[0.2em] mb-4 font-bold border-l-2 border-red-900 pl-4">
                            [ 04 :: INTELLECTUAL_PROPERTY ]
                        </h3>
                        <p className="max-w-prose">
                            ALL AUDIO, VISUAL, AND TEXTUAL CONTENT IS THE INTELLECTUAL PROPERTY OF CARLOS GAVELA UNLESS NOTED OTHERWISE.<br /><br />
                            AI AUGMENTATION DECLARATION:<br />
                            CERTAIN ELEMENTS OF THIS WORK UTILIZE GENERATIVE ALGORITHMS AS TOOLS OF EXPRESSION. THE HUMAN ARTIST RETAINS CREATIVE DIRECTION AND OWNERSHIP OF THE FINAL OUTPUT.
                        </p>
                    </section>

                    {/* DISPUTE RESOLUTION */}
                    <section className="space-y-4">
                        <h3 className="text-red-600 tracking-[0.2em] mb-4 font-bold border-l-2 border-red-900 pl-4">
                            [ 05 :: JURISDICTION ]
                        </h3>
                        <p>
                            GOVERNED BY THE LAWS OF PORTUGAL AND THE EUROPEAN UNION.
                        </p>
                    </section>

                </div>

                <div className="mt-24 pt-8 border-t border-red-900/20 text-[10px] text-stone-600 font-mono-machine text-center">
                    END_OF_PROTOCOL
                </div>
            </div>
        </div>
    );
};

export default LegalView;
