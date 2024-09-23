import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Header />
      <main className="min-h-screen wrapper">{children}</main>
      <Footer />
    </div>
  );
}
