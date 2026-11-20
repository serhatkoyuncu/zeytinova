import {env} from 'cloudflare:workers';
import {isAdmin} from '../../../lib/admin';
import {samples} from '../../../lib/catalog';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){const admin=new URL(request.url).searchParams.has('admin');if(admin&&!(await isAdmin()))return json({error:'Yönetici yetkisi gerekiyor.'},403);const db=env.DB!;const products=await db.prepare(admin?'SELECT * FROM products':'SELECT * FROM products WHERE active=1').all();const orders=admin?(await db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()).results:[];return json({products:products.results,orders});}
export async function POST(request:Request){
try{
if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Geçersiz istek.'},403);
const data=await request.json() as any;const db=env.DB!;
if(data.action!=='order'&&!(await isAdmin()))return json({error:'Yönetici yetkisi gerekiyor.'},403);
if(data.action==='seed'){await db.batch(samples.map(p=>db.prepare('INSERT OR IGNORE INTO products(id,name,size,description,price,stock,active,kind) VALUES(?,?,?,?,?,?,?,?)').bind(p.id,p.name,p.size,p.description,p.price,p.stock,p.active,p.kind)));return json({ok:true});}
if(data.action==='product'){const p=data.product;if(!p||typeof p.name!=='string'||!p.name.trim()||p.name.length>120||typeof p.size!=='string'||p.size.length>30||typeof p.description!=='string'||p.description.length>1000||!Number.isSafeInteger(p.price)||p.price<100||p.price>100000000||!Number.isSafeInteger(p.stock)||p.stock<0||p.stock>1000000||!['bottle','tin'].includes(p.kind))return json({error:'Ürün alanlarını kontrol edin.'},400);const id=p.id||crypto.randomUUID();await db.prepare('INSERT INTO products(id,name,size,description,price,stock,active,kind) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,size=excluded.size,description=excluded.description,price=excluded.price,stock=excluded.stock,active=excluded.active,kind=excluded.kind').bind(id,p.name.trim(),p.size,p.description,p.price,p.stock,p.active?1:0,p.kind).run();return json({ok:true});}
if(data.action==='status'){if(!['Yeni','Hazırlanıyor','Kargoda','Tamamlandı'].includes(data.status))return json({error:'Geçersiz durum.'},400);await db.prepare('UPDATE orders SET status=? WHERE id=?').bind(data.status,data.id).run();return json({ok:true});}
if(data.action==='order'){
for(const [key,max] of [['customer',100],['email',200],['phone',30],['address',1000]] as const)if(typeof data[key]!=='string'||!data[key].trim()||data[key].length>max)return json({error:'İletişim ve teslimat bilgilerini eksiksiz doldurun.'},400);
if(!/^\S+@\S+\.\S+$/.test(data.email)||data.phone.replace(/\D/g,'').length<10)return json({error:'E-posta veya telefon geçersiz.'},400);
if(typeof data.requestId!=='string'||data.requestId.length>80)return json({error:'Geçersiz sipariş.'},400);
const existing=await db.prepare('SELECT id FROM orders WHERE request_id=?').bind(data.requestId).first();if(existing)return json({ok:true,id:existing.id});
if(!Array.isArray(data.items)||!data.items.length||data.items.length>20)return json({error:'Sepet boş veya geçersiz.'},400);
const ids=new Set();const items=[];let total=0;for(const i of data.items){if(typeof i.id!=='string'||ids.has(i.id)||!Number.isInteger(i.quantity)||i.quantity<1||i.quantity>20)return json({error:'Geçersiz ürün adedi.'},400);ids.add(i.id);const p=await db.prepare('SELECT * FROM products WHERE id=? AND active=1').bind(i.id).first<any>();if(!p||p.stock<i.quantity||p.price!==i.price)return json({error:'Fiyat veya stok değişti. Sayfayı yenileyip sepeti kontrol edin.'},409);items.push({id:p.id,name:p.name,size:p.size,price:p.price,quantity:i.quantity});total+=p.price*i.quantity;}
const id='ZV-'+crypto.randomUUID().slice(0,8).toUpperCase();
// A single D1 batch is transactional. A CHECK constraint aborts all stock updates on concurrent overselling.
await db.batch([...items.map(i=>db.prepare('UPDATE products SET stock=stock-? WHERE id=?').bind(i.quantity,i.id)),db.prepare('INSERT INTO orders(id,customer,email,phone,address,items,total,status,created_at,request_id) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(id,data.customer.trim(),data.email.trim(),data.phone.trim(),data.address.trim(),JSON.stringify(items),total,'Yeni',new Date().toISOString(),data.requestId)]);
return json({ok:true,id});}
return json({error:'Geçersiz işlem.'},400);
}catch(error){console.error('Shop operation failed',error);return json({error:'İşlem tamamlanamadı. Stokları kontrol edip tekrar deneyin.'},409);}}
