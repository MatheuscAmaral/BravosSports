import ReactDOM from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { ptBR } from "@clerk/localizations";
import router from './pages/routes';
import AuthProvider from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import ReloadProvider from './contexts/ReloadContext';
import ModalProvider from './contexts/ModalsContext';
import ModalPictureProvider from './contexts/ModalPicture';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
 
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} localization={ptBR}>
        <AuthProvider>
          <ReloadProvider>
            <ModalPictureProvider>
              <ModalProvider>
                <RouterProvider router={router}/>
              </ModalProvider>
            </ModalPictureProvider>
          </ReloadProvider>
        </AuthProvider>
        
        <Toaster
          position="bottom-right"
          reverseOrder={false}
        />
    </ClerkProvider>
)
