import "./animations.css";

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import useAuth from "./context/useAuth";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";

// Lazy-loaded pages
const Signup = lazy(() => import("./pages/auth/Signup"));
const Signin = lazy(() => import("./pages/auth/Signin"));
const Home = lazy(() => import("./pages/Home"));
const RecipePage = lazy(() => import("./pages/RecipePage"));
const AddRecipe = lazy(() => import("./pages/AddRecipe"));
const SearchRecipe = lazy(() => import("./pages/SearchRecipe"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const EditRecipe = lazy(() => import("./pages/EditRecipe"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const AboutUs = lazy(() => import("./pages/AboutUs"));

function NotFoundRedirect() {
  const { user } = useAuth();

  return <Navigate to={user ? "/home" : "/signin"} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/signin"
              element={
                <PublicRoute>
                  <Signin />
                </PublicRoute>
              }
            />

            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/addrecipe"
              element={
                <ProtectedRoute>
                  <AddRecipe />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recipe/:id"
              element={
                <ProtectedRoute>
                  <RecipePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchRecipe />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recipe/:id/edit"
              element={
                <ProtectedRoute>
                  <EditRecipe />
                </ProtectedRoute>
              }
            />

            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <CategoriesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <AboutUs />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundRedirect />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;