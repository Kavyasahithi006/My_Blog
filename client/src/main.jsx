import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App.jsx';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Rootlayout from './components/RootLayout.jsx';
import Home from './components/common/Home.jsx';
import Signin from './components/common/Signin.jsx';
import Signup from './components/common/Signup.jsx';
import UserProfile from './components/user/UserProfile.jsx';
import AuthorProfile from './components/author/AuthorProfile.jsx';
import Articles from './components/common/Articles.jsx';
import ArticleByID from './components/common/ArticleByID.jsx';
import PostArticle from './components/author/PostArticle.jsx';
import UserAuthorProvider from './contexts/UserAuthorContext.jsx';
import AdminProfile from './components/admin/AdminProfile.jsx';
import ManageUsers from './components/admin/ManageUsers.jsx';

const browserRouterObj = createBrowserRouter([
  {
    path: '/',
    element: <Rootlayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'signin', element: <Signin /> },
      { path: 'signup', element: <Signup /> },
      {
        path: 'user-profile/:email',
        element: <UserProfile />,
        children: [
          { path: 'articles', element: <Articles /> },
          { path: 'articleId/:articleId', element: <ArticleByID /> },
          { path: '', element: <Navigate to="articles" /> },
        ],
      },
      {
        path: 'author-profile/:email',
        element: <AuthorProfile />,
        children: [
          { path: 'articles', element: <Articles /> },
          { path: 'articleId/:articleId', element: <ArticleByID /> },
          { path: 'article', element: <PostArticle /> },
          { path: '', element: <Navigate to="articles" /> },
        ],
      },
      {
        path: 'admin-profile',
        element: <AdminProfile />,
        children: [
          { path: 'users', element: <ManageUsers /> },
          { path: 'articles', element: <Articles /> },
          { path: 'articleId/:articleId', element: <ArticleByID /> },
          { path: '', element: <Navigate to="users" /> }, // Default to Manage Users
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserAuthorProvider>
      <RouterProvider router={browserRouterObj} />
    </UserAuthorProvider>
  </StrictMode>
);
