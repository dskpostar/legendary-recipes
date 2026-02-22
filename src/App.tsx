import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
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
import { AdminPage } from './pages/admin/AdminPage';
import { RecipesAdmin } from './pages/admin/RecipesAdmin';
import { ChefsAdmin } from './pages/admin/ChefsAdmin';
import { CollectionsAdmin } from './pages/admin/CollectionsAdmin';
import { CommentsAdmin } from './pages/admin/CommentsAdmin';
import { UsersAdmin } from './pages/admin/UsersAdmin';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<Navigate to="/admin/recipes" replace />} />
              <Route path="recipes" element={<RecipesAdmin />} />
              <Route path="chefs" element={<ChefsAdmin />} />
              <Route path="collections" element={<CollectionsAdmin />} />
              <Route path="comments" element={<CommentsAdmin />} />
              <Route path="users" element={<UsersAdmin />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProviderComponent>
    </BrowserRouter>
  );
}
