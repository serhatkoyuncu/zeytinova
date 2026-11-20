# GitHub’a yükleme

1. ZIP dosyasını açın.
2. GitHub’da boş bir repository oluşturun.
3. zeytinova klasörünün içindeki bütün dosyaları yükleyin. Gizli dosyaları (.openai ve .gitignore dahil) atlamayın.

Terminal ile:

```sh
cd zeytinova
git init
git add .
git commit -m "Zeytinova mağaza ve admin paneli"
git branch -M main
git remote add origin https://github.com/KULLANICI/REPO.git
git push -u origin main
```

## Çalıştırma ve barındırma

Bu proje Vinext ve Cloudflare Workers/D1 kullanır. GitHub Pages tek başına admin panelini veya veri tabanını çalıştırmaz. GitHub kaynak kod deposu olarak kullanılabilir.

Node.js 22.13 veya üzeri gerekir; Node.js 24 LTS önerilir.

```sh
npm ci
npm run build
```

Yerel geliştirme için `.dev.vars` dosyasında `ADMIN_EMAIL=seedy@sites.test` kullanılır. Bu yalnızca yerel Sites giriş simülasyonunun hesabıdır. Üretimde ADMIN_EMAIL değerini kendi yetkili ChatGPT hesap e-postanız olarak Sites çalışma zamanı ayarlarında tanımlayın. Gizli değerleri GitHub’a yüklemeyin.

İlk yerel derleme sonrasında yerel veri tabanını hazırlayın:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_damp_swordsman.sql
npm run dev
```

`/admin` yolunu açıp yerel giriş bağlantısını kullanın. Yeni migration dosyalarını sırasıyla bir kez uygulayın. Üretim ve yerel veri tabanları ayrıdır.

`.openai/hosting.json` mevcut Sites projesinin kimliğini içerir; bir parola değildir. Bu dosya mevcut Site ile çalışmaya devam etmek içindir. Yeni ve bağımsız bir Site kaydederken mevcut kimliği tekrar kullanmayın.

Paket ürün/sipariş kayıtlarını, müşteri verilerini, erişim anahtarlarını veya bağımlılık klasörünü içermez. Veri tabanı tablolarını oluşturacak migration dosyaları dahildir.

Örnek koleksiyon görselleri temsili CSS ambalaj çizimleridir. Admin panelinden ürünlerinizi oluşturun veya örnekleri yükleyip fiyat, stok ve açıklamalarını değiştirin. Kart ödemesi yapılandırılmamıştır; sipariş talebi kaydı alınır.
