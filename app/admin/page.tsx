import {isAdmin} from '../../lib/admin';
import {getChatGPTUser,chatGPTSignInPath} from '../chatgpt-auth';
import Admin from './panel';
export const dynamic='force-dynamic';
export default async function Page(){if(await isAdmin())return <Admin/>;const user=await getChatGPTUser();return <main className="access"><a className="logo" href="/">zeytinova<span>ZEYTİNYAĞI</span></a><h1>Yönetici girişi</h1><p>{user?'Bu hesabın yönetici yetkisi bulunmuyor. Yetkili ChatGPT hesabınızla giriş yapın.':'Paneli açmak için yetkili ChatGPT hesabınızla giriş yapın.'}</p><a className="btn" href={chatGPTSignInPath('/admin')} target="_top">ChatGPT ile giriş yap</a><a href="/">Mağazaya dön</a></main>}
