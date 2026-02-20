import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProviderComponent } from './lib/auth-context';
import { AppProvider } from './lib/context';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { CollectionPage } from './pages/CollectionPage';
import { ChefProfilePage } from './pages/ChefProfilePage';
import { MyPage } from './pages/MyPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProviderComponent>
        <AppProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/recipe/:id" element={<RecipeDetailPage />} />
              <Route path="/collection/:id" element={<CollectionPage />} />
              <Route path="/chef/:id" element={<ChefProfilePage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProviderComponent>
    </BrowserRouter>
  );
}
