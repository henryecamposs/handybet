import { Redirect } from 'expo-router';

// Este archivo actúa como el punto de entrada raíz (`/`) de la aplicación.
// Su única función es disparar la navegación inicial hacia la pantalla de login.
// El verdadero enrutador lógico y guardián de rutas se encuentra en `_layout.tsx`.
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
