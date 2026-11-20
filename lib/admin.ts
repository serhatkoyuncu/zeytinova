import { env } from 'cloudflare:workers';
import {getChatGPTUser} from '../app/chatgpt-auth';
export async function isAdmin(){const user=await getChatGPTUser();const email=(env as unknown as {ADMIN_EMAIL?:string}).ADMIN_EMAIL;return !!(email&&user&&user.email.toLowerCase()===email.toLowerCase());}
