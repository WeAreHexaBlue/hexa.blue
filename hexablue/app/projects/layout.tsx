import localFont from "next/font/local"
import "../globals.css"
import type { Metadata } from "next"

const inter = localFont({
    src: "../resources/fonts/Inter.ttf",
    variable: "--inter",
    weight: "400 500 600 700 900"
})

export const metadata: Metadata = {
    title: "Projects - HexaBlue"
}

export default function ProjectsLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <section>
            {children}
        </section>
    )
}