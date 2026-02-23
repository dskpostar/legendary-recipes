# Legendary Recipes

世界トップシェフのレシピを集めたサブスクリプション型レシピサービス。

## デプロイ先・サービス一覧

| サービス | URL / 場所 |
|---|---|
| **本番サイト** | https://main.d35cr2rjzi2pmy.amplifyapp.com/ |
| **GitHub** | https://github.com/dskpostar/legendary-recipes |
| **Supabase** | https://supabase.com/dashboard/project/vgofatpvfcxmujyfsbfa |
| **Stripe (テスト)** | https://dashboard.stripe.com/test/dashboard |
| **AWS Amplify** | https://us-east-1.console.aws.amazon.com/amplify/home |

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | React 19 + TypeScript + Vite + Tailwind CSS v4 |
| バックエンド / DB | Supabase (PostgreSQL + Auth + Edge Functions / Deno) |
| 決済 | Stripe (Checkout + Customer Portal + Webhook) |
| ホスティング | AWS Amplify (GitHub 連携で自動デプロイ) |

---

## ローカル開発

### セットアップ

```bash
npm install
```

`.env.local` を作成（Git 管理外・絶対にコミットしない）：

```env
VITE_SUPABASE_URL=https://vgofatpvfcxmujyfsbfa.supabase.co
VITE_SUPABASE_ANON_KEY=<Supabase → Settings → API → anon public key>
```

### 開発サーバー起動

```bash
npm run dev
# http://localhost:5173
```

---

## 本番へのデプロイ

`master` ブランチに push すると AWS Amplify が自動でビルド・デプロイする。

```bash
git add <ファイル>
git commit -m "変更内容"
git push origin master
# → Amplify が自動ビルド開始（数分で反映）
```

> **注意**: ローカルブランチは `master`、GitHub リモートは `main`。`git push origin master` で OK（`master` → `main` に push する設定済み）。

### Amplify の環境変数

Amplify コンソール → App settings → Environment variables で設定：

| 変数名 | 値 |
|---|---|
| `VITE_SUPABASE_URL` | `https://vgofatpvfcxmujyfsbfa.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key |

---

## Supabase セットアップ

### DB マイグレーション

初回のみ Supabase ダッシュボード → **SQL Editor** で実行：

```sql
-- Stripe 連携用カラム追加
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id     text UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE;

CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx
  ON profiles (stripe_customer_id);
```

ファイル: `supabase/migrations/add_stripe_columns.sql`

### Auth リダイレクト URL

Supabase → Authentication → **URL Configuration** → Redirect URLs に追加：

```
https://main.d35cr2rjzi2pmy.amplifyapp.com
http://localhost:5173
```

### Edge Functions のデプロイ

```bash
# アクセストークン: Supabase → Account (右上) → Access Tokens で発行
export SUPABASE_ACCESS_TOKEN=<your-token>

# 3関数をまとめてデプロイ
npx supabase functions deploy create-checkout-session --project-ref vgofatpvfcxmujyfsbfa --no-verify-jwt
npx supabase functions deploy create-portal-session   --project-ref vgofatpvfcxmujyfsbfa --no-verify-jwt
npx supabase functions deploy stripe-webhook          --project-ref vgofatpvfcxmujyfsbfa --no-verify-jwt
```

> `--no-verify-jwt` は必須。関数内部で独自に JWT 検証しているため。

### Edge Functions のシークレット

Supabase → Edge Functions → **Secrets** で設定（または下記 CLI）：

| キー | 取得元 |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys → Secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → エンドポイント → Signing secret |
| `STRIPE_PRO_PRICE_ID` | `price_1T3c9fClD5TphyPXWxCjQ1EU` |
| `STRIPE_ELITE_PRICE_ID` | `price_1T3cAUClD5TphyPX0jAQ8vfT` |

```bash
# CLI で設定する場合
export SUPABASE_ACCESS_TOKEN=<your-token>
npx supabase secrets set STRIPE_SECRET_KEY=sk_... --project-ref vgofatpvfcxmujyfsbfa
npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_... --project-ref vgofatpvfcxmujyfsbfa
npx supabase secrets set STRIPE_PRO_PRICE_ID=price_1T3c9fClD5TphyPXWxCjQ1EU --project-ref vgofatpvfcxmujyfsbfa
npx supabase secrets set STRIPE_ELITE_PRICE_ID=price_1T3cAUClD5TphyPX0jAQ8vfT --project-ref vgofatpvfcxmujyfsbfa
```

---

## Stripe セットアップ

### Webhook エンドポイント

Stripe → Developers → **Webhooks** → エンドポイントを追加：

- **URL**: `https://vgofatpvfcxmujyfsbfa.supabase.co/functions/v1/stripe-webhook`
- **リッスンするイベント**:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

### プラン・Price ID

| プラン | 価格 | Price ID (テスト) |
|---|---|---|
| Pro | $19/月 | `price_1T3c9fClD5TphyPXWxCjQ1EU` |
| Elite | $49/月 | `price_1T3cAUClD5TphyPX0jAQ8vfT` |

### テスト用カード

| カード番号 | 結果 |
|---|---|
| `4242 4242 4242 4242` | 決済成功 |
| `4000 0000 0000 0002` | 決済失敗 |

有効期限・CVV・郵便番号は任意の値で OK。

---

## プラン構成

| プラン | 価格 | 内容 |
|---|---|---|
| Free | $0 | 無料レシピ、いいね・コメント、シェフフォロー |
| Pro | $19/月 | Free + Pro レシピ、限定テクニック |
| Elite | $49/月 | Pro + Elite レシピ、Bocuse d'Or コレクション、先行アクセス |

---

## ディレクトリ構成

```
legendary-recipes/
├── src/
│   ├── components/        # UI コンポーネント
│   │   ├── auth/          # 認証 (UserMenu, AuthModal)
│   │   ├── chef/          # シェフカード
│   │   ├── layout/        # Header, Footer
│   │   └── recipe/        # RecipeCard, RecipeGrid, CommentSection
│   ├── lib/
│   │   ├── supabase.ts    # Supabase クライアント初期化
│   │   ├── auth-context.tsx  # 認証コンテキスト
│   │   ├── context.tsx    # アプリケーションデータコンテキスト
│   │   ├── access.ts      # プランごとのアクセス制御
│   │   └── types.ts       # 型定義
│   └── pages/
│       ├── MyPage.tsx     # マイページ (プラン管理・Stripe)
│       └── ...
├── supabase/
│   ├── functions/
│   │   ├── create-checkout-session/  # Stripe Checkout セッション作成
│   │   ├── create-portal-session/    # Stripe Customer Portal
│   │   └── stripe-webhook/           # Webhook 受信 → プラン更新
│   └── migrations/
│       └── add_stripe_columns.sql    # Stripe 用 DB カラム追加
├── .env.local             # ローカル環境変数 (Git 管理外)
└── README.md
```
