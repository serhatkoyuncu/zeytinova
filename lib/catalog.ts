export type Product={id:string;name:string;size:string;description:string;price:number;stock:number;active:number;kind:string};
export const samples:Product[]=[
{id:'erken-500',name:'Erken Hasat',size:'500 ml',description:'Sofranın en yalın hâli için. Salatalar ve soğuk sunumlarla buluşturun.',price:49000,stock:24,active:1,kind:'bottle'},
{id:'klasik-1000',name:'Sofra Serisi',size:'1 L',description:'Gündelik mutfağın vazgeçilmezi. Sıcak yemeklerden taze ekmeğe.',price:79000,stock:18,active:1,kind:'bottle'},
{id:'aile-3000',name:'Mutfak Serisi',size:'3 L',description:'Paylaşılan sofralar ve mutfakta daha uzun süren keyif için.',price:219000,stock:12,active:1,kind:'tin'}];
export const money=(n:number)=>new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format(n/100);
