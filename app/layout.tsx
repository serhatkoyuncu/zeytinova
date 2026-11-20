import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Zeytinova | Sofranın özüne dönüş',description:'Zeytinova zeytinyağı koleksiyonu. Ürünleri keşfedin, sepetinizi oluşturun.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="tr"><body>{children}</body></html>}
