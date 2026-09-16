import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {title:'RevenueOS Dental | AI Growth System',description:'Independent concept demonstrating an AI-powered patient acquisition and revenue operating system for modern dental clinics.'};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}