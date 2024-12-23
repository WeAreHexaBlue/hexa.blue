"use client"

import Navigation from "../resources/components/nav"
import Footer from "../resources/components/footer"

export default function Contact() {
    return (
        <>
            <Navigation />
            <div className="grid justify-items-center px-[4vw] md:pt-[10vh] pt-[20vh] pb-[3vh]">
                <h1 className="font-black text-[150%]">
                    Contact Us
                </h1>
                <div className="grid justify-items-center gap-[2vh] pt-[3vh]">
                    <div className="grid justify-items-center gap-[1vh] leading-tight">
                        <h3 className="font-semibold">
                            Support Email
                        </h3>
                        <p className="text-zinc-300 text-center text-[50%]">
                            Currently redirects to Flamey's inbox.
                        </p>
                    </div>
                    <p className="underline">
                        <a href="mailto:support@hexa.blue">
                            support@hexa.blue
                        </a>
                    </p>
                </div>
                <div className="grid justify-items-center gap-[0.25vh] pt-[2vh]">
                    <h3 className="font-semibold">
                        Discord
                    </h3>
                    <p className="underline">
                        <a href="https://discord.gg/DsARcGwwdM">
                            DsARcGwwdM
                        </a>
                    </p>
                </div>
                <div className="grid justify-items-center gap-[0.25vh] pt-[2vh]">
                    <h3 className="font-semibold">
                        BlueSky
                    </h3>
                    <p className="underline">
                        <a href="https://bsky.app/profile/hexa.blue">
                            @hexa.blue
                        </a>
                    </p>
                </div>
                <div className="grid justify-items-center gap-[0.25vh] pt-[2vh]">
                    <h3 className="font-semibold">
                        GitHub
                    </h3>
                    <p className="underline">
                        <a href="https://github.com/WeAreHexaBlue">
                            WeAreHexaBlue
                        </a>
                    </p>
                </div>
                <div className="grid justify-items-center gap-[2vh] pt-[2vh]">
                    <div className="grid justify-items-center gap-[1vh] leading-tight">
                        <h3 className="font-semibold">
                            Twitter
                        </h3>
                        <p className="text-zinc-300 text-center text-[50%]">
                            Not &quot;X&quot; until you start calling your daughter Vivian.
                        </p>
                    </div>
                    <p className="underline">
                        <a href="https://twitter.com/WeAreHexaBlue">
                            @WeAreHexaBlue
                        </a>
                    </p>
                </div>
                <div className="grid justify-items-center gap-[0.25vh] pt-[2vh]">
                    <h3 className="font-semibold">
                        dibsy
                    </h3>
                    <p>
                        <a>
                            Coming soon... ;3
                        </a>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    )
}