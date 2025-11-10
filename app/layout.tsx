import type { Metadata } from 'next';import './globals.css';
export const metadata: Metadata={title:'مسابقة — منصة وطنية',description:'منصة وطنية للمسابقات'};
export default function RootLayout({children}:{children:React.ReactNode}){
 return(<html lang='ar' dir='rtl'><body>{children}
 <script dangerouslySetInnerHTML={{__html:`if('serviceWorker'in navigator){addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))}`}}/></body></html>);
}